import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';

const AppContent = () => {
  const { isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState('login');

  const handleLoginSuccess = () => {
    setCurrentView('tasks');
  };

  const handleRegisterSuccess = () => {
    setCurrentView('tasks');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('login');
  };

  const switchToRegister = () => {
    setCurrentView('register');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {currentView === 'login' ? (
        <div>
          <Login onLoginSuccess={handleLoginSuccess} />
          <div className="text-center">
            <p>Pas encore de compte ?{' '}
              <button
                onClick={switchToRegister}
                className="bg-transparent border-none text-blue-600 underline cursor-pointer text-base hover:text-blue-700"
              >
                S'inscrire
              </button>
            </p>
          </div>
        </div>
      ) : currentView === 'register' ? (
        <div>
          <Register onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={switchToLogin} />
          <div className="text-center">
            <p>Déjà un compte ?{' '}
              <button
                onClick={switchToLogin}
                className="bg-transparent border-none text-blue-600 underline cursor-pointer text-base hover:text-blue-700"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      ) : (
        <TaskList onLogout={handleLogout} />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
