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

async function detailedTest() {
  console.log('\n🔍 Detailed User API Test');
  
  try {
    console.log('1️⃣ Testing get_user with zkxw2008...');
    const response = await client.get('/api/v5/users/zkxw2008');
    console.log('✅ Response status:', response.status);
    console.log('📊 Response headers:', response.headers);
    
    if (response.data) {
      console.log('✅ User data available');
      console.log('👤 User login:', response.data.login);
      console.log('👤 User name:', response.data.name);
      console.log('🆔 User ID:', response.data.id);
    } else {
      console.log('❌ No user data');
      console.log('📋 Full response:', JSON.stringify(response, null, 2));
    }
  } catch (error: any) {
    console.log('❌ Error occurred:', error.message);
    console.log('📊 Error details:', error.response?.status, error.response?.statusText);
      if (error.response?.data) {
        console.log('📋 Error Data:', JSON.stringify(error.response.data, null, 2));
        console.log('📋 Error Data type:', typeof error.response.data);
      }
    }
  }
}

detailedTest();