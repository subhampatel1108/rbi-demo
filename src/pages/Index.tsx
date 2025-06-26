
import React, { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  const handleLogin = (username: string, password: string) => {
    // Simple authentication check - in real app, this would be API call
    if (username && password) {
      setIsAuthenticated(true);
      setUser({ username });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default Index;
