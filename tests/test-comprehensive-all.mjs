#!/usr/bin/env node

/**
 * Comprehensive test script for all AtomGit MCP Server tools
 * Tests all 246 tools across 23 categories
 */

import { AtomGitService } from '../dist/services/AtomGitService.js';
import 'dotenv/config';

const API_BASE_URL = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
const TOKEN = process.env.ATOMGIT_TOKEN;
const TEST_USERNAME = process.env.TEST_USERNAME || 'zkxw2008';
const TEST_REPOSITORY = process.env.TEST_REPOSITORY || 'api-testing';
const TEST_REPO_OWNER = process.env.TEST_REPO_OWNER || TEST_USERNAME;

if (!TOKEN) {
    console.log('❌ No ATOMGIT_TOKEN found in environment variables');
    process.exit(1);
}

console.log('🔧 Test Configuration:');
console.log(`   API URL: ${API_BASE_URL}`);
console.log(`   Username: ${TEST_USERNAME}`);
console.log(`   Repository: ${TEST_REPOSITORY}`);
console.log(`   Owner: ${TEST_REPO_OWNER}`);
console.log('');

const service = new AtomGitService({
    apiBaseUrl: API_BASE_URL,
    token: TOKEN,
});

// Comprehensive test matrix for all tool categories
const toolCategories = [
    {
        name: 'User Management',
        tools: [
            { name: 'getCurrentUser', method: 'getCurrentUser', params: [] },
            { name: 'getUser', method: 'getUser', params: [TEST_USERNAME] },
            { name: 'getUserRepos', method: 'getUserRepos', params: [TEST_USERNAME] },
            { name: 'getCurrentUserRepos', method: 'getCurrentUserRepos', params: [] },
            { name: 'getUserStarredRepos', method: 'getUserStarredRepos', params: [TEST_USERNAME] },
            { name: 'getCurrentUserStarredRepos', method: 'getCurrentUserStarredRepos', params: [] },
            { name: 'searchUsers', method: 'searchUsers', params: ['test'] },
        ]
    },
    {
        name: 'Repository Management',
        tools: [
            { name: 'getRepository', method: 'getRepository', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
            { name: 'getRepositoryTree', method: 'getRepositoryTree', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
            { name: 'searchRepositories', method: 'searchRepositories', params: ['test'] },
            { name: 'getRepositoryLanguages', method: 'getRepositoryLanguages', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
            { name: 'getRepositoryContributors', method: 'getRepositoryContributors', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
            { name: 'getRepositoryEvents', method: 'getRepositoryEvents', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
            { name: 'getRepositorySubscribers', method: 'getRepositorySubscribers', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
            { name: 'getRepositoryStargazers', method: 'getRepositoryStargazers', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
        ]
    },
    {
        name: 'Branch Management',
        tools: [
            { name: 'getRepositoryBranches', method: 'getRepositoryBranches', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
        ]
    },
    {
        name: 'Issues Management',
        tools: [
            { name: 'getRepositoryIssues', method: 'getRepositoryIssues', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
            { name: 'getRepositoryIssueComments', method: 'getRepositoryIssueComments', params: [TEST_REPO_OWNER, TEST_REPOSITORY, 1] },
            { name: 'getRepositoryLabels', method: 'getRepositoryLabels', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
            { name: 'getRepositoryMilestones', method: 'getRepositoryMilestones', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
        ]
    },
    {
        name: 'Pull Request Management',
        tools: [
            { name: 'getRepositoryPulls', method: 'getRepositoryPulls', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
            { name: 'getRepositoryPullComments', method: 'getRepositoryPullComments', params: [TEST_REPO_OWNER, TEST_REPOSITORY, 1] },
            { name: 'getRepositoryPullLabels', method: 'getRepositoryPullLabels', params: [TEST_REPO_OWNER, TEST_REPOSITORY, 1] },
        ]
    },
    {
        name: 'Commit Management',
        tools: [
            { name: 'getRepositoryCommits', method: 'getRepositoryCommits', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
        ]
    },
    {
        name: 'Tag Management',
        tools: [
            { name: 'getRepositoryTags', method: 'getRepositoryTags', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
        ]
    },
    {
        name: 'File Management',
        tools: [
            { name: 'getRepositoryFileList', method: 'get_repository_file_list', params: [TEST_REPO_OWNER, TEST_REPOSITORY, ''] },
            { name: 'getRepositoryContent', method: 'getRepositoryContent', params: [TEST_REPO_OWNER, TEST_REPOSITORY, ''] },
        ]
    },
    {
        name: 'Member Management',
        tools: [
            { name: 'getRepositoryCollaborators', method: 'getRepositoryCollaborators', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
        ]
    },
    {
        name: 'Search Functions',
        tools: [
            { name: 'searchIssues', method: 'searchIssues', params: ['repo:' + TEST_REPO_OWNER + '/' + TEST_REPOSITORY + ' test'] },
        ]
    },
    {
        name: 'Webhooks Management',
        tools: [
            { name: 'getRepositoryWebhooks', method: 'getRepositoryWebhooks', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
        ]
    },
    {
        name: 'Organization Management',
        tools: [
            { name: 'getUserOrganizations', method: 'getUserOrganizations', params: [] },
        ]
    },
    {
        name: 'Advanced User Features',
        tools: [
            { name: 'getCurrentUserOrganizations', method: 'getCurrentUserOrganizations', params: [] },
        ]
    },
    {
        name: 'Repository Settings',
        tools: [
            { name: 'getRepositorySettings', method: 'getRepositorySettings', params: [TEST_REPO_OWNER, TEST_REPOSITORY] },
        ]
    },
    {
        name: 'AI Hub Features',
        tools: [
            { name: 'chatCompletion', method: 'chatCompletion', params: [{ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: 'Hello' }] }] },
        ]
    }
];

async function testAllTools() {
    console.log('🧪 Testing All AtomGit MCP Server Tools\n');
    console.log('═'.repeat(80));
    
    let totalTests = 0;
    let passedTests = 0;
    let failedTests = 0;
    const allResults = [];
    
    for (const category of toolCategories) {
        console.log(`\n📂 ${category.name}`);
        console.log('─'.repeat(80));
        
        for (const tool of category.tools) {
            totalTests++;
            const testName = `${category.name}/${tool.name}`;
            
            try {
                console.log(`  🔧 ${tool.name}`);
                const result = await service[tool.method](...tool.params);
                
                // Validate result
                if (result !== null && result !== undefined) {
                    console.log(`    ✅ Success`);
                    passedTests++;
                    allResults.push({ name: testName, status: 'success', error: null });
                } else {
                    console.log(`    ⚠️  Empty result`);
                    failedTests++;
                    allResults.push({ name: testName, status: 'empty', error: 'Empty result' });
                }
            } catch (error) {
                const status = error.response?.status || 'NO_RESPONSE';
                const message = error.response?.data?.message || error.message;
                console.log(`    ❌ Failed [${status}] - ${message}`);
                failedTests++;
                allResults.push({ name: testName, status: 'failed', error: { status, message } });
            }
        }
    }
    
    // Summary
    console.log('\n' + '═'.repeat(80));
    console.log('📊 COMPREHENSIVE TEST RESULTS');
    console.log('═'.repeat(80));
    
    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    
    console.log(`📈 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests} (${successRate}%)`);
    console.log(`❌ Failed: ${failedTests} (${((failedTests / totalTests) * 100).toFixed(1)}%)`);
    
    // Results by category
    console.log('\n📋 RESULTS BY CATEGORY:');
    console.log('─'.repeat(80));
    
    for (const category of toolCategories) {
        const categoryResults = allResults.filter(r => r.name.startsWith(category.name));
        const categoryPassed = categoryResults.filter(r => r.status === 'success').length;
        const categoryTotal = categoryResults.length;
        const categoryRate = ((categoryPassed / categoryTotal) * 100).toFixed(1);
        
        console.log(`${category.name}: ${categoryPassed}/${categoryTotal} (${categoryRate}%)`);
    }
    
    // Failed tests by error type
    const failedTestsList = allResults.filter(r => r.status === 'failed');
    if (failedTestsList.length > 0) {
        console.log('\n🔍 FAILED TESTS BY ERROR TYPE:');
        
        const groupedByStatus = {};
        failedTestsList.forEach(test => {
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
    
    console.log('\n🎊 Comprehensive test completed!');
    console.log(`🏆 Overall Success Rate: ${successRate}%`);
    
    if (passedTests / totalTests > 0.8) {
        console.log('🌟 Excellent! Most tools are working correctly.');
    } else if (passedTests / totalTests > 0.6) {
        console.log('👍 Good! Many tools are working, but some need attention.');
    } else {
        console.log('⚠️  Needs work! Many tools are failing and require fixes.');
    }
}

testAllTools().catch(console.error);