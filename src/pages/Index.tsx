import React, { useState, createContext, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { cn } from '@/lib/utils';
import SupplementsTab from '@/components/SupplementsTab';
import CalculatorTab from '@/components/CalculatorTab';
import TimerTab from '@/components/TimerTab';
import PlateCalculatorTab from '@/components/PlateCalculatorTab';
import UnitConverterTab from '@/components/UnitConverterTab';
import SettingsModal from '@/components/SettingsModal';
import LoginModal from '@/components/LoginModal';
import AppHeader from '@/components/AppHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { APP_CONFIG } from '@/constants/app';
import { TabType, AppSettings } from '@/types/app';
import { NotificationService } from '@/services/notificationService';
import { SecureStorageService } from '@/services/secureStorageService';
import { BackgroundService } from '@/services/backgroundService';

export const SettingsContext = createContext<AppSettings>({
  isDarkMode: APP_CONFIG.defaultSettings.isDarkMode,
  isKg: APP_CONFIG.defaultSettings.isKg,
  setIsDarkMode: () => {},
  setIsKg: () => {},
  motivationReminder: false,
  setMotivationReminder: () => {},
  harshMotivation: false,
  setHarshMotivation: () => {}
});

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('supplements');
  const [showSettings, setShowSettings] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(APP_CONFIG.defaultSettings.isDarkMode);
  const [isKg, setIsKgState] = useState<boolean>(APP_CONFIG.defaultSettings.isKg);
  const [motivationReminder, setMotivationReminderState] = useState<boolean>(false);
  const [harshMotivation, setHarshMotivationState] = useState<boolean>(false);

  const storageService = SecureStorageService.getInstance();
  const backgroundService = BackgroundService.getInstance();

  // Load settings from secure storage on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedDarkMode = await storageService.getItem<boolean>('isDarkMode');
        const savedIsKg = await storageService.getItem<boolean>('isKg');
        const savedMotivationReminder = await storageService.getItem<boolean>('motivationReminder');
        const savedHarshMotivation = await storageService.getItem<boolean>('harshMotivation');
        
        if (savedDarkMode !== null) setIsDarkModeState(savedDarkMode);
        if (savedIsKg !== null) setIsKgState(savedIsKg);
        if (savedMotivationReminder !== null) setMotivationReminderState(savedMotivationReminder);
        if (savedHarshMotivation !== null) setHarshMotivationState(savedHarshMotivation);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    loadSettings();

    // Update last app open timestamp
    backgroundService.updateLastAppOpen();

    // Request notification permissions on web
    if (!Capacitor.isNativePlatform() && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // Wrapper functions to match the expected interface and save to secure storage
  const setIsDarkMode = async (value: boolean) => {
    setIsDarkModeState(value);
    await storageService.setItem('isDarkMode', value);
  };
  
  const setIsKg = async (value: boolean) => {
    setIsKgState(value);
    await storageService.setItem('isKg', value);
  };
  
  const setMotivationReminder = async (value: boolean) => {
    setMotivationReminderState(value);
    await storageService.setItem('motivationReminder', value);
    const notificationService = NotificationService.getInstance();
    if (value) {
      try {
        await notificationService.requestPermissions();
        notificationService.startMotivationalReminders(true, harshMotivation);
      } catch (error) {
        console.error('Failed to set up motivation reminders:', error);
      }
    }
  };
  
  const setHarshMotivation = async (value: boolean) => {
    setHarshMotivationState(value);
    await storageService.setItem('harshMotivation', value);
  };

  useEffect(() => {
    // Update last app open timestamp when component mounts
    const notificationService = NotificationService.getInstance();
    notificationService.updateLastAppOpen();
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'supplements':
        return <SupplementsTab />;
      case 'calculator':
        return <CalculatorTab />;
      case 'timer':
        return <TimerTab />;
      case 'platecalculator':
        return <PlateCalculatorTab />;
      case 'unitconverter':
        return <UnitConverterTab />;
      default:
        return <SupplementsTab />;
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      isDarkMode, 
      isKg, 
      setIsDarkMode, 
      setIsKg, 
      motivationReminder, 
      setMotivationReminder, 
      harshMotivation, 
      setHarshMotivation 
    }}>
      <div className={cn(
        "min-h-screen flex flex-col safe-area-inset transition-colors duration-300",
        isDarkMode ? "bg-gradient-to-br from-gray-900 to-black text-white" : "bg-gradient-to-br from-gray-50 to-white text-gray-900"
      )}>
        <AppHeader
          isDarkMode={isDarkMode}
          activeTab={activeTab}
          onLoginClick={() => setShowLogin(true)}
          onSettingsClick={() => setShowSettings(true)}
        />

        <div className="flex-1 overflow-auto pb-safe-bottom px-1">
          <div className="container mx-auto max-w-6xl">
            {renderActiveTab()}
          </div>
        </div>

        <BottomNavigation
          isDarkMode={isDarkMode}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {showSettings && (
          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

        {showLogin && (
          <LoginModal
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
          />
        )}
      </div>
    </SettingsContext.Provider>
  );
};

export default Index;
