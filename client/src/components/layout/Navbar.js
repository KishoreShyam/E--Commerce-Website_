import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiHeart, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useTheme } from '../../contexts/ThemeContext';
import CartSidebar from '../cart/CartSidebar';
import FavoritesSidebar from '../favorites/FavoritesSidebar';

const NavbarContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--gray-200);
  z-index: var(--z-fixed);
  transition: all var(--transition-normal);

  &.scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: var(--shadow-lg);
  }
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

const Logo = styled(Link)`
  font-family: var(--font-family-display);
  font-size: 28px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: all var(--transition-fast);

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-lg);

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: var(--gray-700);
  text-decoration: none;
  font-weight: 500;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  position: relative;

  &:hover {
    color: var(--primary-dark);
    background: var(--gray-100);
  }

  &.active {
    color: var(--primary-dark);
    background: var(--gray-100);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--primary-gradient);
    transition: all var(--transition-fast);
    transform: translateX(-50%);
  }

  &:hover::after,
  &.active::after {
    width: 80%;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 640px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 250px;
  padding: var(--space-sm) var(--space-md);
  padding-left: 40px;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-full);
  font-size: 14px;
  transition: all var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--primary-light);
    box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.1);
  }

  &::placeholder {
    color: var(--gray-400);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  pointer-events: none;
  font-size: 16px;
`;

const IconButton = styled(motion.button)`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--gray-100);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--gray-200);
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
    color: var(--gray-700);
  }
`;

const CartBadge = styled(motion.span)`
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--error);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileMenuButton = styled(IconButton)`
  display: none;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid var(--gray-200);
  padding: var(--space-lg);
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
`;

const MobileNavLink = styled(Link)`
  color: var(--gray-700);
  text-decoration: none;
  font-weight: 500;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:hover {
    color: var(--primary-dark);
    background: var(--gray-100);
  }

  &.active {
    color: var(--primary-dark);
    background: var(--gray-100);
  }
`;

const UserMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--space-sm);
  min-width: 200px;
  z-index: var(--z-dropdown);
`;

const UserMenuItem = styled.button`
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  text-align: left;
  background: none;
  border: none;
  color: var(--gray-700);
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  cursor: pointer;

  &:hover {
    background: var(--gray-100);
    color: var(--primary-dark);
  }
`;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <NavbarContainer
        className={isScrolled ? 'scrolled' : ''}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <NavContent>
          <Logo to="/">LuxeCommerce</Logo>

          <NavLinks>
            <NavLink to="/" className={isActive('/') ? 'active' : ''}>
              Home
            </NavLink>
            <NavLink to="/products" className={isActive('/products') ? 'active' : ''}>
              Products
            </NavLink>
            <NavLink to="/about" className={isActive('/about') ? 'active' : ''}>
              About
            </NavLink>
            <NavLink to="/contact" className={isActive('/contact') ? 'active' : ''}>
              Contact
            </NavLink>
          </NavLinks>

          <NavActions>
            <SearchContainer>
              <form onSubmit={handleSearch}>
                <SearchInput
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <SearchIcon />
              </form>
            </SearchContainer>

            <IconButton
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDarkMode ? <FiSun /> : <FiMoon />}
            </IconButton>

            <IconButton
              onClick={() => setIsFavoritesOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiHeart />
              <AnimatePresence>
                {favorites.length > 0 && (
                  <CartBadge
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {favorites.length}
                  </CartBadge>
                )}
              </AnimatePresence>
            </IconButton>

            <IconButton
              onClick={() => setIsCartOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiShoppingCart />
              <AnimatePresence>
                {totalItems > 0 && (
                  <CartBadge
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {totalItems}
                  </CartBadge>
                )}
              </AnimatePresence>
            </IconButton>

            <div style={{ position: 'relative' }}>
              <IconButton
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiUser />
              </IconButton>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <UserMenu
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isAuthenticated ? (
                      <>
                        <UserMenuItem onClick={() => navigate('/profile')}>
                          Profile
                        </UserMenuItem>
                        <UserMenuItem onClick={() => navigate('/orders')}>
                          Orders
                        </UserMenuItem>
                        <UserMenuItem onClick={handleLogout}>
                          Logout
                        </UserMenuItem>
                      </>
                    ) : (
                      <>
                        <UserMenuItem onClick={() => navigate('/login')}>
                          Login
                        </UserMenuItem>
                        <UserMenuItem onClick={() => navigate('/register')}>
                          Register
                        </UserMenuItem>
                      </>
                    )}
                  </UserMenu>
                )}
              </AnimatePresence>
            </div>

            <MobileMenuButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </MobileMenuButton>
          </NavActions>
        </NavContent>
      </NavbarContainer>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MobileNavLinks>
              <MobileNavLink 
                to="/" 
                className={isActive('/') ? 'active' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </MobileNavLink>
              <MobileNavLink 
                to="/products" 
                className={isActive('/products') ? 'active' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </MobileNavLink>
              <MobileNavLink 
                to="/about" 
                className={isActive('/about') ? 'active' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </MobileNavLink>
              <MobileNavLink 
                to="/contact" 
                className={isActive('/contact') ? 'active' : ''}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </MobileNavLink>
            </MobileNavLinks>
          </MobileMenu>
        )}
      </AnimatePresence>

      {/* Cart and Favorites Sidebars */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <FavoritesSidebar isOpen={isFavoritesOpen} onClose={() => setIsFavoritesOpen(false)} />
    </>
  );
};

export default Navbar;
