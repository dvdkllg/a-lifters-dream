
import React, { useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Pill, Calculator, Timer, Weight, Settings, Scale, LogIn } from 'lucide-react';
import SupplementsTab from '@/components/SupplementsTab';
import CalculatorTab from '@/components/CalculatorTab';
import TimerTab from '@/components/TimerTab';
import PlateCalculatorTab from '@/components/PlateCalculatorTab';
import UnitConverterTab from '@/components/UnitConverterTab';
import SettingsModal from '@/components/SettingsModal';

type TabType = 'supplements' | 'calculator' | 'timer' | 'platecalculator' | 'unitconverter';

interface AppSettings {
  isDarkMode: boolean;
  isKg: boolean;
  setIsDarkMode: (value: boolean) => void;
  setIsKg: (value: boolean) => void;
}

export const SettingsContext = createContext<AppSettings>({
  isDarkMode: true,
  isKg: true, // Changed default to true (kg)
  setIsDarkMode: () => {},
  setIsKg: () => {}
});

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('supplements');
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isKg, setIsKg] = useState(true); // Changed default to true (kg)

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
        "min-h-screen flex flex-col",
        isDarkMode ? "bg-black text-white" : "bg-white text-black"
      )}>
        {/* Header */}
        <div className={cn(
          "p-4 shadow-lg relative",
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        )}>
          <div className="flex justify-between items-center">
            <h1 className={cn("text-xl font-bold", getTitleColor())}>
              A Lifter's Dream
            </h1>
            <div className="flex items-center space-x-2">
              <button
                className="flex items-center space-x-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <LogIn size={16} />
                <span className="text-sm">Login</span>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Settings size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto pb-24">
          {renderActiveTab()}
        </div>

        {/* Fixed Bottom Navigation */}
        <div className={cn(
          "fixed bottom-0 left-0 right-0",
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        )}>
          <div className="flex justify-around py-2">
            <button
              onClick={() => setActiveTab('supplements')}
              className={cn(
                "flex flex-col items-center py-2 px-2 rounded-lg transition-colors text-xs",
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
                "flex flex-col items-center py-2 px-2 rounded-lg transition-colors text-xs",
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
                "flex flex-col items-center py-2 px-2 rounded-lg transition-colors text-xs",
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
                "flex flex-col items-center py-2 px-2 rounded-lg transition-colors text-xs",
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
                "flex flex-col items-center py-2 px-2 rounded-lg transition-colors text-xs",
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
      </div>
    </SettingsContext.Provider>
  );
};

export default Index;
