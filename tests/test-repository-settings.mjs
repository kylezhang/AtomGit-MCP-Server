#!/usr/bin/env node

/**
 * Test script for Repository Settings & Configuration APIs
 */

import { config } from 'dotenv';
import { AtomGitService } from '../dist/services/AtomGitService.js';
import { RepositorySettingsTools } from '../dist/tools/RepositorySettingsTools.js';
import { RepositoryAdvancedTools } from '../dist/tools/RepositoryAdvancedTools.js';
import { RepositoryManagementAdvancedTools } from '../dist/tools/RepositoryManagementAdvancedTools.js';

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
console.log(`   Test Repository: ${TEST_REPO_OWNER}/${TEST_REPOSITORY}`);

async function testRepositorySettingsFeatures() {
  console.log('Testing Repository Settings & Configuration...\n');

  const service = new AtomGitService({
    apiBaseUrl: API_BASE_URL,
    token: TOKEN,
  });

  const settingsTools = new RepositorySettingsTools(service);
  const advancedTools = new RepositoryAdvancedTools(service);
  const managementTools = new RepositoryManagementAdvancedTools(service);

  // Test Repository Settings
  const settingsTests = [
    {
      name: 'Get repository settings',
      tool: 'get_repository_settings',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY }
    },
    {
      name: 'Get repository PR settings',
      tool: 'get_repository_pull_request_settings', 
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY }
    },
    {
      name: 'Get repository push config',
      tool: 'get_repository_push_config',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY }
    }
  ];

  // Test Repository Advanced Features
  const advancedTests = [
    {
      name: 'Get repository languages',
      tool: 'get_repository_languages',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY }
    },
    {
      name: 'Get repository contributors',
      tool: 'get_repository_contributors',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY }
    },
    {
      name: 'Get repository events',
      tool: 'get_repository_events',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY }
    },
    {
      name: 'Get repository subscribers',
      tool: 'get_repository_subscribers',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY }
    },
    {
      name: 'Get repository stargazers',
      tool: 'get_repository_stargazers',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY }
    }
  ];

  // Test Repository Management Advanced
  const managementTests = [
    {
      name: 'Get repository transition',
      tool: 'get_repository_transition',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY }
    },
    {
      name: 'Get repository customized roles',
      tool: 'get_repository_customized_roles',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY }
    }
  ];

  let passedTests = 0;
  let totalTests = 0;

  for (const testSuite of [
    { name: 'Repository Settings', tools: settingsTools, tests: settingsTests },
    { name: 'Repository Advanced Features', tools: advancedTools, tests: advancedTests },
    { name: 'Repository Management Advanced', tools: managementTools, tests: managementTests }
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

console.log(`\n🎉 Repository Settings tests completed!`);
  console.log(`📊 Results: ${passedTests}/${totalTests} tests passed`);
  
  return { passedTests, totalTests };
}

// Run tests
testRepositorySettingsFeatures().catch(console.error);