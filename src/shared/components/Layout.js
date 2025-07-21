import React from 'react';
import { Navigation } from './Navigation.js';
import { useAuth } from '../hooks/useAuth.js';

export const Layout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {user && <Navigation />}
      <main style={{ paddingTop: user ? '80px' : '0' }}>
        {children}
      </main>
    </div>
  );
}; 