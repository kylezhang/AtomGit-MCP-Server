#!/usr/bin/env node

/**
 * Quick test to verify API base URL fix
 */

import { AtomGitService } from './dist/services/AtomGitService.js';
import 'dotenv/config';

const API_BASE_URL = process.env.ATOMGIT_API_BASE_URL || 'https://api.gitcode.com';
const TOKEN = process.env.ATOMGIT_TOKEN;

console.log('🔑 Using API base URL:', API_BASE_URL);
console.log('🔑 Using token:', TOKEN ? TOKEN.substring(0, 8) + '...' : 'NO TOKEN');

const service = new AtomGitService({
  apiBaseUrl: API_BASE_URL,
  token: TOKEN,
});

async function quickTest() {
  console.log('\n🧪 Quick Test - Fixed API Base URL');
  console.log('='.repeat(50));

  try {
    console.log('2️⃣ Testing get_repository...');
    const repo = await service.getRepository('zkxw2008', 'test-repo-2024');
    if (repo && repo.name) {
      console.log(`✅ Success: ${repo.name} (${repo.stargazers_count} stars)`);
    } else {
      console.log('❌ Failed: Repository not found');
    }
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.data?.error_message);
  }

  console.log('\n2️⃣ Testing get_repository...');
  try {
    const repo = await service.getRepository('zkxw2008', 'openatomfoundationadmin');
    if (repo && repo.name) {
      console.log(`✅ Success: ${repo.name} (${repo.stargazers_count} stars)`);
    } else {
      console.log('❌ Failed: Repository not found');
    }
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.data?.error_message);
  }
}

quickTest().catch(console.error);