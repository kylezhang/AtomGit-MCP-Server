#!/usr/bin/env node

import dotenv from 'dotenv';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

import AtomGitMCP from './dist/index.js';

// Check if token is available
const token = process.env.ATOMGIT_TOKEN;
if (!token) {
  console.log('⚠️  No ATOMGIT_TOKEN provided in .env file');
  console.log('Some tests will fail due to authentication requirements.');
  console.log('');
}

async function runMCPTest() {
  console.log('🧪 Testing AtomGit MCP Server Tools...');
  console.log('='.repeat(50));
  
  // Test initialization
  let mcp;
  try {
    mcp = await AtomGitMCP();
    console.log('✅ MCP Server initialized successfully');
  } catch (error) {
    console.log('❌ MCP Server initialization failed:', error.message);
    return;
  }
  
  // Get available tools
  let toolsResponse;
  try {
    toolsResponse = await mcp.request({ method: 'tools/list' }, {});
    console.log(`✅ Found ${toolsResponse.tools.length} tools available`);
  } catch (error) {
    console.log('❌ Failed to get tools list:', error.message);
    return;
  }
  
  // Test each tool with minimal or sample data
  const results = {
    success: 0,
    failed: 0,
    skipped: 0
  };
  
  console.log('\n🔄 Testing individual tools...');
  console.log('-'.repeat(40));
  
  // Repository tools (most likely to work)
  console.log('\n📁 Repository Tools:');
  
  // Test get_repository with a known public repo
  try {
    const result = await mcp.request({
      method: 'tools/call',
      params: {
        name: 'get_repository',
        arguments: {
          owner: TEST_USERNAME,
          repo: TEST_USERNAME
        }
      }
    }, {});
    console.log('✅ get_repository: SUCCESS');
    results.success++;
  } catch (error) {
    console.log(`❌ get_repository: ${error.message}`);
    results.failed++;
  }
  
  // Test search_repositories
  try {
    const result = await mcp.request({
      method: 'tools/call',
      params: {
        name: 'search_repositories',
        arguments: {
          query: 'javascript',
          page: 1,
          perPage: 5
        }
      }
    }, {});
    console.log('✅ search_repositories: SUCCESS');
    results.success++;
  } catch (error) {
    console.log(`❌ search_repositories: ${error.message}`);
    results.failed++;
  }
  
  // User tools
  console.log('\n👤 User Tools:');
  
  // Test get_current_user (requires auth)
  if (token) {
    try {
      const result = await mcp.request({
        method: 'tools/call',
        params: {
          name: 'get_current_user',
          arguments: {}
        }
      }, {});
      console.log('✅ get_current_user: SUCCESS');
      results.success++;
    } catch (error) {
      console.log(`❌ get_current_user: ${error.message}`);
      results.failed++;
    }
  } else {
    console.log('⏭️  get_current_user: SKIPPED (no token)');
    results.skipped++;
  }
  
  // Test get_user with a known user
  try {
    const result = await mcp.request({
      method: 'tools/call',
      params: {
        name: 'get_user',
        arguments: {
          username: TEST_USERNAME
        }
      }
    }, {});
    console.log('✅ get_user: SUCCESS');
    results.success++;
  } catch (error) {
    console.log(`❌ get_user: ${error.message}`);
    results.failed++;
  }
  
  // Test search_users
  try {
    const result = await mcp.request({
      method: 'tools/call',
      params: {
        name: 'search_users',
        arguments: {
          query: 'test',
          page: 1,
          perPage: 5
        }
      }
    }, {});
    console.log('✅ search_users: SUCCESS');
    results.success++;
  } catch (error) {
    console.log(`❌ search_users: ${error.message}`);
    results.failed++;
  }
  
  // Test get_user_repos
  try {
    const result = await mcp.request({
      method: 'tools/call',
      params: {
        name: 'get_user_repos',
        arguments: {
          username: TEST_USERNAME
        }
      }
    }, {});
    console.log('✅ get_user_repos: SUCCESS');
    results.success++;
  } catch (error) {
    console.log(`❌ get_user_repos: ${error.message}`);
    results.failed++;
  }
  
  // Results summary
  console.log('\n📊 Test Results Summary:');
  console.log('='.repeat(30));
  console.log(`✅ Successful: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);
  console.log(`📈 Success Rate: ${Math.round((results.success / (results.success + results.failed)) * 100)}%`);
  
  // Overall status
  if (results.success > 0 && results.failed === 0) {
    console.log('\n🎉 All tested tools are working perfectly!');
  } else if (results.success > results.failed) {
    console.log('\n✅ Most tools are working. Some failures may be expected due to API limitations.');
  } else {
    console.log('\n⚠️  Multiple tools failed. This may indicate configuration or API issues.');
  }
}

runMCPTest().catch(console.error);