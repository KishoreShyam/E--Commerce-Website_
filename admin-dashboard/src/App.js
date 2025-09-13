import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

// Components
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Lazy load pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Products = lazy(() => import('./pages/Products'));
const Orders = lazy(() => import('./pages/Orders'));
const Customers = lazy(() => import('./pages/Customers'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20
  },
  in: {
    opacity: 1,
    x: 0
  },
  out: {
    opacity: 0,
    x: 20
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

const PageWrapper = ({ children }) => {
  const { animationsEnabled } = useTheme();
  
  if (!animationsEnabled) {
    return children;
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { animationsEnabled } = useTheme();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <AnimatePresence mode="wait" initial={false}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <PageWrapper>
                    <Login />
                  </PageWrapper>
                )
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <PageWrapper>
                    <Register />
                  </PageWrapper>
                )
              } 
            />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route 
                        path="/" 
                        element={<Navigate to="/dashboard" replace />} 
                      />
                      <Route 
                        path="/dashboard" 
                        element={
                          <PageWrapper>
                            <Dashboard />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/products" 
                        element={
                          <PageWrapper>
                            <Products />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/orders" 
                        element={
                          <PageWrapper>
                            <Orders />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/customers" 
                        element={
                          <PageWrapper>
                            <Customers />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/analytics" 
                        element={
                          <PageWrapper>
                            <Analytics />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/settings" 
                        element={
                          <PageWrapper>
                            <Settings />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="/profile" 
                        element={
                          <PageWrapper>
                            <Profile />
                          </PageWrapper>
                        } 
                      />
                      <Route 
                        path="*" 
                        element={<Navigate to="/dashboard" replace />} 
                      />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </div>
  );
}

export default App;
