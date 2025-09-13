import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiSearch, 
  FiShoppingBag, 
  FiHeart, 
  FiUser, 
  FiMenu,
  FiX,
  FiShoppingCart
} from 'react-icons/fi';

const MobileNavContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const NavGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  max-width: 500px;
  margin: 0 auto;
  padding: 0 16px;
`;

const NavItem = styled(motion(Link))`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  text-decoration: none;
  color: ${props => props.active ? '#667eea' : '#6b7280'};
  position: relative;
  
  svg {
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
    transition: all 0.2s ease;
  }
  
  span {
    font-size: 10px;
    font-weight: 500;
    text-align: center;
    line-height: 1;
  }
`;

const Badge = styled.div`
  position: absolute;
  top: 2px;
  right: 8px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  border: 2px solid white;
`;

const MenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  backdrop-filter: blur(4px);
`;

const MenuPanel = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: white;
  z-index: 1002;
  padding: 20px;
  overflow-y: auto;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
`;

const MenuHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  margin-left: auto;
  
  &:hover {
    background: #f3f4f6;
  }
  
  svg {
    width: 24px;
    height: 24px;
    color: #6b7280;
  }
`;

const MenuSection = styled.div`
  margin-bottom: 30px;
`;

const MenuTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 15px;
`;

const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: #667eea;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const MobileNavigation = ({ cartCount = 0, wishlistCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/products', icon: FiSearch, label: 'Shop' },
    { path: '/cart', icon: FiShoppingCart, label: 'Cart', badge: cartCount },
    { path: '/wishlist', icon: FiHeart, label: 'Wishlist', badge: wishlistCount },
    { path: '/menu', icon: FiMenu, label: 'Menu', isMenu: true }
  ];

  const menuVariants = {
    hidden: { x: '100%' },
    visible: { 
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: { 
      x: '100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <>
      <MobileNavContainer>
        <NavGrid>
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.isMenu ? '#' : item.path}
              active={isActive(item.path)}
              onClick={item.isMenu ? (e) => {
                e.preventDefault();
                setIsMenuOpen(true);
              } : undefined}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon />
              <span>{item.label}</span>
              {item.badge > 0 && <Badge>{item.badge > 99 ? '99+' : item.badge}</Badge>}
            </NavItem>
          ))}
        </NavGrid>
      </MobileNavContainer>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <MenuOverlay
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsMenuOpen(false)}
            />
            <MenuPanel
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <MenuHeader>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Menu</h2>
                <CloseButton onClick={() => setIsMenuOpen(false)}>
                  <FiX />
                </CloseButton>
              </MenuHeader>

              <MenuSection>
                <MenuTitle>Account</MenuTitle>
                <MenuLink to="/profile">
                  <FiUser />
                  My Profile
                </MenuLink>
                <MenuLink to="/orders">
                  <FiShoppingBag />
                  My Orders
                </MenuLink>
                <MenuLink to="/wishlist">
                  <FiHeart />
                  Wishlist ({wishlistCount})
                </MenuLink>
              </MenuSection>

              <MenuSection>
                <MenuTitle>Categories</MenuTitle>
                <MenuLink to="/products?category=electronics">
                  Electronics
                </MenuLink>
                <MenuLink to="/products?category=fashion">
                  Fashion
                </MenuLink>
                <MenuLink to="/products?category=home">
                  Home & Garden
                </MenuLink>
                <MenuLink to="/products?category=sports">
                  Sports & Outdoors
                </MenuLink>
              </MenuSection>

              <MenuSection>
                <MenuTitle>Support</MenuTitle>
                <MenuLink to="/help">
                  Help Center
                </MenuLink>
                <MenuLink to="/contact">
                  Contact Us
                </MenuLink>
                <MenuLink to="/about">
                  About Us
                </MenuLink>
              </MenuSection>
            </MenuPanel>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;
