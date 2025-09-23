// Script de test simple sans dépendances externes
const https = require('https');
const http = require('http');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    if (options.body) req.write(JSON.stringify(options.body));
    req.end();
  });
}

async function testIntegration() {
  console.log('🧪 Test d\'intégration frontend-backend...\n');

  try {
    // Test 1: Vérifier que le frontend répond
    console.log('1️⃣ Test du frontend...');
    const frontendResponse = await makeRequest('http://localhost:5174');
    if (frontendResponse.status === 200) {
      console.log('✅ Frontend accessible sur http://localhost:5174');
    } else {
      console.log('❌ Frontend non accessible - Status:', frontendResponse.status);
    }

    // Test 2: Vérifier que le backend répond
    console.log('\n2️⃣ Test du backend...');
    const backendResponse = await makeRequest('http://localhost:3080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        email: 'test@example.com',
        password: 'Test1234'
      }
    });

    if (backendResponse.status === 200) {
      console.log('✅ Backend accessible - Connexion réussie');
      console.log('   Token reçu:', backendResponse.data.token ? '✅' : '❌');
      console.log('   User data:', backendResponse.data.user ? '✅' : '❌');
    } else {
      console.log('❌ Backend non accessible - Status:', backendResponse.status);
      console.log('   Erreur:', backendResponse.data.message);
    }

    // Test 3: Tester l'inscription
    console.log('\n3️⃣ Test de l\'inscription...');
    const registerResponse = await makeRequest('http://localhost:3080/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        nom: 'Integration Test',
        email: `test${Date.now()}@example.com`,
        password: 'Test1234',
        confirmPassword: 'Test1234'
      }
    });

    if (registerResponse.status === 201) {
      console.log('✅ Inscription réussie');
      console.log('   Status:', registerResponse.status);
      console.log('   Token reçu:', registerResponse.data.token ? '✅' : '❌');
    } else {
      console.log('❌ Erreur d\'inscription - Status:', registerResponse.status);
      console.log('   Message:', registerResponse.data.message);
      if (registerResponse.data.errors) {
        console.log('   Erreurs de validation:', registerResponse.data.errors);
      }
    }

    console.log('\n🎉 Tests d\'intégration terminés !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

testIntegration();
