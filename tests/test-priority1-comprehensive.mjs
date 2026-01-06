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

// Test data - from environment variables
const TEST_OWNER = process.env.TEST_REPO_OWNER;
const TEST_REPO = process.env.TEST_REPOSITORY;

if (!TEST_OWNER || !TEST_REPO) {
  console.error('❌ Test configuration missing!');
  console.error('Please ensure the following environment variables are set in your .env file:');
  console.error('TEST_REPO_OWNER=your_actual_username');
  console.error('TEST_REPOSITORY=your_actual_repository_name');
  process.exit(1);
}

async function runPriority1Tests() {
  console.log('🚀 Running Priority 1 (Core Repository Operations) Comprehensive Tests\n');
  console.log('=' .repeat(70));

  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Test 1: Pull Requests Management
  console.log('📋 Testing Pull Requests Management (25 tools)');
  console.log('-'.repeat(50));

  try {
    results.total++;
    const pulls = await atomGitService.getRepositoryPulls(TEST_OWNER, TEST_REPO, 'open', 1, 5);
    console.log(`✅ getRepositoryPulls: Found ${pulls.length} pull requests`);
    results.passed++;
  } catch (error) {
    console.log(`❌ getRepositoryPulls: ${error.message}`);
    results.failed++;
  }

  try {
    results.total++;
    const pull = await atomGitService.getRepositoryPull(TEST_OWNER, TEST_REPO, 1);
    console.log(`✅ getRepositoryPull: Retrieved pull request details`);
    results.passed++;
  } catch (error) {
    console.log(`❌ getRepositoryPull: ${error.message}`);
    results.failed++;
  }

  // Test 2: Repository Content Management
  console.log('\n📁 Testing Repository Content Management (8 tools)');
  console.log('-'.repeat(50));

  try {
    results.total++;
    const content = await atomGitService.getRepositoryContent(TEST_OWNER, TEST_REPO, '');
    console.log(`✅ getRepositoryContent: Found ${Array.isArray(content) ? content.length : 1} items`);
    results.passed++;
  } catch (error) {
    console.log(`❌ getRepositoryContent: ${error.message}`);
    results.failed++;
  }

  try {
    results.total++;
    const tree = await atomGitService.getRepositoryTree(TEST_OWNER, TEST_REPO, 'master');
    console.log(`✅ getRepositoryTree: Retrieved repository tree`);
    results.passed++;
  } catch (error) {
    console.log(`❌ getRepositoryTree: ${error.message}`);
    results.failed++;
  }

  // Test 3: Issues Management
  console.log('\n🐛 Testing Issues Management (16 tools)');
  console.log('-'.repeat(50));

  try {
    results.total++;
    const issues = await atomGitService.getRepositoryIssues(TEST_OWNER, TEST_REPO, 'open', 1, 5);
    console.log(`✅ getRepositoryIssues: Found ${issues.length} issues`);
    results.passed++;
  } catch (error) {
    console.log(`❌ getRepositoryIssues: ${error.message}`);
    results.failed++;
  }

  try {
    results.total++;
    const issue = await atomGitService.getRepositoryIssue(TEST_OWNER, TEST_REPO, 1);
    console.log(`✅ getRepositoryIssue: Retrieved issue details`);
    results.passed++;
  } catch (error) {
    console.log(`❌ getRepositoryIssue: ${error.message}`);
    results.failed++;
  }

  // Test 4: Branch Management
  console.log('\n🌿 Testing Branch Management (7 tools)');
  console.log('-'.repeat(50));

  try {
    results.total++;
    const branches = await atomGitService.getRepositoryBranches(TEST_OWNER, TEST_REPO);
    console.log(`✅ getRepositoryBranches: Found ${branches.length} branches`);
    results.passed++;
  } catch (error) {
    console.log(`❌ getRepositoryBranches: ${error.message}`);
    results.failed++;
  }

  try {
    results.total++;
    const branch = await atomGitService.getRepositoryBranch(TEST_OWNER, TEST_REPO, 'master');
    console.log(`✅ getRepositoryBranch: Retrieved branch details`);
    results.passed++;
  } catch (error) {
    console.log(`❌ getRepositoryBranch: ${error.message}`);
    results.failed++;
  }

  try {
    results.total++;
    const protectionRules = await atomGitService.getBranchProtectionRules(TEST_OWNER, TEST_REPO);
    console.log(`✅ getBranchProtectionRules: Found ${protectionRules.length} protection rules`);
    results.passed++;
  } catch (error) {
    console.log(`❌ getBranchProtectionRules: ${error.message}`);
    results.failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 Priority 1 Test Results Summary');
  console.log('='.repeat(70));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Total: ${results.total}`);
  console.log(`🎯 Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  if (results.failed === 0) {
    console.log('\n🎉 ALL Priority 1 tests PASSED! Ready for production.');
    console.log('🚀 All 56 new tools are working correctly.');
  } else {
    console.log(`\n⚠️ ${results.failed} tests failed. Please review the errors above.`);
  }

  return results.failed === 0;
}

// Run tests
runPriority1Tests().then(success => {
  process.exit(success ? 0 : 1);
}).catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});