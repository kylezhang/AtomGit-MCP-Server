#!/usr/bin/env node

import dotenv from 'dotenv';
import { AtomGitService } from '../dist/services/AtomGitService.js';

dotenv.config();

const token = process.env.ATOMGIT_TOKEN;
const apiBaseUrl = process.env.ATOMGIT_API_BASE_URL || 'https://api.atomgit.com';
const username = process.env.TEST_USERNAME || 'zkxw2008';

if (!token) {
  console.log('❌ 错误: 未提供 ATOMGIT_TOKEN');
  console.log('');
  console.log('⚠️  GitCode API 要求所有请求都需要认证令牌');
  console.log('');
  console.log('🔧 如何配置:');
  console.log('1. 访问 https://atomgit.com/setting/token-classic');
  console.log('2. 生成个人访问令牌');
  console.log('3. 创建 .env 文件并添加:');
  console.log('   ATOMGIT_TOKEN=your_token_here');
  console.log('   ATOMGIT_API_BASE_URL=https://api.atomgit.com');
  console.log('   TEST_USERNAME=your_test_username');
  console.log('');
  process.exit(1);
}

async function testUserAPIs() {
  console.log('🧪 测试用户相关 API（需要认证令牌）');
  console.log('='.repeat(50));
  console.log(`🔑 使用令牌: ${token.substring(0, 10)}...`);
  console.log(`👤 测试用户名: ${username}`);
  console.log(`🌐 API URL: ${apiBaseUrl}`);
  console.log('');

  const service = new AtomGitService({ apiBaseUrl, token });

  const results = {
    success: 0,
    failed: 0
  };

  // 测试 1: get_user
  console.log('1️⃣ 测试 get_user...');
  try {
    const user = await service.getUser(username);
    console.log(`✅ 成功! 用户: ${user.login} (${user.name || 'N/A'})`);
    console.log(`   ID: ${user.id}, 类型: ${user.type}`);
    console.log(`   Email: ${user.email || 'N/A'}`);
    console.log(`   网址: ${user.html_url}`);
    results.success++;
  } catch (error) {
    console.log(`❌ 失败: ${error.message}`);
    if (error.response) {
      console.log(`   状态码: ${error.response.status}`);
      console.log(`   错误信息: ${error.response.data?.error_message || 'N/A'}`);
    }
    results.failed++;
  }
  console.log('');

  // 测试 2: get_user_repos
  console.log('2️⃣ 测试 get_user_repos...');
  try {
    const repos = await service.getUserRepos(username);
    console.log(`✅ 成功! 找到 ${repos.length} 个仓库`);
    if (repos.length > 0) {
      console.log(`   第一个仓库: ${repos[0].name}`);
      console.log(`   描述: ${repos[0].description || 'N/A'}`);
      console.log(`   语言: ${repos[0].language || 'N/A'}`);
      console.log(`   星标数: ${repos[0].stargazers_count || 0}`);
    }
    results.success++;
  } catch (error) {
    console.log(`❌ 失败: ${error.message}`);
    if (error.response) {
      console.log(`   状态码: ${error.response.status}`);
      console.log(`   错误信息: ${error.response.data?.error_message || 'N/A'}`);
    }
    results.failed++;
  }
  console.log('');

  // 测试 3: get_user_starred_repos
  console.log('3️⃣ 测试 get_user_starred_repos...');
  try {
    const starred = await service.getUserStarredRepos(username);
    console.log(`✅ 成功! 找到 ${starred.length} 个收藏仓库`);
    if (starred.length > 0) {
      console.log(`   第一个收藏仓库: ${starred[0].name}`);
      console.log(`   所有者: ${starred[0].owner?.login || 'N/A'}`);
    }
    results.success++;
  } catch (error) {
    console.log(`❌ 失败: ${error.message}`);
    if (error.response) {
      console.log(`   状态码: ${error.response.status}`);
      console.log(`   错误信息: ${error.response.data?.error_message || 'N/A'}`);
    }
    results.failed++;
  }
  console.log('');

  // 测试总结
  console.log('📊 测试结果总结');
  console.log('='.repeat(30));
  console.log(`✅ 成功: ${results.success}/3`);
  console.log(`❌ 失败: ${results.failed}/3`);

  if (results.success === 3) {
    console.log('');
    console.log('🎉 所有测试通过！这 3 个工具都正常工作。');
    console.log('');
    console.log('💡 说明:');
    console.log('- 这些工具之前"失败"是因为没有提供认证令牌');
    console.log('- GitCode API 要求所有请求都需要认证');
    console.log('- 提供有效令牌后，所有工具都能正常工作');
  } else if (results.success > 0) {
    console.log('');
    console.log('⚠️  部分测试通过');
    console.log('');
    console.log('💡 可能的原因:');
    console.log(`- 用户名 "${username}" 可能不存在`);
    console.log('- 该用户可能没有公开仓库或收藏');
    console.log('- API 返回的错误信息显示了具体原因');
  } else {
    console.log('');
    console.log('❌ 所有测试失败');
    console.log('');
    console.log('💡 可能的原因:');
    console.log('- 认证令牌无效或已过期');
    console.log('- 令牌权限不足');
    console.log('- 网络连接问题');
    console.log('- API 服务暂时不可用');
  }
}

testUserAPIs().catch(console.error);