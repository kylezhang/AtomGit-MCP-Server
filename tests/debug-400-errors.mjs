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

async function debug400Errors() {
    console.log('🔍 Debugging 400 Errors...\n');
    
    const testRepo = process.env.TEST_REPOSITORY || 'api-testing';
    const testOwner = process.env.TEST_REPO_OWNER || 'zkxw2008';
    
    // Test 1: getRepositoryFileBlob - need actual SHA
    console.log('🔧 Testing getRepositoryFileBlob with invalid SHA...');
    try {
        const result = await service.getRepositoryFileBlob(testOwner, testRepo, 'README.md');
        console.log('✅ Unexpected success:', result);
    } catch (error) {
        console.log('❌ Expected error:', error.response?.status, error.response?.data?.message);
    }
    
    // First get the actual file list to get a real SHA
    console.log('\n🔧 Getting file list to find real SHA...');
    try {
        const fileList = await service.get_repository_file_list(testOwner, testRepo, '');
        const readmeFile = fileList.find(file => file.name === 'README.md');
        if (readmeFile) {
            console.log('📄 Found README.md with SHA:', readmeFile.sha);
            
            console.log('\n🔧 Testing getRepositoryFileBlob with correct SHA...');
            try {
                const blob = await service.getRepositoryFileBlob(testOwner, testRepo, readmeFile.sha);
                console.log('✅ Success with SHA:', blob ? 'data received' : 'no data');
            } catch (error) {
                console.log('❌ Still failed:', error.response?.status, error.response?.data?.message);
            }
        }
    } catch (error) {
        console.log('❌ Could not get file list:', error.message);
    }
    
    // Test 2: getRepositoryBranch - need actual branch name
    console.log('\n🔧 Testing getRepositoryBranch...');
    try {
        const branches = await service.getRepositoryBranches(testOwner, testRepo);
        console.log('📋 Available branches:', branches.map(b => b.name));
        
        if (branches.length > 0) {
            const branchName = branches[0].name;
            console.log(`\n🔧 Testing getRepositoryBranch with ${branchName}...`);
            try {
                const branch = await service.getRepositoryBranch(testOwner, testRepo, branchName);
                console.log('✅ Success:', branch.name);
            } catch (error) {
                console.log('❌ Still failed:', error.response?.status, error.response?.data?.message);
            }
        }
    } catch (error) {
        console.log('❌ Could not get branches:', error.message);
    }
    
    // Test 3: getRepositoryCommit - need actual commit SHA
    console.log('\n🔧 Testing getRepositoryCommit...');
    try {
        const commits = await service.getRepositoryCommits(testOwner, testRepo);
        console.log('📋 Available commits:', commits.length);
        
        if (commits.length > 0) {
            const commitSha = commits[0].sha;
            console.log(`\n🔧 Testing getRepositoryCommit with SHA ${commitSha}...`);
            try {
                const commit = await service.getRepositoryCommit(testOwner, testRepo, commitSha);
                console.log('✅ Success:', commit.sha);
            } catch (error) {
                console.log('❌ Still failed:', error.response?.status, error.response?.data?.message);
            }
        }
    } catch (error) {
        console.log('❌ Could not get commits:', error.message);
    }
    
    // Test 4: getRepositoryPull - need actual PR number
    console.log('\n🔧 Testing getRepositoryPull...');
    try {
        const pulls = await service.getRepositoryPulls(testOwner, testRepo);
        console.log('📋 Available PRs:', pulls.length);
        
        if (pulls.length > 0) {
            const pullNumber = pulls[0].number;
            console.log(`\n🔧 Testing getRepositoryPull with PR ${pullNumber}...`);
            try {
                const pull = await service.getRepositoryPull(testOwner, testRepo, pullNumber);
                console.log('✅ Success:', pull.number);
            } catch (error) {
                console.log('❌ Still failed:', error.response?.status, error.response?.data?.message);
            }
        } else {
            console.log('ℹ️  No PRs available to test with');
        }
    } catch (error) {
        console.log('❌ Could not get PRs:', error.message);
    }
    
    // Test 5: createRepositoryLabel - need proper data
    console.log('\n🔧 Testing createRepositoryLabel with empty object...');
    try {
        const result = await service.createRepositoryLabel(testOwner, testRepo, {});
        console.log('✅ Unexpected success:', result);
    } catch (error) {
        console.log('❌ Expected error:', error.response?.status, error.response?.data?.message);
        
        console.log('\n🔧 Testing createRepositoryLabel with proper data...');
        try {
            const labelData = {
                name: 'test-label',
                color: 'ff0000',
                description: 'Test label for debugging'
            };
            const result = await service.createRepositoryLabel(testOwner, testRepo, labelData);
            console.log('✅ Success with proper data:', result.name);
        } catch (error) {
            console.log('❌ Still failed:', error.response?.status, error.response?.data?.message);
        }
    }
}

debug400Errors().catch(console.error);