#!/usr/bin/env node

/**
 * Simple API connectivity test
 */

import axios from 'axios';

const API_BASE_URL = 'https://api.gitcode.com';

async function testConnectivity() {
  console.log('\n🔍 Testing API connectivity...');
  
  try {
    console.log('1️⃣ Testing basic GET request...');
    const response = await axios.get(`${API_BASE_URL}/api/v5/ping`);
    console.log('✅ Status:', response.status);
    console.log('📊 Headers:', response.headers);
    console.log('📊 Data:', JSON.stringify(response.data, null, 2));
    if (response.status === 200) {
      console.log('✅ Basic API is working!');
      console.log('📊 Response headers:', response.headers);
      console.log('📊 Date:', new Date(response.headers.date));
    console.log('🔍 Content-Type:', response.headers['content-type']);
    } else {
      console.log('❌ Basic API failed:', response.status);
      console.log('📄� Error:', response.data?.error_message || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
  }
    
    // Test authentication
    console.log('\n2️⃣ Testing authenticated API...');
    if (!TOKEN) {
      console.log('⏭️ No token provided - skipping');
      return;
    }
    
    // With valid token
    console.log('\n3️⃣ Testing with valid token...');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v5/user`, {
        headers: {
          'X-Api-Version': '2023-02-21',
          'Authorization': `Bearer ${TOKEN}`,
          'PRIVATE-TOKEN': TOKEN
        }
      }
      });
      
      console.log('✅ Status:', response.status);
      if (response.status === 200) {
        console.log('✅ Authenticated API works!');
        console.log('📊 User:', response.data.login || 'No user data');
      } else {
        console.log('❌ Unexpected response:', response.status);
        console.log('📊 Error:', response.data?.error_message);
      }
    } catch (error) {
      console.log('❌ Connection error:', error.message);
    }
    }
    
    console.log('\n✅ Connectivity test completed!');
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testConnectivity().catch(console.error);
}

testConnectivity();