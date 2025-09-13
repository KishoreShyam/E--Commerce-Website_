import React, { useState, useEffect, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/auth/ProtectedRoute';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/products" element={<PageTransition variant="slide"><Products /></PageTransition>} />
        <Route path="/products/:id" element={<PageTransition variant="scale"><ProductDetail /></PageTransition>} />
        <Route path="/cart" element={<PageTransition variant="slide"><Cart /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/about" element={<PageTransition variant="scale"><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route 
          path="/checkout" 
          element={
            <PageTransition variant="slide">
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            </PageTransition>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PageTransition>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </PageTransition>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <PageTransition variant="slide">
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner text="Welcome to LuxeCommerce" />;
  }

  return (
    <FavoritesProvider>
      <div className="App">
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 140px)' }}>
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatedRoutes />
          </Suspense>
        </main>
        <Footer />
      </div>
    </FavoritesProvider>
  );
}

export default App;
