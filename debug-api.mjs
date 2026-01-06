#!/usr/bin/env node

/**
 * Test script to debug AtomGit API issues
 */

import axios from 'axios';

const API_BASE_URL = 'https://api.atomgit.com';
const TOKEN = process.env.ATOMGIT_TOKEN;

console.log('🔑 Testing AtomGit API with token:', TOKEN ? 'YES' : 'NO');

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Version': '2023-02-21',
    ...(TOKEN && {
      'Authorization': `Bearer ${TOKEN}`,
      'PRIVATE-TOKEN': TOKEN
    })
  }
});

async function testSpecificAPI() {
  console.log('\n🧪 Testing specific APIs to identify issues...\n');

  // Test 1: Get user without token
  console.log('1️⃣ Testing GET /api/v5/users/GitCode (no token)...');
  try {
    const response = await axios.get(`${API_BASE_URL}/api/v5/users/GitCode`);
    console.log('✅ Success:', response.status, response.data ? 'Has data' : 'No data');
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.statusText);
    console.log('   Data:', error.response?.data);
  }

  // Test 2: Get user with token
  if (TOKEN) {
    console.log('\n2️⃣ Testing GET /api/v5/users/GitCode (with token)...');
    try {
      const response = await client.get('/api/v5/users/GitCode');
      console.log('✅ Success:', response.status);
      if (response.data) {
        console.log('   User:', response.data.login || response.data.name);
      }
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.statusText);
      console.log('   Data:', error.response?.data);
    }

    // Test 3: Get user repos
    console.log('\n3️⃣ Testing GET /api/v5/users/GitCode/repos (with token)...');
    try {
      const response = await client.get('/api/v5/users/GitCode/repos');
      console.log('✅ Success:', response.status);
      if (response.data && Array.isArray(response.data)) {
        console.log(`   Found ${response.data.length} repos`);
      }
    } catch (error) {
      console.log('❌ Error:', error.response?.status, error.response?.statusText);
      console.log('   Data:', error.response?.data);
    }

    // Test 4: Different API versions
    console.log('\n4️⃣ Testing with different API versions...');
    try {
      const responseOld = await axios.get(`${API_BASE_URL}/api/v5/users/GitCode`, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
        }
      });
      console.log('   Without X-Api-Version:', responseOld.status);
      
      const responseNew = await axios.get(`${API_BASE_URL}/api/v5/users/GitCode`, {
        headers: {
          'X-Api-Version': '2023-02-21',
          'Authorization': `Bearer ${TOKEN}`,
        }
      });
      console.log('   With X-Api-Version:2023-02-21:', responseNew.status);
      
      if (responseOld.status !== responseNew.status) {
        console.log('⚠️  Different results with API version header!');
      }
    } catch (error) {
      console.log('❌ Version test error:', error.message);
    }
  }
}

testSpecificAPI().catch(console.error);