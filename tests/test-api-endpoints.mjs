#!/usr/bin/env node

import { AtomGitService } from '../dist/services/AtomGitService.js';
import 'dotenv/config';

const API_BASE_URL = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
const TOKEN = process.env.ATOMGIT_TOKEN;

if (!TOKEN) {
    console.log('❌ No ATOMGIT_TOKEN found in environment variables');
    process.exit(1);
}

const service = new AtomGitService({
    apiBaseUrl: API_BASE_URL,
    token: TOKEN,
});

async function testSpecificAPIs() {
    console.log('🔍 Testing Specific API Endpoints for 404/403 Errors...\n');
    
    const testRepo = process.env.TEST_REPOSITORY || 'api-testing';
    const testOwner = process.env.TEST_REPO_OWNER || 'zkxw2008';
    
    // First get some dynamic data for testing
    let branchName = 'master'; // Default branch name
    let commitSha = null;
    let fileSha = null;
    
    try {
        const branches = await service.getRepositoryBranches(testOwner, testRepo);
        if (branches.length > 0) {
            branchName = branches[0].name;
        }
        
        const commits = await service.getRepositoryCommits(testOwner, testRepo);
        if (commits.length > 0) {
            commitSha = commits[0].sha;
        }
        
        const fileList = await service.get_repository_file_list(testOwner, testRepo, '');
        const readmeFile = fileList.find(file => file.name === 'README.md');
        if (readmeFile) {
            fileSha = readmeFile.sha;
        }
    } catch (error) {
        console.log('⚠️  Could not get dynamic data, using defaults');
    }
    
    const tests = [
        // Repository APIs that commonly fail
        { name: 'getRepository', params: [testOwner, testRepo] },
        { name: 'getRepositoryTree', params: [testOwner, testRepo] },
        { name: 'getRepositorySettings', params: [testOwner, testRepo] },
        { name: 'getRepositoryLanguages', params: [testOwner, testRepo] },
        { name: 'getRepositoryContributors', params: [testOwner, testRepo] },
        { name: 'getRepositoryEvents', params: [testOwner, testRepo] },
        
        // File operations
        { name: 'get_repository_file_list', params: [testOwner, testRepo, ''] },
        { name: 'getRepositoryFileBlob', params: [testOwner, testRepo, fileSha || 'invalid-sha'] },
        
        // Branch operations
        { name: 'getRepositoryBranch', params: [testOwner, testRepo, branchName] },
        { name: 'createBranchProtectionRule', params: [testOwner, testRepo, {}] },
        
        // Commit operations
        { name: 'getRepositoryCommit', params: [testOwner, testRepo, commitSha || 'invalid-sha'] },
        { name: 'getRepositoryCommitDiff', params: [testOwner, testRepo, commitSha || 'invalid-sha'] },
        { name: 'getRepositoryCommitPatch', params: [testOwner, testRepo, commitSha || 'invalid-sha'] },
        
        // Issue operations
        { name: 'getRepositoryIssueComments', params: [testOwner, testRepo, 1] },
        
        // Pull Request operations
        { name: 'getRepositoryPull', params: [testOwner, testRepo, 1] },
        { name: 'getRepositoryPullFiles', params: [testOwner, testRepo, 1] },
        
        // Label operations
        { name: 'getRepositoryLabels', params: [testOwner, testRepo] },
        { name: 'createRepositoryLabel', params: [testOwner, testRepo, { name: 'test-label', color: 'ff0000' }] },
        
        // Milestone operations
        { name: 'getRepositoryMilestones', params: [testOwner, testRepo] },
        
        // Release operations
        { name: 'getReleaseAssets', params: [testOwner, testRepo, 1] },
        
        // Member operations
        { name: 'getRepositoryCollaborators', params: [testOwner, testRepo] },
        
        // Search operations
        { name: 'searchCode', params: [testOwner, testRepo, 'test'] },
        
        // Webhook operations
        { name: 'getRepositoryWebhooks', params: [testOwner, testRepo] },
    ];
    
    const results = [];
    
    for (const test of tests) {
        try {
            console.log(`🔧 Testing ${test.name}(${test.params.join(', ')})...`);
            const result = await service[test.name](...test.params);
            console.log(`✅ Success - ${JSON.stringify(result).substring(0, 100)}...`);
            results.push({ name: test.name, status: 'success', error: null });
        } catch (error) {
            const status = error.response?.status || 'NO_RESPONSE';
            const message = error.response?.data?.message || error.message;
            console.log(`❌ Failed [${status}] - ${message}`);
            results.push({ name: test.name, status: 'failed', error: { status, message } });
        }
        console.log('─'.repeat(80));
    }
    
    // Summary by error type
    console.log('\n📊 ERROR SUMMARY:');
    console.log('═'.repeat(80));
    
    const failedTests = results.filter(r => r.status === 'failed');
    const successTests = results.filter(r => r.status === 'success');
    
    console.log(`✅ Successful: ${successTests.length}`);
    console.log(`❌ Failed: ${failedTests.length}`);
    console.log(`📈 Success Rate: ${((successTests.length / results.length) * 100).toFixed(1)}%`);
    
    if (failedTests.length > 0) {
        console.log('\n🔍 FAILED TESTS BY ERROR TYPE:');
        
        const groupedByStatus = {};
        failedTests.forEach(test => {
            const status = test.error.status;
            if (!groupedByStatus[status]) {
                groupedByStatus[status] = [];
            }
            groupedByStatus[status].push(test);
        });
        
        Object.keys(groupedByStatus).forEach(status => {
            console.log(`\n❌ HTTP ${status} (${groupedByStatus[status].length} tests):`);
            groupedByStatus[status].forEach(test => {
                console.log(`   • ${test.name}: ${test.error.message}`);
            });
        });
    }
    
    console.log('\n🎯 RECOMMENDATIONS:');
    if (failedTests.filter(t => t.error?.status === 404).length > 0) {
        console.log('• Some endpoints return 404 - API paths may have changed');
    }
    if (failedTests.filter(t => t.error?.status === 403).length > 0) {
        console.log('• Some endpoints return 403 - authentication or permission issues');
    }
    if (failedTests.filter(t => t.error?.status === 400).length > 0) {
        console.log('• Some endpoints return 400 - invalid parameters or missing data');
    }
}

testSpecificAPIs().catch(console.error);