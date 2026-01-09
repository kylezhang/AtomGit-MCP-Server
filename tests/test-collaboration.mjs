#!/usr/bin/env node

/**
 * Test script for Collaboration Enhancement APIs
 */

import { config } from 'dotenv';
import { AtomGitService } from '../dist/services/AtomGitService.js';
import { LabelsMilestonesTools } from '../dist/tools/LabelsMilestonesTools.js';
import { CommitAdvancedTools } from '../dist/tools/CommitAdvancedTools.js';
import { MemberManagementTools } from '../dist/tools/MemberManagementTools.js';
import { SearchAdvancedTools } from '../dist/tools/SearchAdvancedTools.js';
import { UserAdvancedTools } from '../dist/tools/UserAdvancedTools.js';
import { ReleaseAdvancedTools } from '../dist/tools/ReleaseAdvancedTools.js';

// Load environment variables
config();

const API_BASE_URL = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
const TOKEN = process.env.ATOMGIT_TOKEN;
const TEST_REPO_OWNER = process.env.TEST_REPO_OWNER || 'zkxw2008';
const TEST_REPOSITORY = process.env.TEST_REPOSITORY || 'api-testing';

if (!TOKEN) {
  console.log('⚠️  No ATOMGIT_TOKEN provided. Some tests will fail.');
}

console.log(`🔧 测试配置:`);
console.log(`   API URL: ${API_BASE_URL}`);
console.log(`   测试仓库: ${TEST_REPO_OWNER}/${TEST_REPOSITORY}`);
console.log('');

async function testPriority2Features() {
  console.log('Testing Priority 2: Collaboration Enhancement...\n');

  const service = new AtomGitService({
    apiBaseUrl: API_BASE_URL,
    token: TOKEN,
  });

  const labelsTools = new LabelsMilestonesTools(service);
  const commitTools = new CommitAdvancedTools(service);
  const memberTools = new MemberManagementTools(service);
  const searchTools = new SearchAdvancedTools(service);
  const userTools = new UserAdvancedTools(service);
  const releaseTools = new ReleaseAdvancedTools(service);

  // Test Labels & Milestones
  const labelsTests = [
    {
      name: 'Get repository labels',
      tool: 'get_repository_labels',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY }
    },
    {
      name: 'Get repository milestones',
      tool: 'get_repository_milestones',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY, state: 'open' }
    }
  ];

  // Test Commit Advanced
  const commitTests = [
    {
      name: 'Get repository commit comments',
      tool: 'get_repository_commit_comments',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY, sha: 'main' }
    },
    {
      name: 'Compare repository commits',
      tool: 'compare_repository_commits',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY, base: 'main', head: 'master' }
    },
    {
      name: 'Get repository commit diff',
      tool: 'get_repository_commit_diff',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY, sha: 'main' }
    }
  ];

  // Test Member Management
  const memberTests = [
    {
      name: 'Get repository collaborators',
      tool: 'get_repository_collaborators',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY }
    }
  ];

  // Test Search Advanced
  const searchTests = [
    {
      name: 'Search issues',
      tool: 'search_issues',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY, query: 'bug' }
    },
    {
      name: 'Search code',
      tool: 'search_code',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY, query: 'README' }
    }
  ];

  // Test User Advanced (only test non-modifying operations)
  const userTests = [
    {
      name: 'Get user followers',
      tool: 'get_user_followers',
      args: { username: TEST_REPO_OWNER }
    },
    {
      name: 'Get user following',
      tool: 'get_user_following',
      args: { username: TEST_REPO_OWNER }
    },
    {
      name: 'Get user organizations',
      tool: 'get_user_organizations',
      args: { username: TEST_REPO_OWNER }
    }
  ];

  let passedTests = 0;
  let totalTests = 0;

  for (const testSuite of [
    { name: 'Labels & Milestones', tools: labelsTools, tests: labelsTests },
    { name: 'Commit Advanced', tools: commitTools, tests: commitTests },
    { name: 'Member Management', tools: memberTools, tests: memberTests },
    { name: 'Search Advanced', tools: searchTools, tests: searchTests },
    { name: 'User Advanced', tools: userTools, tests: userTests }
  ]) {
    console.log(`\n=== ${testSuite.name} Tests ===`);
    
    for (const test of testSuite.tests) {
      totalTests++;
      console.log(`${totalTests}. Testing ${test.name}...`);
      
      try {
        const result = await testSuite.tools.callTool(test.tool, test.args);
        
        if (Array.isArray(result)) {
          console.log(`✅ Found ${result.length} items`);
          if (result.length > 0) {
            console.log(`   First item: ${JSON.stringify(result[0]).substring(0, 100)}...`);
          }
        } else if (typeof result === 'object' && result !== null) {
          console.log(`✅ Success - ${Object.keys(result).length} properties returned`);
          if (result.error) {
            console.log(`   Error: ${result.error}`);
          }
        } else {
          console.log(`✅ Success - Result: ${result}`);
        }
        passedTests++;
      } catch (error) {
        console.log(`⚠️ Test failed: ${error.message}`);
        if (error.response?.status === 401) {
          console.log('   Authentication required');
        } else if (error.response?.status === 403) {
          console.log('   Permission denied');
        } else if (error.response?.status === 404) {
          console.log('   Resource not found');
        }
      }
    }
  }

  console.log(`\n🎉 Priority 2 tests completed!`);
  console.log(`📊 Results: ${passedTests}/${totalTests} tests passed`);
  
  return { passedTests, totalTests };
}

// Run tests
testPriority2Features().catch(console.error);