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

async function testIssuesTools() {
  console.log('🧪 Testing Issues Tools...\n');

  try {
    // Test 1: Get repository issues
    console.log('1. Testing getRepositoryIssues...');
    const issues = await atomGitService.getRepositoryIssues(TEST_OWNER, TEST_REPO, 'open', 1, 5);
    console.log(`✅ Found ${issues.length} issues\n`);

    if (issues.length > 0) {
      const issueNumber = issues[0].number;
      console.log(`📋 Using Issue #${issueNumber} for detailed testing\n`);

      // Test 2: Get specific issue
      console.log('2. Testing getRepositoryIssue...');
      const issue = await atomGitService.getRepositoryIssue(TEST_OWNER, TEST_REPO, issueNumber);
      console.log(`✅ Got issue: "${issue.title}"\n`);

      // Test 3: Get issue comments
      console.log('3. Testing getRepositoryIssueComments...');
      const comments = await atomGitService.getRepositoryIssueComments(TEST_OWNER, TEST_REPO, issueNumber, 1, 5);
      console.log(`✅ Found ${comments.length} comments\n`);

      // Test 4: Get issue operate logs
      console.log('4. Testing getRepositoryIssueOperateLogs...');
      const logs = await atomGitService.getRepositoryIssueOperateLogs(TEST_OWNER, TEST_REPO, issueNumber, 1, 5);
      console.log(`✅ Found ${logs.length} operate logs\n`);

      console.log('🎉 All Issues tools tests passed!');
      console.log(`📊 Successfully tested ${issues.length > 0 ? '4' : '1'} out of 4 core issue functions`);
    } else {
      console.log('⚠️ No issues found in the test repository.');
      console.log('💡 To fully test issue tools, create a test issue in your repository first.');
      console.log('✅ Basic issue listing functionality works correctly.');
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
testIssuesTools().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});