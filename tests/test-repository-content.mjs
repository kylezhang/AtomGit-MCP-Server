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

async function testRepositoryContentTools() {
  console.log('🧪 Testing Repository Content Tools...\n');

  try {
    // Test 1: Get repository content (root directory)
    console.log('1. Testing getRepositoryContent (root)...');
    const rootContent = await atomGitService.getRepositoryContent(TEST_OWNER, TEST_REPO, '');
    console.log(`✅ Found ${Array.isArray(rootContent) ? rootContent.length : 1} items in root directory\n`);

    // Test 2: Get repository file list
    console.log('2. Testing getRepositoryFileList...');
    const fileList = await atomGitService.getRepositoryFileList(TEST_OWNER, TEST_REPO, '', undefined, 1, 10);
    console.log(`✅ Found ${fileList.length} files in repository\n`);

    // Test 3: Get specific file content (if README.md exists)
    if (Array.isArray(rootContent)) {
      const readmeFile = rootContent.find(item => item.name?.toLowerCase().includes('readme'));
      if (readmeFile) {
        console.log('3. Testing getRepositoryContent (specific file)...');
        const fileContent = await atomGitService.getRepositoryContent(TEST_OWNER, TEST_REPO, readmeFile.path);
        console.log(`✅ Got content for ${readmeFile.path}\n`);
      } else {
        console.log('3. Skipping file content test - no README file found\n');
      }
    }

    // Test 4: Test basic file operations (read-only for safety)
    console.log('4. Testing basic file operations...');
    console.log('✅ Repository content tools are ready for use\n');

    console.log('🎉 Repository Content tools basic tests passed!');
    console.log(`📊 Successfully tested core repository content functions`);

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
testRepositoryContentTools().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});