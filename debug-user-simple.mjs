#!/usr/bin/env node

import axios from 'axios';

const TOKEN = process.env.ATOMGIT_TOKEN;

console.log('🔑 Using token:', TOKEN ? 'YES' : 'NO');

const client = axios.create({
  baseURL: 'https://api.gitcode.com',
  headers: {
    'X-Api-Version': '2023-02-21',
    ...(TOKEN && {
      'Authorization': `Bearer ${TOKEN}`,
      'PRIVATE-TOKEN': TOKEN
    })
  }
});

async function simpleTest() {
  console.log('\n🔍 Simple User API Test');
  console.log('1️⃣ Testing get_user with zkxw2008...');
  
  try {
    const response = await client.get('/api/v5/users/zkxw2008');
    console.log('✅ Response status:', response.status);
    console.log('📊 Response headers:', response.headers);
    
    if (response.data) {
      console.log('✅ User data available');
      console.log('👤 User login:', response.data.login);
      console.log('👤 User name:', response.data.name);
      console.log('🆔 User ID:', response.data.id);
      console.log('🌐 User page:', response.data.html_url);
    } else {
      console.log('❌ No user data');
    }
  } catch (error: any) {
    console.log('❌ Error occurred:', error.message);
    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📄 Error Text:', error.response.statusText);
    }
  }

  console.log('\n✅ Test completed!');
}

simpleTest();