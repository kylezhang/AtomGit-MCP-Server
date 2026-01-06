#!/usr/bin/env node

/**
 * Test script for AtomGit MCP Server
 * This script tests various tools without requiring a full MCP client setup
 */

import { AtomGitService } from '../dist/services/AtomGitService.js';

const API_BASE_URL = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
const TOKEN = process.env.ATOMGIT_TOKEN;
const TEST_USERNAME = process.env.TEST_USERNAME || 'zkxw2008';
const TEST_REPOSITORY = process.env.TEST_REPOSITORY;
const TEST_REPO_OWNER = process.env.TEST_REPO_OWNER;

async function testAtomGitService() {
  console.log('Testing AtomGit MCP Server...\n');

  console.log(`🔧 测试配置:`);
  console.log(`   API URL: ${API_BASE_URL}`);
  console.log(`   用户名: ${TEST_USERNAME}`);
  if (TEST_REPOSITORY && TEST_REPO_OWNER) {
    console.log(`   测试仓库: ${TEST_REPO_OWNER}/${TEST_REPOSITORY}`);
  } else {
    console.log(`   测试仓库: 使用默认（可能导致部分测试失败）`);
  }
  console.log('');

  const service = new AtomGitService({
    apiBaseUrl: API_BASE_URL,
    token: TOKEN || undefined,
  });

  const tests = [
    {
      name: 'Get repository',
      test: () => service.getRepository(TEST_USERNAME, TEST_REPOSITORY),
      success: (result) => {
        console.log(`Repo: ${result.name}, Description: ${result.description}`);
        console.log(`Stars: ${result.stargazers_count}, Forks: ${result.forks_count}`);
      }
    },
    {
      name: 'Get user',
      test: () => service.getUser(TEST_USERNAME),
      success: (result) => {
        console.log(`User: ${result.name} (@${result.username})`);
        console.log(`Public repos: ${result.public_repos}`);
      }
    },
    {
      name: 'Get repository branches',
      test: () => service.getRepositoryBranches(TEST_USERNAME, TEST_REPOSITORY),
      success: (result) => {
        console.log(`Found ${result.length} branches`);
        if (result.length > 0) {
          console.log(`First branch: ${result[0].name}`);
        }
      }
    },
    {
      name: 'Get repository commits',
      test: () => service.getRepositoryCommits(TEST_USERNAME, TEST_REPOSITORY, undefined, 1, 5),
      success: (result) => {
        console.log(`Found ${result.length} commits`);
        if (result.length > 0) {
          console.log(`Latest commit: ${result[0].commit.message.substring(0, 50)}...`);
        }
      }
    },
    {
      name: 'Get repository tree',
      test: () => service.getRepositoryTree(TEST_USERNAME, TEST_REPOSITORY, undefined),
      success: (result) => {
        console.log(`Found ${result.tree.length} items in tree`);
        if (result.tree.length > 0) {
          console.log(`First item: ${result.tree[0].path} (${result.tree[0].type})`);
        }
      }
    },
    {
      name: 'Get repository tags',
      test: () => service.getRepositoryTags(TEST_USERNAME, TEST_REPOSITORY, 1, 5),
      success: (result) => {
        console.log(`Found ${result.length} tags`);
        if (result.length > 0) {
          console.log(`First tag: ${result[0].name}`);
        }
      }
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (let i = 0; i < totalTests; i++) {
    const test = tests[i];
    console.log(`${i + 1}. Testing ${test.name}...`);
    
    try {
      const result = await test.test();
      test.success(result);
      console.log('✅ Test passed\n');
      passedTests++;
    } catch (error) {
      console.log('⚠️ Test failed:', error.message);
    }
  }

  console.log(`🎉 AtomGit MCP Server tests completed! ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎊 All tests passed! The MCP server is working correctly.');
  } else {
    console.log('Some tests failed. This might be due to API limitations or authentication requirements.');
  }
}

// Run tests
testAtomGitService().catch(console.error);