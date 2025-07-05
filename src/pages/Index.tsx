
import React, { useState, createContext, useEffect } from 'react';
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

  // Wrapper functions to match the expected interface
  const setIsDarkMode = (value: boolean) => setIsDarkModeState(value);
  const setIsKg = (value: boolean) => setIsKgState(value);
  const setMotivationReminder = (value: boolean) => {
    setMotivationReminderState(value);
    const notificationService = NotificationService.getInstance();
    if (value) {
      notificationService.requestPermissions().then(() => {
        notificationService.startMotivationalReminders(true, harshMotivation);
      });
    }
  };
  const setHarshMotivation = (value: boolean) => setHarshMotivationState(value);

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
        "min-h-screen flex flex-col safe-area-inset",
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      )}>
        <AppHeader
          isDarkMode={isDarkMode}
          activeTab={activeTab}
          onLoginClick={() => setShowLogin(true)}
          onSettingsClick={() => setShowSettings(true)}
        />

        <div className="flex-1 overflow-auto pb-safe-bottom">
          {renderActiveTab()}
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
