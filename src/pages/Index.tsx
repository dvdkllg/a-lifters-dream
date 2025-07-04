
import React, { useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Pill, Calculator, Timer, Weight, Settings, Scale, User } from 'lucide-react';
import SupplementsTab from '@/components/SupplementsTab';
import CalculatorTab from '@/components/CalculatorTab';
import TimerTab from '@/components/TimerTab';
import PlateCalculatorTab from '@/components/PlateCalculatorTab';
import UnitConverterTab from '@/components/UnitConverterTab';
import SettingsModal from '@/components/SettingsModal';
import LoginModal from '@/components/LoginModal';

type TabType = 'supplements' | 'calculator' | 'timer' | 'platecalculator' | 'unitconverter';

interface AppSettings {
  isDarkMode: boolean;
  isKg: boolean;
  setIsDarkMode: (value: boolean) => void;
  setIsKg: (value: boolean) => void;
}

export const SettingsContext = createContext<AppSettings>({
  isDarkMode: true,
  isKg: true,
  setIsDarkMode: () => {},
  setIsKg: () => {}
});

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('supplements');
  const [showSettings, setShowSettings] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isKg, setIsKg] = useState(true);

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

  const getTitleColor = () => {
    switch (activeTab) {
      case 'supplements':
        return 'text-purple-400';
      case 'calculator':
        return 'text-blue-400';
      case 'timer':
        return 'text-green-400';
      case 'platecalculator':
        return 'text-orange-400';
      case 'unitconverter':
        return 'text-cyan-400';
      default:
        return 'text-purple-400';
    }
  };

  return (
    <SettingsContext.Provider value={{ isDarkMode, isKg, setIsDarkMode, setIsKg }}>
      <div className={cn(
        "min-h-screen flex flex-col safe-area-inset",
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      )}>
        {/* Header with mobile-safe padding */}
        <div className={cn(
          "p-4 shadow-lg relative pt-safe",
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        )}>
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowLogin(true)}
              className={cn(
                "flex items-center space-x-2 p-2 rounded-lg transition-colors",
                isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              )}
            >
              <User size={20} />
            </button>
            <h1 className={cn("text-xl font-bold absolute left-1/2 transform -translate-x-1/2", getTitleColor())}>
              A Lifter's Dream
            </h1>
            <button
              onClick={() => setShowSettings(true)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-300 text-gray-600"
              )}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Main Content with mobile-safe padding */}
        <div className="flex-1 overflow-auto pb-safe-bottom">
          {renderActiveTab()}
        </div>

        {/* Fixed Bottom Navigation with mobile-safe padding */}
        <div className={cn(
          "fixed bottom-0 left-0 right-0 pb-safe",
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        )}>
          <div className="flex justify-around py-2 px-2">
            <button
              onClick={() => setActiveTab('supplements')}
              className={cn(
                "flex flex-col items-center py-2 px-2 rounded-lg transition-colors text-xs min-w-[60px]",
                activeTab === 'supplements' 
                  ? "bg-purple-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Pill size={18} />
              <span className="mt-1">Supplements</span>
            </button>
            
            <button
              onClick={() => setActiveTab('calculator')}
              className={cn(
                "flex flex-col items-center py-2 px-2 rounded-lg transition-colors text-xs min-w-[60px]",
                activeTab === 'calculator' 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Calculator size={18} />
              <span className="mt-1">Calculator</span>
            </button>
            
            <button
              onClick={() => setActiveTab('timer')}
              className={cn(
                "flex flex-col items-center py-2 px-2 rounded-lg transition-colors text-xs min-w-[60px]",
                activeTab === 'timer' 
                  ? "bg-green-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Timer size={18} />
              <span className="mt-1">Rest Timer</span>
            </button>
            
            <button
              onClick={() => setActiveTab('platecalculator')}
              className={cn(
                "flex flex-col items-center py-2 px-2 rounded-lg transition-colors text-xs min-w-[60px]",
                activeTab === 'platecalculator' 
                  ? "bg-orange-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Weight size={18} />
              <span className="mt-1">Plates</span>
            </button>

            <button
              onClick={() => setActiveTab('unitconverter')}
              className={cn(
                "flex flex-col items-center py-2 px-2 rounded-lg transition-colors text-xs min-w-[60px]",
                activeTab === 'unitconverter' 
                  ? "bg-cyan-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Scale size={18} />
              <span className="mt-1">Converter</span>
            </button>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <SettingsModal
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

        {/* Login Modal */}
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
