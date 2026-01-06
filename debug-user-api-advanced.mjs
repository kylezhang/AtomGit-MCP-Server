#!/usr/bin/env node

import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const API_BASE_URL = 'https://api.gitcode.com/api/v5';
const token = process.env.ATOMGIT_TOKEN;

const headers = token ? {
  'Authorization': `token ${token}`,
  'Accept': 'application/vnd.github.v3+json'
} : {
  'Accept': 'application/vnd.github.v3+json'
};

async function testUserAPI() {
  console.log('🔍 Testing GitCode User API...');
  console.log('=====================================');
  
  // Test different usernames to find one that works
  const testUsernames = [
    'gitcode',
    'admin',
    'root',
    'test',
    'user',
    'demo',
    'sample'
  ];
  
  for (const username of testUsernames) {
    try {
      console.log(`\n🧪 Testing user: ${username}`);
      const url = `${API_BASE_URL}/users/${username}`;
      console.log(`📍 URL: ${url}`);
      
      const response = await axios.get(url, { headers });
      console.log(`✅ SUCCESS: Found user ${username}`);
      console.log(`   Login: ${response.data.login}`);
      console.log(`   ID: ${response.data.id}`);
      console.log(`   Name: ${response.data.name || 'N/A'}`);
      console.log(`   Type: ${response.data.type}`);
      
      // Test user repos
      try {
        const reposUrl = `${API_BASE_URL}/users/${username}/repos`;
        const reposResponse = await axios.get(reposUrl, { headers });
        console.log(`   Repositories: ${reposResponse.data.length} found`);
      } catch (repoError) {
        console.log(`   ❌ Repositories failed: ${repoError.response?.status} - ${repoError.response?.data?.error_message || repoError.message}`);
      }
      
      // If user found, break the loop
      break;
      
    } catch (error) {
      console.log(`❌ FAILED: ${error.response?.status} - ${error.response?.data?.error_message || error.message}`);
    }
  }
  
  // Test the search users API to find valid usernames
  console.log('\n🔍 Testing Search Users API...');
  try {
    const searchUrl = `${API_BASE_URL}/search/users`;
    const response = await axios.get(searchUrl, { 
      headers,
      params: {
        q: 'type:user',
        per_page: 5
      }
    });
    
    console.log('✅ Search API working');
    console.log(`Found ${response.data.total_count} users`);
    
    if (response.data.items && response.data.items.length > 0) {
      console.log('Sample users found:');
      response.data.items.forEach(user => {
        console.log(`  - ${user.login} (${user.type})`);
      });
      
      // Test the first found user
      const firstUser = response.data.items[0].login;
      console.log(`\n🧪 Testing first found user: ${firstUser}`);
      const userUrl = `${API_BASE_URL}/users/${firstUser}`;
      const userResponse = await axios.get(userUrl, { headers });
      console.log(`✅ SUCCESS: User ${firstUser} found`);
      console.log(`   Login: ${userResponse.data.login}`);
      console.log(`   ID: ${userResponse.data.id}`);
      console.log(`   Name: ${userResponse.data.name || 'N/A'}`);
    }
  } catch (error) {
    console.log(`❌ Search API failed: ${error.response?.status} - ${error.response?.data?.error_message || error.message}`);
  }
}

testUserAPI().catch(console.error);