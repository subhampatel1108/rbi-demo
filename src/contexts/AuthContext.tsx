import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  hasLoggedIn: boolean;
  email: string;
  emailDomain: string;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const getEmailDomain = (email: string): string => {
  const atIndex = email.indexOf('@');
  if (atIndex === -1) return '';
  const domain = email.slice(atIndex + 1);
  const dotIndex = domain.indexOf('.');
  return dotIndex === -1 ? domain : domain.slice(0, dotIndex);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  const login = (userEmail: string) => {
    setHasLoggedIn(true);
    setEmail(userEmail);
  };

  const logout = () => {
    setHasLoggedIn(false);
    setEmail('');
  };

  const emailDomain = getEmailDomain(email);

  const value = {
    hasLoggedIn,
    email,
    emailDomain,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 