import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  hasLoggedIn: boolean;
  email: string;
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

  const value = {
    hasLoggedIn,
    email,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 