#!/usr/bin/env node

// Test MCP server with manual requests
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 测试 MCP Server 连接...');

// 启动 MCP 服务器
const serverProcess = spawn('node', [path.join(__dirname, 'dist', 'index.js')], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: {
    ...process.env,
    ATOMGIT_TOKEN: 'ppUc74J7nhMnEJ3h3wdejFDx',
    ATOMGIT_API_BASE_URL: 'https://api.atomgit.com'
  }
});

let responseBuffer = '';

serverProcess.stdout.on('data', (data) => {
  responseBuffer += data.toString();
  console.log('📤 MCP Response:', data.toString());
});

serverProcess.stderr.on('data', (data) => {
  console.log('❌ MCP Error:', data.toString());
});

// 发送 list_tools 请求
const listToolsRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list',
  params: {}
};

setTimeout(() => {
  console.log('📤 Sending list_tools request...');
  serverProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');
}, 1000);

// 发送 get_current_user 请求
setTimeout(() => {
  console.log('📤 Sending get_current_user request...');
  const getCurrentUserRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'get_current_user',
      arguments: {}
    }
  };
  serverProcess.stdin.write(JSON.stringify(getCurrentUserRequest) + '\n');
}, 2000);

// 发送 get_current_user_repos 请求
setTimeout(() => {
  console.log('📤 Sending get_current_user_repos request...');
  const getReposRequest = {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: {
      name: 'get_current_user_repos',
      arguments: {}
    }
  };
  serverProcess.stdin.write(JSON.stringify(getReposRequest) + '\n');
}, 3000);

// 清理
setTimeout(() => {
  serverProcess.kill();
  console.log('✅ 测试完成');
}, 5000);