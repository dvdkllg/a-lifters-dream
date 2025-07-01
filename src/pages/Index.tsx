
import React, { useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Pill, Calculator, Timer, Weight, Settings } from 'lucide-react';
import SupplementsTab from '@/components/SupplementsTab';
import CalculatorTab from '@/components/CalculatorTab';
import TimerTab from '@/components/TimerTab';
import PlateCalculatorTab from '@/components/PlateCalculatorTab';
import SettingsModal from '@/components/SettingsModal';

type TabType = 'supplements' | 'calculator' | 'timer' | 'platecalculator';

interface AppSettings {
  isDarkMode: boolean;
  isKg: boolean;
  setIsDarkMode: (value: boolean) => void;
  setIsKg: (value: boolean) => void;
}

export const SettingsContext = createContext<AppSettings>({
  isDarkMode: true,
  isKg: false,
  setIsDarkMode: () => {},
  setIsKg: () => {}
});

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('supplements');
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isKg, setIsKg] = useState(false);

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
      default:
        return 'text-purple-400';
    }
  };

  const getAccentColor = () => {
    switch (activeTab) {
      case 'supplements':
        return 'bg-purple-400';
      case 'calculator':
        return 'bg-blue-400';
      case 'timer':
        return 'bg-green-400';
      case 'platecalculator':
        return 'bg-orange-400';
      default:
        return 'bg-purple-400';
    }
  };

  return (
    <SettingsContext.Provider value={{ isDarkMode, isKg, setIsDarkMode, setIsKg }}>
      <div className={cn(
        "min-h-screen flex flex-col",
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      )}>
        {/* Header */}
        <div className={cn(
          "p-4 shadow-lg relative",
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        )}>
          <h1 className={cn("text-xl font-bold text-center", getTitleColor())}>
            A Lifter's Dream
          </h1>
          {/* Colored line below title */}
          <div className={cn("h-0.5 w-full mt-2", getAccentColor())}></div>
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Settings size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto pb-20">
          {renderActiveTab()}
        </div>

        {/* Colored line above navigation */}
        <div className={cn("h-0.5 w-full", getAccentColor())}></div>

        {/* Fixed Bottom Navigation */}
        <div className={cn(
          "fixed bottom-0 left-0 right-0",
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        )}>
          <div className="flex justify-around py-2">
            <button
              onClick={() => setActiveTab('supplements')}
              className={cn(
                "flex flex-col items-center py-2 px-4 rounded-lg transition-colors",
                activeTab === 'supplements' 
                  ? "bg-purple-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Pill size={20} />
              <span className="text-xs mt-1">Supplements</span>
            </button>
            
            <button
              onClick={() => setActiveTab('calculator')}
              className={cn(
                "flex flex-col items-center py-2 px-4 rounded-lg transition-colors",
                activeTab === 'calculator' 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Calculator size={20} />
              <span className="text-xs mt-1">Calculator</span>
            </button>
            
            <button
              onClick={() => setActiveTab('timer')}
              className={cn(
                "flex flex-col items-center py-2 px-4 rounded-lg transition-colors",
                activeTab === 'timer' 
                  ? "bg-green-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Timer size={20} />
              <span className="text-xs mt-1">Rest Timer</span>
            </button>
            
            <button
              onClick={() => setActiveTab('platecalculator')}
              className={cn(
                "flex flex-col items-center py-2 px-4 rounded-lg transition-colors",
                activeTab === 'platecalculator' 
                  ? "bg-orange-600 text-white" 
                  : "text-gray-400 hover:text-white"
              )}
            >
              <Weight size={20} />
              <span className="text-xs mt-1">Plates</span>
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
      </div>
    </SettingsContext.Provider>
  );
};

export default Index;
