#!/usr/bin/env node

/**
 * Comprehensive test script for AtomGit MCP Server tools
 * Tests all implemented tools with real token
 */

import { AtomGitService } from './dist/services/AtomGitService.js';

// Load environment variables
import 'dotenv/config';

const API_BASE_URL = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
const TOKEN = process.env.ATOMGIT_TOKEN;

if (!TOKEN) {
  console.log('❌ No ATOMGIT_TOKEN found in environment variables');
  console.log('   Please set ATOMGIT_TOKEN in your .env file');
  console.log('   Current .env file contents check:');
  
  // Try to read .env file content for debugging
  try {
    const fs = await import('fs');
    const envContent = await fs.default.readFile('.env', 'utf8');
    console.log('   .env file exists, content:');
    console.log('   ', envContent.split('\n').filter(line => line.includes('ATOMGIT_TOKEN=')).join('\n    '));
  } catch (error) {
    console.log('   Could not read .env file:', error.message);
  }
  
  process.exit(1);
}

console.log('🔑 Using token:', TOKEN.substring(0, 8) + '...');

const service = new AtomGitService({
  apiBaseUrl: API_BASE_URL,
  token: TOKEN,
});

// Test matrix organized by AtomGit API categories
const testCategories = [
  {
    name: 'Repositories',
    tools: [
      {
        name: 'get_repository',
        test: () => service.getRepository('GitCode', 'GitCode-Docs'),
        requiresAuth: false
      },
      {
        name: 'get_repository_tree', 
        test: () => service.getRepositoryTree('GitCode', 'GitCode-Docs'),
        requiresAuth: false
      },
      {
        name: 'search_repositories',
        test: () => service.searchRepositories('atomgit', 1, 3),
        requiresAuth: true
      },
      {
        name: 'create_repository',
        test: () => service.createRepository({
          name: `test-mcp-${Date.now()}`,
          description: 'Test repository created by MCP server',
          private: false,
          auto_init: true
        }),
        requiresAuth: true
      }
    ]
  },
  {
    name: 'Users',
    tools: [
      {
        name: 'get_current_user',
        test: () => service.getCurrentUser(),
        requiresAuth: true
      },
      {
        name: 'get_user',
        test: () => service.getUser('GitCode'),
        requiresAuth: false
      },
      {
        name: 'get_user_repos',
        test: () => service.getUserRepos('GitCode'),
        requiresAuth: false
      },
      {
        name: 'get_current_user_repos',
        test: () => service.getCurrentUserRepos(),
        requiresAuth: true
      },
      {
        name: 'get_user_starred_repos',
        test: () => service.getUserStarredRepos('GitCode'),
        requiresAuth: false
      },
      {
        name: 'get_current_user_starred_repos',
        test: () => service.getCurrentUserStarredRepos(),
        requiresAuth: true
      },
      {
        name: 'search_users',
        test: () => service.searchUsers('test', 1, 3),
        requiresAuth: true
      }
    ]
  },
  {
    name: 'Branch',
    tools: [
      {
        name: 'get_repository_branches',
        test: () => service.getRepositoryBranches('GitCode', 'GitCode-Docs'),
        requiresAuth: false
      }
    ]
  },
  {
    name: 'Issues',
    tools: [
      {
        name: 'get_repository_issues',
        test: () => service.getRepositoryIssues('GitCode', 'GitCode-Docs', 'open', 1, 3),
        requiresAuth: false
      },
      {
        name: 'create_repository_issue',
        test: () => service.createRepositoryIssue('GitCode', 'GitCode-Docs', {
          title: `Test Issue from MCP ${Date.now()}`,
          body: 'This is a test issue created by AtomGit MCP Server'
        }),
        requiresAuth: true
      },
      {
        name: 'get_repository_issue',
        test: () => service.getRepositoryIssue('GitCode', 'GitCode-Docs', 1),
        requiresAuth: false
      }
    ]
  },
  {
    name: 'Pull Requests',
    tools: [
      {
        name: 'get_repository_pulls',
        test: () => service.getRepositoryPulls('GitCode', 'GitCode-Docs', 'open', 1, 3),
        requiresAuth: false
      },
      {
        name: 'get_repository_pull',
        test: () => service.getRepositoryPull('GitCode', 'GitCode-Docs', 1),
        requiresAuth: false
      }
    ]
  },
  {
    name: 'Commit',
    tools: [
      {
        name: 'get_repository_commits',
        test: () => service.getRepositoryCommits('GitCode', 'GitCode-Docs', undefined, 1, 3),
        requiresAuth: false
      },
      {
        name: 'get_repository_commit',
        test: () => service.getRepositoryCommit('GitCode', 'GitCode-Docs', 'main'),
        requiresAuth: false
      }
    ]
  },
  {
    name: 'Tag',
    tools: [
      {
        name: 'get_repository_tags',
        test: () => service.getRepositoryTags('GitCode', 'GitCode-Docs', 1, 5),
        requiresAuth: false
      }
    ]
  }
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;
const results = [];

console.log('🧪 Testing All AtomGit MCP Server Tools\n');
console.log('================================================');

for (const category of testCategories) {
  console.log(`\n📂 ${category.name} Category`);
  console.log('─'.repeat(40));
  
  for (const tool of category.tools) {
    totalTests++;
    const testResult = {
      category: category.name,
      tool: tool.name,
      status: 'pending',
      error: null,
      requiresAuth: tool.requiresAuth
    };
    
    console.log(`\n  🔧 ${tool.name}`);
    
    if (tool.requiresAuth && !TOKEN) {
      console.log(`    ⏭️  Skipped (requires authentication)`);
      testResult.status = 'skipped';
      skippedTests++;
    } else {
      try {
        console.log(`    🔄 Testing...`);
        const result = await tool.test();
        
        // Handle different result types
        if (Array.isArray(result)) {
          console.log(`    ✅ Success - Found ${result.length} items`);
          if (result.length > 0 && typeof result[0] === 'object') {
            const firstItem = result[0];
            if (firstItem.name) {
              console.log(`    📋 First item: ${firstItem.name}`);
            } else if (firstItem.username) {
              console.log(`    👤 First item: ${firstItem.username}`);
            }
          }
        } else if (typeof result === 'object' && result !== null) {
          if (result.name && result.full_name) {
            console.log(`    📦 Repository: ${result.name} by ${result.owner?.username || 'unknown'}`);
            console.log(`    ⭐ Stars: ${result.stargazers_count || 0}, 🍴 Forks: ${result.forks_count || 0}`);
          } else if (result.username) {
            console.log(`    👤 User: ${result.name} (@${result.username})`);
            console.log(`    📦 Repositories: ${result.public_repos || 0}`);
          } else {
            console.log(`    ✅ Success - ${JSON.stringify(result).substring(0, 100)}...`);
          }
        } else {
          console.log(`    ✅ Success - ${result}`);
        }
        
        testResult.status = 'passed';
        passedTests++;
      } catch (error) {
        console.log(`    ❌ Failed: ${error.message}`);
        if (error.response) {
          console.log(`    📊 Status: ${error.response.status} ${error.response.statusText}`);
          if (error.response.status === 401) {
            console.log(`    🔑 Authentication required - Check your token`);
          } else if (error.response.status === 403) {
            console.log(`    🚫 Permission denied - Token might lack required scopes`);
          } else if (error.response.status === 404) {
            console.log(`    🔍 Not found - Resource might not exist`);
          } else if (error.response.status === 429) {
            console.log(`    ⏱️ Rate limited - Too many requests`);
          }
        }
        
        testResult.status = 'failed';
        testResult.error = error.message;
        failedTests++;
      }
    }
    
    results.push(testResult);
  }
}

console.log('\n' + '='.repeat(50));
console.log('📊 TEST RESULTS SUMMARY');
console.log('='.repeat(50));

// Print results by category
for (const category of testCategories) {
  const categoryResults = results.filter(r => r.category === category.name);
  const passed = categoryResults.filter(r => r.status === 'passed').length;
  const failed = categoryResults.filter(r => r.status === 'failed').length;
  const skipped = categoryResults.filter(r => r.status === 'skipped').length;
  const total = categoryResults.length;
  
  console.log(`\n📂 ${category.name}: ${passed}/${total - skipped} tested ✅ | ${failed} failed ❌ | ${skipped} skipped ⏭️`);
}

console.log('\n' + '='.repeat(50));
console.log('🎯 OVERALL SUMMARY');
console.log('='.repeat(50));
console.log(`📈 Total Tests: ${totalTests}`);
console.log(`✅ Passed: ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
console.log(`❌ Failed: ${failedTests} (${((failedTests/totalTests)*100).toFixed(1)}%)`);
console.log(`⏭️ Skipped: ${skippedTests} (${((skippedTests/totalTests)*100).toFixed(1)}%)`);

console.log('\n🔍 Detailed Results:');
results.forEach(result => {
  const status = result.status === 'passed' ? '✅' : 
                result.status === 'failed' ? '❌' : '⏭️';
  const auth = result.requiresAuth ? '🔑' : '🌐';
  console.log(`  ${status} ${auth} ${result.category}/${result.tool} - ${result.status}`);
  if (result.error) {
    console.log(`       Error: ${result.error}`);
  }
});

console.log('\n🎊 Test completed!');
if (passedTests > 0) {
  console.log('✅ Some tools are working correctly!');
}
if (failedTests > 0) {
  console.log('⚠️  Some tools failed. This may be due to:');
  console.log('   - Missing or invalid authentication token');
  console.log('   - Insufficient API permissions');
  console.log('   - API rate limiting');
  console.log('   - Network connectivity issues');
  console.log('   - Changes in AtomGit API');
}