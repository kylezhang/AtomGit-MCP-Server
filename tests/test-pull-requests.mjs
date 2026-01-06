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
const TEST_OWNER = process.env.TEST_REPO_OWNER || process.env.TEST_USERNAME;
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

async function testPullRequestTools() {
  console.log('🧪 Testing Pull Request Tools...\n');

  try {
    // Test 1: Get repository pulls
    console.log('1. Testing getRepositoryPulls...');
    const pulls = await atomGitService.getRepositoryPulls(TEST_OWNER, TEST_REPO, 'open', 1, 5);
    console.log(`✅ Found ${pulls.length} pull requests\n`);

    if (pulls.length > 0) {
      const pullNumber = pulls[0].number;
      console.log(`📋 Using PR #${pullNumber} for detailed testing\n`);

      // Test 2: Get specific pull request
      console.log('2. Testing getRepositoryPull...');
      const pull = await atomGitService.getRepositoryPull(TEST_OWNER, TEST_REPO, pullNumber);
      console.log(`✅ Got pull request: "${pull.title}"\n`);

      // Test 3: Get pull request comments
      console.log('3. Testing getRepositoryPullComments...');
      const comments = await atomGitService.getRepositoryPullComments(TEST_OWNER, TEST_REPO, pullNumber, 1, 5);
      console.log(`✅ Found ${comments.length} comments\n`);

      // Test 4: Get pull request files
      console.log('4. Testing getRepositoryPullFiles...');
      const files = await atomGitService.getRepositoryPullFiles(TEST_OWNER, TEST_REPO, pullNumber, 1, 5);
      console.log(`✅ Found ${files.length} changed files\n`);

      // Test 5: Get pull request commits
      console.log('5. Testing getRepositoryPullCommits...');
      const commits = await atomGitService.getRepositoryPullCommits(TEST_OWNER, TEST_REPO, pullNumber, 1, 5);
      console.log(`✅ Found ${commits.length} commits\n`);

      // Test 6: Get pull request labels
      console.log('6. Testing getRepositoryPullLabels...');
      const labels = await atomGitService.getRepositoryPullLabels(TEST_OWNER, TEST_REPO, pullNumber, 1, 5);
      console.log(`✅ Found ${labels.length} labels\n`);

      // Test 7: Get merge status
      console.log('7. Testing getRepositoryPullMergeStatus...');
      const mergeStatus = await atomGitService.getRepositoryPullMergeStatus(TEST_OWNER, TEST_REPO, pullNumber);
      console.log(`✅ Merge status retrieved\n`);

      // Test 8: Get operate logs
      console.log('8. Testing getRepositoryPullOperateLogs...');
      const logs = await atomGitService.getRepositoryPullOperateLogs(TEST_OWNER, TEST_REPO, pullNumber, 1, 5);
      console.log(`✅ Found ${logs.length} operate logs\n`);

      console.log('🎉 All Pull Request tools tests passed!');
      console.log(`📊 Successfully tested ${pulls.length > 0 ? '8' : '1'} out of 8 core PR functions`);
    } else {
      console.log('⚠️ No pull requests found in the test repository.');
      console.log('💡 To fully test PR tools, create a test PR in your repository first.');
      console.log('✅ Basic PR listing functionality works correctly.');
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
testPullRequestTools().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});