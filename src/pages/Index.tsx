import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const { hasLoggedIn } = useAuth();

  if (!hasLoggedIn) {
    return <LoginForm />;
  }

  return <Dashboard />;
};

export default Index;
