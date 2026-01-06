#!/usr/bin/env node

import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

const API_BASE_URL = 'https://api.atomgit.com/api/v5';
const token = process.env.ATOMGIT_TOKEN;

const headers = token ? {
  'Authorization': `token ${token}`,
  'Accept': 'application/vnd.github.v3+json'
} : {
  'Accept': 'application/vnd.github.v3+json'
};

async function testUserAPI() {
  console.log('🔍 Testing GitCode User API with zkxw2008...');
  console.log('=====================================');
  
  const username = 'zkxw2008';
  
  // Test get user
  try {
    console.log(`\n🧪 Testing get_user: ${username}`);
    const url = `${API_BASE_URL}/users/${username}`;
    console.log(`📍 URL: ${url}`);
    
    const response = await axios.get(url, { headers });
    console.log(`✅ SUCCESS: Found user ${username}`);
    console.log(`   Login: ${response.data.login}`);
    console.log(`   ID: ${response.data.id}`);
    console.log(`   Name: ${response.data.name || 'N/A'}`);
    console.log(`   Type: ${response.data.type}`);
    console.log(`   Email: ${response.data.email || 'N/A'}`);
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.response?.status} - ${error.response?.data?.error_message || error.message}`);
    if (error.response?.data) {
      console.log(`   Error details:`, error.response.data);
    }
  }
  
  // Test user repos
  try {
    console.log(`\n🧪 Testing get_user_repos: ${username}`);
    const reposUrl = `${API_BASE_URL}/users/${username}/repos`;
    console.log(`📍 URL: ${reposUrl}`);
    
    const reposResponse = await axios.get(reposUrl, { headers });
    console.log(`✅ SUCCESS: Found ${reposResponse.data.length} repositories`);
    
    if (reposResponse.data.length > 0) {
      console.log(`   First repo: ${reposResponse.data[0].name}`);
      console.log(`   Description: ${reposResponse.data[0].description || 'N/A'}`);
    }
  } catch (error) {
    console.log(`❌ FAILED: ${error.response?.status} - ${error.response?.data?.error_message || error.message}`);
    if (error.response?.data) {
      console.log(`   Error details:`, error.response.data);
    }
  }
  
  // Test user starred repos
  try {
    console.log(`\n🧪 Testing get_user_starred_repos: ${username}`);
    const starredUrl = `${API_BASE_URL}/users/${username}/starred`;
    console.log(`📍 URL: ${starredUrl}`);
    
    const starredResponse = await axios.get(starredUrl, { headers });
    console.log(`✅ SUCCESS: Found ${starredResponse.data.length} starred repositories`);
    
    if (starredResponse.data.length > 0) {
      console.log(`   First starred repo: ${starredResponse.data[0].name}`);
    }
  } catch (error) {
    console.log(`❌ FAILED: ${error.response?.status} - ${error.response?.data?.error_message || error.message}`);
    if (error.response?.data) {
      console.log(`   Error details:`, error.response.data);
    }
  }
  
  // Test authenticated user endpoints if token is available
  if (token) {
    console.log('\n🔐 Testing Authenticated User Endpoints...');
    
    // Test get current user
    try {
      console.log(`\n🧪 Testing get_current_user`);
      const currentUserUrl = `${API_BASE_URL}/user`;
      console.log(`📍 URL: ${currentUserUrl}`);
      
      const response = await axios.get(currentUserUrl, { headers });
      console.log(`✅ SUCCESS: Current user found`);
      console.log(`   Login: ${response.data.login}`);
      console.log(`   ID: ${response.data.id}`);
      console.log(`   Name: ${response.data.name || 'N/A'}`);
      
    } catch (error) {
      console.log(`❌ FAILED: ${error.response?.status} - ${error.response?.data?.error_message || error.message}`);
    }
    
    // Test get current user repos
    try {
      console.log(`\n🧪 Testing get_current_user_repos`);
      const currentUserReposUrl = `${API_BASE_URL}/user/repos`;
      console.log(`📍 URL: ${currentUserReposUrl}`);
      
      const response = await axios.get(currentUserReposUrl, { headers });
      console.log(`✅ SUCCESS: Found ${response.data.length} repositories`);
      
      if (response.data.length > 0) {
        console.log(`   First repo: ${response.data[0].name}`);
      }
      
    } catch (error) {
      console.log(`❌ FAILED: ${error.response?.status} - ${error.response?.data?.error_message || error.message}`);
    }
  } else {
    console.log('\n⏭️  Skipping authenticated tests (no ATOMGIT_TOKEN provided)');
  }
}

testUserAPI().catch(console.error);