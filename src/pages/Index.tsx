import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDynamicTitle } from '@/hooks/useDynamicTitle';
import LoginForm from '@/components/LoginForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const { hasLoggedIn, emailDomain } = useAuth();

  // Update page title and favicon based on email domain
  useDynamicTitle({ emailDomain, hasLoggedIn });

  if (!hasLoggedIn) {
    return <LoginForm />;
  }

  return <Dashboard />;
};

export default Index;
