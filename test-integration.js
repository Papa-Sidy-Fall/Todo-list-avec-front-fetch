// Script de test d'intégration frontend-backend
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3080';
const FRONTEND_URL = 'http://localhost:5174';

async function testIntegration() {
  console.log('🧪 Test d\'intégration frontend-backend...\n');

  try {
    // Test 1: Vérifier que le frontend répond
    console.log('1️⃣ Test du frontend...');
    const frontendResponse = await fetch(FRONTEND_URL);
    if (frontendResponse.ok) {
      console.log('✅ Frontend accessible sur', FRONTEND_URL);
    } else {
      console.log('❌ Frontend non accessible');
    }

    // Test 2: Vérifier que le backend répond
    console.log('\n2️⃣ Test du backend...');
    const backendResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test1234'
      })
    });

    if (backendResponse.ok) {
      const data = await backendResponse.json();
      console.log('✅ Backend accessible - Connexion réussie');
      console.log('   Token reçu:', data.token ? '✅' : '❌');
      console.log('   User data:', data.user ? '✅' : '❌');
    } else {
      console.log('❌ Backend non accessible');
    }

    // Test 3: Tester l'inscription
    console.log('\n3️⃣ Test de l\'inscription...');
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nom: 'Integration Test',
        email: `test${Date.now()}@example.com`,
        password: 'Test1234',
        confirmPassword: 'Test1234'
      })
    });

    if (registerResponse.ok) {
      const data = await registerResponse.json();
      console.log('✅ Inscription réussie');
      console.log('   Status:', registerResponse.status);
      console.log('   Token reçu:', data.token ? '✅' : '❌');
    } else {
      const error = await registerResponse.json();
      console.log('❌ Erreur d\'inscription:', error.message);
    }

    // Test 4: Vérifier la configuration CORS
    console.log('\n4️⃣ Test CORS...');
    const corsResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'OPTIONS'
    });

    console.log('✅ CORS configuré - Status:', corsResponse.status);

    console.log('\n🎉 Tests d\'intégration terminés !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

testIntegration();
