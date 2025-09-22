import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiBell, 
  FiMoon, 
  FiSun, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  min-height: 80px;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
`;

const MobileMenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-primary);
    color: white;
  }
  
  @media (max-width: 1024px) {
    display: flex;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 400px;
  
  @media (max-width: 768px) {
    width: 250px;
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 40px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  
  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
    background: var(--bg-primary);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  pointer-events: none;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const IconButton = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
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
    transform: translateY(-1px);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: var(--color-error);
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserMenuContainer = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-primary);
    box-shadow: var(--shadow-md);
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: var(--font-size-sm);
`;

const UserInfo = styled.div`
  text-align: left;
  
  @media (max-width: 768px) {
    display: none;
  }
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

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: var(--spacing-sm);
  width: 200px;
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  z-index: var(--z-dropdown);
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: background var(--transition-fast);
  
  &:hover {
    background: var(--bg-tertiary);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid var(--border-light);
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode, toggleSidebar } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getUserInitials = (user) => {
    if (!user) return 'A';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MobileMenuButton onClick={toggleSidebar}>
          <FiMenu />
        </MobileMenuButton>
        
        <SearchContainer>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search products, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </LeftSection>

      <RightSection>
        <IconButton onClick={toggleDarkMode}>
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </IconButton>
        
        <IconButton>
          <FiBell />
          <NotificationBadge>3</NotificationBadge>
        </IconButton>

        <UserMenuContainer>
          <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <UserAvatar>
              {getUserInitials(user)}
            </UserAvatar>
            <UserInfo>
              <UserName>{user?.firstName} {user?.lastName}</UserName>
              <UserRole>Administrator</UserRole>
            </UserInfo>
          </UserButton>

          <AnimatePresence>
            {userMenuOpen && (
              <DropdownMenu
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownItem onClick={() => setUserMenuOpen(false)}>
                  <FiUser />
                  Profile
                </DropdownItem>
                <DropdownItem onClick={() => setUserMenuOpen(false)}>
                  <FiSettings />
                  Settings
                </DropdownItem>
                <DropdownItem onClick={handleLogout}>
                  <FiLogOut />
                  Logout
                </DropdownItem>
              </DropdownMenu>
            )}
          </AnimatePresence>
        </UserMenuContainer>
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;
