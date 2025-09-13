import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiBarChart3, 
  FiSettings, 
  FiChevronLeft,
  FiChevronRight,
  FiUser
} from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const SidebarContainer = styled(motion.aside)`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${props => props.collapsed ? '80px' : '280px'};
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 100%);
  border-right: 1px solid var(--border-light);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-sticky);
  transition: width var(--transition-normal);
  overflow: hidden;
  
  @media (max-width: 1024px) {
    transform: translateX(${props => props.mobileOpen ? '0' : '-100%'});
    width: 280px;
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
  min-height: 80px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
`;

const LogoText = styled.h1`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  white-space: nowrap;
  opacity: ${props => props.collapsed ? 0 : 1};
  transition: opacity var(--transition-normal);
`;

const CollapseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-primary);
    color: white;
    transform: scale(1.05);
  }
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const Navigation = styled.nav`
  padding: var(--spacing-lg) 0;
  flex: 1;
`;

const NavSection = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const NavSectionTitle = styled.h3`
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  margin: 0 var(--spacing-lg) var(--spacing-md);
  opacity: ${props => props.collapsed ? 0 : 1};
  transition: opacity var(--transition-normal);
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-fast);
  position: relative;
  
  &:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }
  
  &.active {
    background: linear-gradient(90deg, var(--color-primary), transparent);
    color: var(--color-primary);
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--color-primary);
    }
  }
`;

const NavIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const NavText = styled.span`
  white-space: nowrap;
  opacity: ${props => props.collapsed ? 0 : 1};
  transition: opacity var(--transition-normal);
`;

const UserSection = styled.div`
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-light);
  margin-top: auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
`;

const UserDetails = styled.div`
  opacity: ${props => props.collapsed ? 0 : 1};
  transition: opacity var(--transition-normal);
`;

const UserName = styled.p`
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  font-size: var(--font-size-sm);
`;

const UserRole = styled.p`
  color: var(--text-tertiary);
  margin: 0;
  font-size: var(--font-size-xs);
`;

const navigationItems = [
  {
    section: 'Main',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: FiHome },
      { path: '/analytics', label: 'Analytics', icon: FiBarChart3 }
    ]
  },
  {
    section: 'Management',
    items: [
      { path: '/products', label: 'Products', icon: FiPackage },
      { path: '/orders', label: 'Orders', icon: FiShoppingCart },
      { path: '/customers', label: 'Customers', icon: FiUsers }
    ]
  },
  {
    section: 'Account',
    items: [
      { path: '/profile', label: 'Profile', icon: FiUser },
      { path: '/settings', label: 'Settings', icon: FiSettings }
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useTheme();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getUserInitials = (user) => {
    if (!user) return 'A';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <SidebarContainer
      collapsed={sidebarCollapsed}
      mobileOpen={mobileOpen}
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SidebarHeader>
        <Logo>
          <LogoIcon>LA</LogoIcon>
          <LogoText collapsed={sidebarCollapsed}>LuxeAdmin</LogoText>
        </Logo>
        <CollapseButton onClick={toggleSidebar}>
          {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </CollapseButton>
      </SidebarHeader>

      <Navigation>
        {navigationItems.map((section, sectionIndex) => (
          <NavSection key={sectionIndex}>
            <NavSectionTitle collapsed={sidebarCollapsed}>
              {section.section}
            </NavSectionTitle>
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavItem
                  key={itemIndex}
                  to={item.path}
                  className={isActive ? 'active' : ''}
                >
                  <NavIcon>
                    <Icon />
                  </NavIcon>
                  <NavText collapsed={sidebarCollapsed}>
                    {item.label}
                  </NavText>
                </NavItem>
              );
            })}
          </NavSection>
        ))}
      </Navigation>

      <UserSection>
        <UserInfo>
          <UserAvatar>
            {getUserInitials(user)}
          </UserAvatar>
          <UserDetails collapsed={sidebarCollapsed}>
            <UserName>{user?.firstName} {user?.lastName}</UserName>
            <UserRole>Administrator</UserRole>
          </UserDetails>
        </UserInfo>
      </UserSection>
    </SidebarContainer>
  );
};

export default Sidebar;
