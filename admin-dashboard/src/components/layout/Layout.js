import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-secondary);
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.sidebarCollapsed ? '80px' : '280px'};
  transition: margin-left var(--transition-normal);
  
  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const Layout = ({ children }) => {
  const { sidebarCollapsed } = useTheme();

  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent sidebarCollapsed={sidebarCollapsed}>
        <Header />
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;
