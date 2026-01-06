#!/usr/bin/env node

import axios from 'axios';

const TOKEN = process.env.ATOMGIT_TOKEN;

console.log('🔑 Testing user API with token:', TOKEN ? 'YES' : 'NO');

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

async function testSpecificUserAPIs() {
  console.log('\n🧪 Testing User APIs with different methods...');
  
  console.log('=' .repeat(60));

  // Test different user endpoints
  const userTests = [
    {
      name: 'GET /api/v5/users/zkxw2008',
      test: () => client.get('/api/v5/users/zkxw2008')
    },
    {
      name: 'GET /api/v5/user/zkxw2008', 
      test: () => client.get('/api/v5/user/zkxw2008')
    },
    {
      name: 'GET /api/v5/users/zkxw2008/repos',
      test: () => client.get('/api/v5/users/zkxw2008/repos')
    },
    {
      name: 'GET /api/v5/users/zkxw2008/starred',
      test: () => client.get('/api/v5/users/zkxw2008/starred')
    }
  ];

  for (const test of userTests) {
    console.log(`\n🔧 ${test.name}`);
    try {
      const response = await test.test();
      console.log(`✅ Status: ${response.status}`);
      if (response.data) {
        console.log(`📊 Data type: ${typeof response.data}`);
        if (response.data.login) {
          console.log(`👤 User: ${response.data.login} (${response.data.name})`);
        }
      } else {
        console.log(`📊 Response: ${JSON.stringify(response.data).substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status} ${error.response?.statusText}`);
      if (error.response?.data) {
        console.log(`📄 Error data:`, error.response.data);
      }
    }
  }

  console.log('\n' + '=' .repeat(60));
}

testSpecificUserAPIs().catch(console.error);