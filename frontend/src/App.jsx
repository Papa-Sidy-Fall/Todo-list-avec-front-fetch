import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';

const AppContent = () => {
  const { logout } = useAuth();
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
        <Login onLoginSuccess={handleLoginSuccess} onSwitchToRegister={switchToRegister} />
      ) : currentView === 'register' ? (
        <Register onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={switchToLogin} />
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
