
import React from 'react';
import { cn } from '@/lib/utils';
import { Settings, User, DollarSign } from 'lucide-react';
import AppLogo from './AppLogo';
import { APP_CONFIG, TAB_COLORS } from '@/constants/app';

type TabType = 'supplements' | 'calculator' | 'timer' | 'platecalculator' | 'unitconverter';

interface AppHeaderProps {
  isDarkMode: boolean;
  activeTab: TabType;
  onLoginClick: () => void;
  onSettingsClick: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  isDarkMode,
  activeTab,
  onLoginClick,
  onSettingsClick
}) => {
  const handleDonateClick = () => {
    window.open(APP_CONFIG.donateUrl, '_blank');
  };

  const getTitleColor = () => TAB_COLORS[activeTab];

  return (
    <div className={cn(
      "p-4 shadow-lg relative pt-safe backdrop-blur-md border-b transition-all duration-300",
      isDarkMode 
        ? "bg-gray-900/95 border-gray-800" 
        : "bg-white/95 border-gray-200"
    )}>
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <button
          onClick={onLoginClick}
          className={cn(
            "flex items-center space-x-2 p-3 rounded-xl transition-all duration-200 hover:scale-105 group",
            isDarkMode 
              ? "bg-gray-800/70 hover:bg-gray-700 text-gray-300 shadow-md" 
              : "bg-gray-100/70 hover:bg-gray-200 text-gray-700 shadow-sm"
          )}
        >
          <User size={20} className="group-hover:scale-110 transition-transform duration-200" />
        </button>
        
        <div className="flex items-center space-x-3 absolute left-1/2 transform -translate-x-1/2">
          <div className="p-1 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-md">
            <AppLogo size={32} />
          </div>
          <h1 className={cn(
            "text-xl font-bold tracking-tight transition-colors duration-200",
            getTitleColor(),
            "drop-shadow-sm"
          )}>
            {APP_CONFIG.name}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDonateClick}
            className="p-3 rounded-xl transition-all duration-200 text-green-500 hover:text-green-400 hover:bg-green-500/10 hover:scale-110 shadow-sm"
            title="Support the project"
          >
            <DollarSign size={20} className="drop-shadow-sm" />
          </button>
          <button
            onClick={onSettingsClick}
            className={cn(
              "p-3 rounded-xl transition-all duration-200 hover:scale-105 group",
              isDarkMode 
                ? "hover:bg-gray-800 text-gray-400 hover:text-gray-300" 
                : "hover:bg-gray-200 text-gray-600 hover:text-gray-700"
            )}
          >
            <Settings 
              size={20} 
              className="group-hover:rotate-90 transition-transform duration-300" 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
