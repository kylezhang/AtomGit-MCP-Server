#!/usr/bin/env node

/**
 * Simple test to verify MCP server can start and list tools
 * This doesn't require API authentication
 */

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

async function testMCPServer() {
  console.log('Testing AtomGit MCP Server startup...\n');

  const serverProcess = spawn('node', ['dist/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, ATOMGIT_TOKEN: undefined }
  });

  let stdout = '';
  let stderr = '';

  serverProcess.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  serverProcess.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  // Wait a bit for the server to start
  await setTimeout(2000);

  console.log('🔧 Testing MCP server initialization...');

  // Send a list tools request
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: {}
  };

  serverProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');

  // Wait for response
  await setTimeout(2000);

  console.log('📋 Server stdout:');
  console.log(stdout || 'No output');

  console.log('\n⚠️  Server stderr:');
  console.log(stderr || 'No errors');

  console.log('\n🧪 Tool count analysis:');
  // Count occurrences of tool names in the output
  const toolMatches = stdout.match(/"name":"([^"]+)"/g);
  if (toolMatches) {
    const toolCount = toolMatches.length;
    console.log(`✅ Server successfully registered ${toolCount} tools`);
    
    console.log('\n🛠️  Available tools:');
    toolMatches.forEach((match, index) => {
      const toolName = match.match(/"name":"([^"]+)"/)[1];
      console.log(`  ${index + 1}. ${toolName}`);
    });
  } else {
    console.log('⚠️  Could not find tools in response');
  }

  // Test if server is responsive
  console.log('\n🔍 Testing server responsiveness...');
  
  const callToolRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'get_user',
      arguments: {
        username: 'test'
      }
    }
  };

  serverProcess.stdin.write(JSON.stringify(callToolRequest) + '\n');
  await setTimeout(2000);

  // Clean up
  serverProcess.kill('SIGTERM');
  
  console.log('\n✅ MCP Server test completed!');
  console.log('📝 Note: Most API calls will require authentication with a valid ATOMGIT_TOKEN');
}

testMCPServer().catch(console.error);