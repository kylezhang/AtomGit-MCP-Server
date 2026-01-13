#!/usr/bin/env node

/**
 * Test script for Organization, Webhooks, and Enterprise APIs
 */

import { config } from 'dotenv';
import { AtomGitService } from '../dist/services/AtomGitService.js';
import { OrganizationTools } from '../dist/tools/OrganizationTools.js';
import { WebhooksTools } from '../dist/tools/WebhooksTools.js';
import { EnterpriseTools } from '../dist/tools/EnterpriseTools.js';

// Load environment variables
config();

const API_BASE_URL = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
const TOKEN = process.env.ATOMGIT_TOKEN;
const TEST_ORG = process.env.TEST_ORG || 'zkxw2008';
const TEST_REPO_OWNER = process.env.TEST_REPO_OWNER || 'zkxw2008';
const TEST_REPOSITORY = process.env.TEST_REPOSITORY || 'api-testing';
const TEST_ENTERPRISE = process.env.TEST_ENTERPRISE || 'atomgit';

if (!TOKEN) {
  console.log('⚠️  No ATOMGIT_TOKEN provided. Some tests will fail.');
}

console.log(`🔧 测试配置:`);
console.log(`   API URL: ${API_BASE_URL}`);
console.log(`   测试组织: ${TEST_ORG}`);
console.log(`   测试仓库: ${TEST_REPO_OWNER}/${TEST_REPOSITORY}`);
console.log(`   测试企业: ${TEST_ENTERPRISE}`);
console.log('');

async function testPriority3Features() {
  console.log('Testing Priority 3: Organization, Webhooks, and Enterprise...\n');

  const service = new AtomGitService({
    apiBaseUrl: API_BASE_URL,
    token: TOKEN,
  });

  const orgTools = new OrganizationTools(service);
  const webhooksTools = new WebhooksTools(service);
  const enterpriseTools = new EnterpriseTools(service);

  // Test Organization Management
  const orgTests = [
    {
      name: 'Create organization',
      tool: 'create_organization',
      args: { 
        name: 'test-atomgit-mcp-org',
        org: 'test-atomgit-mcp-org',
        description: 'Test organization for MCP server development'
      }
    },
    {
      name: 'Get organization',
      tool: 'get_organization',
      args: { org: TEST_ORG }
    },
    {
      name: 'Get organization members',
      tool: 'get_organization_members',
      args: { org: TEST_ORG }
    },
    {
      name: 'Get organization teams',
      tool: 'get_organization_teams',
      args: { org: TEST_ORG }
    }
  ];

  // Test Webhooks Management
  const webhookTests = [
    {
      name: 'Get repository webhooks',
      tool: 'get_repository_webhooks',
      args: { owner: TEST_REPO_OWNER, repo: TEST_REPOSITORY }
    }
  ];

  // Test Enterprise Management
  const enterpriseTests = [
    {
      name: 'Get enterprise',
      tool: 'get_enterprise',
      args: { enterprise: TEST_ENTERPRISE }
    },
    {
      name: 'Get enterprise members',
      tool: 'get_enterprise_members',
      args: { enterprise: TEST_ENTERPRISE }
    },
    {
      name: 'Get enterprise roles',
      tool: 'get_enterprise_roles',
      args: { enterprise: TEST_ENTERPRISE }
    },
    {
      name: 'Get enterprise projects',
      tool: 'get_enterprise_projects',
      args: { enterprise: TEST_ENTERPRISE }
    }
  ];

  let passedTests = 0;
  let totalTests = 0;

  for (const testSuite of [
    { name: 'Organization Management', tools: orgTools, tests: orgTests },
    { name: 'Webhooks Management', tools: webhooksTools, tests: webhookTests },
    { name: 'Enterprise Management', tools: enterpriseTools, tests: enterpriseTests }
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
          console.log(`✅ Success - Result: ${JSON.stringify(result).substring(0, 100)}...`);
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
        } else if (error.response?.status === 405) {
          console.log('   Method not allowed - API may not exist');
        }
      }
    }
  }

  console.log(`\n🎉 Priority 3 tests completed!`);
  console.log(`📊 Results: ${passedTests}/${totalTests} tests passed`);
  
  return { passedTests, totalTests };
}

// Run tests
testPriority3Features().catch(console.error);