#!/usr/bin/env node

import { config } from 'dotenv';
import { AtomGitService } from '../dist/services/AtomGitService.js';

// Load environment variables
config();

const ATOMGIT_API_BASE_URL = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
const ATOMGIT_TOKEN = process.env.ATOMGIT_TOKEN;

if (!ATOMGIT_TOKEN) {
  console.error('ATOMGIT_TOKEN environment variable is required');
  process.exit(1);
}

const atomGitService = new AtomGitService({
  apiBaseUrl: ATOMGIT_API_BASE_URL,
  token: ATOMGIT_TOKEN
});

// Test data - replace with actual values from your environment
const TEST_OWNER = process.env.TEST_REPO_OWNER;
const TEST_REPO = process.env.TEST_REPOSITORY;

if (!TEST_OWNER || !TEST_REPO) {
  console.error('❌ Test configuration missing!');
  console.error('Please set the following environment variables in your .env file:');
  console.error('TEST_REPO_OWNER=your_actual_username');
  console.error('TEST_REPOSITORY=your_actual_repository_name');
  console.error('');
  console.error('Example:');
  console.error('TEST_REPO_OWNER=myusername');
  console.error('TEST_REPOSITORY=my-repo');
  process.exit(1);
}

async function testBranchTools() {
  console.log('🧪 Testing Branch Management Tools...\n');

  try {
    // Test 1: Get repository branches
    console.log('1. Testing getRepositoryBranches...');
    const branches = await atomGitService.getRepositoryBranches(TEST_OWNER, TEST_REPO);
    console.log(`✅ Found ${branches.length} branches\n`);

    if (branches.length > 0) {
      const branchName = branches[0].name;
      console.log(`📋 Using branch "${branchName}" for detailed testing\n`);

      // Test 2: Get specific branch
      console.log('2. Testing getRepositoryBranch...');
      const branch = await atomGitService.getRepositoryBranch(TEST_OWNER, TEST_REPO, branchName);
      console.log(`✅ Got branch: "${branch.name}" (SHA: ${branch.commit.sha.substring(0, 7)})\n`);

      // Test 3: Get branch protection rules
      console.log('3. Testing getBranchProtectionRules...');
      const protectionRules = await atomGitService.getBranchProtectionRules(TEST_OWNER, TEST_REPO);
      console.log(`✅ Found ${protectionRules.length} branch protection rules\n`);

      console.log('🎉 All Branch tools tests passed!');
      console.log(`📊 Successfully tested 3 out of 3 core branch functions`);
    } else {
      console.log('⚠️ No branches found in the test repository.');
      console.log('✅ Basic branch listing functionality works correctly.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run tests
testBranchTools().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});