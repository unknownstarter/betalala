import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './shared/hooks/useAuth.js';
import { Layout } from './shared/components/Layout.js';
import { LoginPage } from './features/auth/LoginPage.js';
import { DashboardPage } from './features/dashboard/DashboardPage.js';
import { AdminDashboardPage } from './features/admin/AdminDashboardPage.js';
import { UserManagementPage } from './features/admin/pages/UserManagementPage.js';
import { TestReviewPage } from './features/admin/pages/TestReviewPage.js';
import { CreateTesterPage } from './features/admin/pages/CreateTesterPage.js';
import { CoreTestPage } from './features/core-tests/CoreTestPage.js';
import { DailyTestPage } from './features/daily-tests/DailyTestPage.js';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  console.log('=== ProtectedRoute Debug ===');
  console.log('user:', user);
  console.log('user.role:', user?.role);
  console.log('requireAdmin:', requireAdmin);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: '#ffffff'
      }}>
        <div className="modern-loading"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    console.log('Not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('Access granted');
  return children;
};

const DashboardRoute = () => {
  const { user } = useAuth();
  
  console.log('=== DashboardRoute Debug ===');
  console.log('user:', user);
  console.log('user.role:', user?.role);
  console.log('user.isAdmin:', user?.isAdmin);
  
  // role이 'admin'이면 관리자 대시보드로
  if (user?.role === 'admin') {
    console.log('Redirecting to admin dashboard');
    return <AdminDashboardPage />;
  }
  
  // role이 'user'이거나 다른 값이면 일반 대시보드로
  console.log('Redirecting to regular dashboard');
  return <DashboardPage />;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRoute />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/core-tests" 
            element={
              <ProtectedRoute>
                <CoreTestPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/daily-tests" 
            element={
              <ProtectedRoute>
                <DailyTestPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <UserManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/tests" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <TestReviewPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/create-tester" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <CreateTesterPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
