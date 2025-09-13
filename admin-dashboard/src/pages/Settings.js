import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FiSave, 
  FiRefreshCw, 
  FiMoon, 
  FiSun,
  FiMonitor,
  FiPalette,
  FiToggleLeft,
  FiToggleRight,
  FiSettings as FiSettingsIcon
} from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'react-toastify';

const SettingsContainer = styled.div`
  padding: 0;
`;

const SettingsHeader = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const Title = styled.h1`
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: var(--spacing-lg);
`;

const SettingCard = styled(motion.div)`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: var(--color-primary)20;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const CardTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const CardDescription = styled.p`
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
`;

const SettingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-light);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingLabel = styled.div`
  flex: 1;
`;

const SettingName = styled.h4`
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
`;

const SettingDesc = styled.p`
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
`;

const SettingControl = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const ToggleButton = styled.button`
  width: 50px;
  height: 28px;
  border-radius: 14px;
  border: none;
  background: ${props => props.active ? 'var(--color-primary)' : 'var(--color-gray-300)'};
  position: relative;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: ${props => props.active ? '24px' : '2px'};
    transition: all var(--transition-fast);
    box-shadow: var(--shadow-sm);
  }
`;

const ThemeSelector = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const ThemeOption = styled.button`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  border: 2px solid ${props => props.active ? 'var(--color-primary)' : 'var(--border-light)'};
  background: ${props => props.theme === 'light' ? '#ffffff' : props.theme === 'dark' ? '#1f2937' : 'linear-gradient(45deg, #ffffff 50%, #1f2937 50%)'};
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme === 'light' ? '#1f2937' : '#ffffff'};
  
  &:hover {
    border-color: var(--color-primary);
    transform: scale(1.05);
  }
`;

const ColorPicker = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
`;

const ColorOption = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${props => props.active ? 'white' : 'transparent'};
  background: ${props => props.color};
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: ${props => props.active ? '0 0 0 2px var(--color-primary)' : 'var(--shadow-sm)'};
  
  &:hover {
    transform: scale(1.1);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
`;

const Button = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &.primary {
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }
  
  &.secondary {
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 1px solid var(--border-light);
    
    &:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }
`;

const Settings = () => {
  const {
    isDarkMode,
    toggleDarkMode,
    primaryColor,
    setPrimaryColor,
    sidebarCollapsed,
    toggleSidebar,
    animationsEnabled,
    toggleAnimations,
    compactMode,
    toggleCompactMode,
    resetTheme
  } = useTheme();

  const [localSettings, setLocalSettings] = useState({
    notifications: true,
    emailAlerts: true,
    autoSave: true,
    soundEffects: false
  });

  const colorOptions = [
    '#3b82f6', // Blue
    '#8b5cf6', // Purple
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#ef4444', // Red
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#84cc16'  // Lime
  ];

  const handleSaveSettings = () => {
    // Here you would typically save settings to the backend
    toast.success('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    resetTheme();
    setLocalSettings({
      notifications: true,
      emailAlerts: true,
      autoSave: true,
      soundEffects: false
    });
    toast.info('Settings reset to defaults');
  };

  return (
    <SettingsContainer>
      <SettingsHeader>
        <Title>Settings</Title>
      </SettingsHeader>

      <SettingsGrid>
        <SettingCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardHeader>
            <CardIcon>
              <FiPalette />
            </CardIcon>
            <div>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </div>
          </CardHeader>

          <SettingGroup>
            <SettingItem>
              <SettingLabel>
                <SettingName>Theme</SettingName>
                <SettingDesc>Choose between light and dark mode</SettingDesc>
              </SettingLabel>
              <SettingControl>
                <ThemeSelector>
                  <ThemeOption
                    theme="light"
                    active={!isDarkMode}
                    onClick={() => !isDarkMode || toggleDarkMode()}
                  >
                    <FiSun />
                  </ThemeOption>
                  <ThemeOption
                    theme="dark"
                    active={isDarkMode}
                    onClick={() => isDarkMode || toggleDarkMode()}
                  >
                    <FiMoon />
                  </ThemeOption>
                </ThemeSelector>
              </SettingControl>
            </SettingItem>

            <SettingItem>
              <SettingLabel>
                <SettingName>Primary Color</SettingName>
                <SettingDesc>Select your preferred accent color</SettingDesc>
              </SettingLabel>
              <SettingControl>
                <ColorPicker>
                  {colorOptions.map(color => (
                    <ColorOption
                      key={color}
                      color={color}
                      active={primaryColor === color}
                      onClick={() => setPrimaryColor(color)}
                    />
                  ))}
                </ColorPicker>
              </SettingControl>
            </SettingItem>

            <SettingItem>
              <SettingLabel>
                <SettingName>Animations</SettingName>
                <SettingDesc>Enable or disable interface animations</SettingDesc>
              </SettingLabel>
              <SettingControl>
                <ToggleButton
                  active={animationsEnabled}
                  onClick={toggleAnimations}
                />
              </SettingControl>
            </SettingItem>

            <SettingItem>
              <SettingLabel>
                <SettingName>Compact Mode</SettingName>
                <SettingDesc>Use smaller spacing for more content</SettingDesc>
              </SettingLabel>
              <SettingControl>
                <ToggleButton
                  active={compactMode}
                  onClick={toggleCompactMode}
                />
              </SettingControl>
            </SettingItem>
          </SettingGroup>
        </SettingCard>

        <SettingCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CardHeader>
            <CardIcon>
              <FiSettingsIcon />
            </CardIcon>
            <div>
              <CardTitle>General</CardTitle>
              <CardDescription>General application preferences</CardDescription>
            </div>
          </CardHeader>

          <SettingGroup>
            <SettingItem>
              <SettingLabel>
                <SettingName>Notifications</SettingName>
                <SettingDesc>Receive in-app notifications</SettingDesc>
              </SettingLabel>
              <SettingControl>
                <ToggleButton
                  active={localSettings.notifications}
                  onClick={() => setLocalSettings(prev => ({
                    ...prev,
                    notifications: !prev.notifications
                  }))}
                />
              </SettingControl>
            </SettingItem>

            <SettingItem>
              <SettingLabel>
                <SettingName>Email Alerts</SettingName>
                <SettingDesc>Get email notifications for important events</SettingDesc>
              </SettingLabel>
              <SettingControl>
                <ToggleButton
                  active={localSettings.emailAlerts}
                  onClick={() => setLocalSettings(prev => ({
                    ...prev,
                    emailAlerts: !prev.emailAlerts
                  }))}
                />
              </SettingControl>
            </SettingItem>

            <SettingItem>
              <SettingLabel>
                <SettingName>Auto Save</SettingName>
                <SettingDesc>Automatically save changes as you work</SettingDesc>
              </SettingLabel>
              <SettingControl>
                <ToggleButton
                  active={localSettings.autoSave}
                  onClick={() => setLocalSettings(prev => ({
                    ...prev,
                    autoSave: !prev.autoSave
                  }))}
                />
              </SettingControl>
            </SettingItem>

            <SettingItem>
              <SettingLabel>
                <SettingName>Sound Effects</SettingName>
                <SettingDesc>Play sounds for notifications and actions</SettingDesc>
              </SettingLabel>
              <SettingControl>
                <ToggleButton
                  active={localSettings.soundEffects}
                  onClick={() => setLocalSettings(prev => ({
                    ...prev,
                    soundEffects: !prev.soundEffects
                  }))}
                />
              </SettingControl>
            </SettingItem>
          </SettingGroup>
        </SettingCard>
      </SettingsGrid>

      <ActionButtons>
        <Button
          className="secondary"
          onClick={handleResetSettings}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiRefreshCw />
          Reset to Defaults
        </Button>
        <Button
          className="primary"
          onClick={handleSaveSettings}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiSave />
          Save Settings
        </Button>
      </ActionButtons>
    </SettingsContainer>
  );
};

export default Settings;
