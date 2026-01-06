#!/usr/bin/env node

/**
 * Test script for AtomGit MCP Server
 * This script tests various tools without requiring a full MCP client setup
 */

import { AtomGitService } from '../dist/services/AtomGitService.js';

const API_BASE_URL = 'https://api.gitcode.com';
// You can provide a token for authenticated requests, or leave it null for public data only
const TOKEN = process.env.ATOMGIT_TOKEN;

async function testAtomGitService() {
  console.log('Testing AtomGit MCP Server...\n');

  const service = new AtomGitService({
    apiBaseUrl: API_BASE_URL,
    token: TOKEN || undefined,
  });

  const tests = [
    {
      name: 'Get repository',
      test: () => service.getRepository('GitCode', 'GitCode-Docs'),
      success: (result) => {
        console.log(`Repo: ${result.name}, Description: ${result.description}`);
        console.log(`Stars: ${result.stargazers_count}, Forks: ${result.forks_count}`);
      }
    },
    {
      name: 'Get user',
      test: () => service.getUser('GitCode'),
      success: (result) => {
        console.log(`User: ${result.name} (@${result.username})`);
        console.log(`Public repos: ${result.public_repos}`);
      }
    },
    {
      name: 'Get repository branches',
      test: () => service.getRepositoryBranches('GitCode', 'GitCode-Docs'),
      success: (result) => {
        console.log(`Found ${result.length} branches`);
        if (result.length > 0) {
          console.log(`First branch: ${result[0].name}`);
        }
      }
    },
    {
      name: 'Get repository commits',
      test: () => service.getRepositoryCommits('GitCode', 'GitCode-Docs', undefined, 1, 5),
      success: (result) => {
        console.log(`Found ${result.length} commits`);
        if (result.length > 0) {
          console.log(`Latest commit: ${result[0].commit.message.substring(0, 50)}...`);
        }
      }
    },
    {
      name: 'Get repository tree',
      test: () => service.getRepositoryTree('GitCode', 'GitCode-Docs', undefined),
      success: (result) => {
        console.log(`Found ${result.tree.length} items in tree`);
        if (result.tree.length > 0) {
          console.log(`First item: ${result.tree[0].path} (${result.tree[0].type})`);
        }
      }
    },
    {
      name: 'Get repository tags',
      test: () => service.getRepositoryTags('GitCode', 'GitCode-Docs', 1, 5),
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