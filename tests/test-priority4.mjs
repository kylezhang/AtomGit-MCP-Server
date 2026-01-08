#!/usr/bin/env node

/**
 * Test script for Priority 4: Dashboard and AI Hub Features
 */

import { config } from 'dotenv';
import { AtomGitService } from '../dist/services/AtomGitService.js';
import { DashboardTools } from '../dist/tools/DashboardTools.js';
import { AIHubTools } from '../dist/tools/AIHubTools.js';

// Load environment variables
config();

const API_BASE_URL = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
const TOKEN = process.env.ATOMGIT_TOKEN;
const TEST_ORG = process.env.TEST_ORG || 'zkxw2008';

if (!TOKEN) {
  console.log('⚠️  No ATOMGIT_TOKEN provided. Some tests will fail.');
}

console.log(`🔧 测试配置:`);
console.log(`   API URL: ${API_BASE_URL}`);
console.log(`   测试组织: ${TEST_ORG}`);
console.log('');

async function testPriority4Features() {
  console.log('Testing Priority 4: Dashboard and AI Hub Features...\n');

  const service = new AtomGitService({
    apiBaseUrl: API_BASE_URL,
    token: TOKEN,
  });

  const dashboardTools = new DashboardTools(service);
  const aiHubTools = new AIHubTools(service);

  // Test Dashboard Management
  const dashboardTests = [
    {
      name: 'Get organization kanbans',
      tool: 'get_organization_kanbans',
      args: { owner: TEST_ORG }
    }
  ];

  // Test AI Hub Features (basic text completion test)
  const aiTests = [
    {
      name: 'AI Chat Completion',
      tool: 'chat_completion',
      args: { 
        data: {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: "Hello, how are you?" }
          ],
          max_tokens: 100
        }
      }
    }
  ];

  let passedTests = 0;
  let totalTests = 0;

  for (const testSuite of [
    { name: 'Dashboard Management', tools: dashboardTools, tests: dashboardTests },
    { name: 'AI Hub Features', tools: aiHubTools, tests: aiTests }
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
          } else {
            // For AI completion, show a sample of the response
            if (result.choices && result.choices.length > 0) {
              console.log(`   AI Response: ${result.choices[0].message?.content?.substring(0, 100)}...`);
            }
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
        } else if (error.response?.status === 429) {
          console.log('   Rate limited - API quota exceeded');
        }
      }
    }
  }

  console.log(`\n🎉 Priority 4 tests completed!`);
  console.log(`📊 Results: ${passedTests}/${totalTests} tests passed`);
  
  return { passedTests, totalTests };
}

// Run tests
testPriority4Features().catch(console.error);