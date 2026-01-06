#!/usr/bin/env node

/**
 * Test script for AtomGit MCP Server with authentication
 * This script tests both public and authenticated endpoints
 */

import { AtomGitService } from '../dist/services/AtomGitService.js';

const API_BASE_URL = 'https://api.gitcode.com';
const TOKEN = process.env.ATOMGIT_TOKEN;

if (!TOKEN) {
  console.log('⚠️  No ATOMGIT_TOKEN provided. Some tests will fail.');
  console.log('   Set the environment variable to test authenticated endpoints:');
  console.log('   export ATOMGIT_TOKEN=your_token_here');
  console.log('   or create a .env file with ATOMGIT_TOKEN=your_token_here\n');
}

async function testAtomGitService() {
  console.log('Testing AtomGit MCP Server...\n');

  const service = new AtomGitService({
    apiBaseUrl: API_BASE_URL,
    token: TOKEN || undefined,
  });

  // Test cases - only require token for specific operations
  const tests = [
    {
      name: 'Get repository (public)',
      test: () => service.getRepository('GitCode', 'GitCode-Docs'),
      requiresAuth: false
    },
    {
      name: 'Get user (public)',
      test: () => service.getUser('GitCode'),
      requiresAuth: false
    },
    {
      name: 'Search repositories (requires auth)',
      test: () => service.searchRepositories('atomgit', 1, 5),
      requiresAuth: true
    },
    {
      name: 'Search users (requires auth)',
      test: () => service.searchUsers('test', 1, 5),
      requiresAuth: true
    },
    {
      name: 'Get current user (requires auth)',
      test: () => service.getCurrentUser(),
      requiresAuth: true
    },
    {
      name: 'Get current user repos (requires auth)',
      test: () => service.getCurrentUserRepos(),
      requiresAuth: true
    },
    {
      name: 'Get repository branches',
      test: () => service.getRepositoryBranches('GitCode', 'GitCode-Docs'),
      requiresAuth: false
    },
    {
      name: 'Get repository commits',
      test: () => service.getRepositoryCommits('GitCode', 'GitCode-Docs', undefined, 1, 5),
      requiresAuth: false
    },
    {
      name: 'Get repository tree',
      test: () => service.getRepositoryTree('GitCode', 'GitCode-Docs', undefined),
      requiresAuth: false
    },
    {
      name: 'Get repository tags',
      test: () => service.getRepositoryTags('GitCode', 'GitCode-Docs', 1, 5),
      requiresAuth: false
    },
    {
      name: 'Create repository (requires auth)',
      test: () => service.createRepository({
        name: `test-repo-${Date.now()}`,
        description: 'Test repository created by MCP server',
        private: false,
        auto_init: true
      }),
      requiresAuth: true
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;
  let skippedTests = 0;

  for (let i = 0; i < totalTests; i++) {
    const test = tests[i];
    console.log(`${i + 1}. Testing ${test.name}...`);
    
    if (test.requiresAuth && !TOKEN) {
      console.log('⏭️  Skipped (requires authentication)\n');
      skippedTests++;
      continue;
    }
    
    try {
      const result = await test.test();
      
      // Handle different result types
      if (Array.isArray(result)) {
        console.log(`Found ${result.length} items`);
        if (result.length > 0 && typeof result[0] === 'object') {
          const firstItem = result[0];
          if (firstItem.name) {
            console.log(`First item: ${firstItem.name}`);
          } else if (firstItem.username) {
            console.log(`First item: ${firstItem.username}`);
          }
        }
      } else if (typeof result === 'object' && result !== null) {
        if (result.name && result.full_name) {
          console.log(`Repo: ${result.name} by ${result.owner?.username || 'unknown'}`);
          console.log(`Description: ${result.description || 'No description'}`);
        } else if (result.username) {
          console.log(`User: ${result.name} (@${result.username})`);
          console.log(`Public repos: ${result.public_repos || 0}`);
        } else {
          console.log('Result:', JSON.stringify(result, null, 2));
        }
      } else {
        console.log('Result:', result);
      }
      
      console.log('✅ Test passed\n');
      passedTests++;
    } catch (error) {
      console.log('⚠️ Test failed:', error.message);
      
      // Provide helpful error messages
      if (error.response?.status === 401) {
        console.log('   Authentication required. Check your token.');
      } else if (error.response?.status === 403) {
        console.log('   Permission denied. Token might lack required scopes.');
      } else if (error.response?.status === 404) {
        console.log('   Resource not found. The repository or user might not exist.');
      }
      console.log('');
    }
  }

  console.log(`🎉 AtomGit MCP Server tests completed!`);
  console.log(`📊 Results: ${passedTests}/${totalTests - skippedTests} tests passed, ${skippedTests} skipped`);
  
  if (passedTests === totalTests - skippedTests) {
    console.log('🎊 All applicable tests passed! The MCP server is working correctly.');
  } else {
    console.log('Some tests failed. This might be due to:');
    console.log('- Missing or invalid authentication token');
    console.log('- Insufficient permissions on the token');
    console.log('- Network connectivity issues');
    console.log('- API rate limiting');
  }
}

// Run tests
testAtomGitService().catch(console.error);