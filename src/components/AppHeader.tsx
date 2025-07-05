
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
      "p-4 shadow-lg relative pt-safe",
      isDarkMode ? "bg-gray-900" : "bg-gray-100"
    )}>
      <div className="flex justify-between items-center">
        <button
          onClick={onLoginClick}
          className={cn(
            "flex items-center space-x-2 p-2 rounded-lg transition-colors",
            isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
          )}
        >
          <User size={20} />
        </button>
        <div className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
          <AppLogo size={28} />
          <h1 className={cn("text-xl font-bold", getTitleColor())}>
            {APP_CONFIG.name}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDonateClick}
            className="p-2 rounded-lg transition-all duration-200 text-green-500 hover:text-green-400 hover:bg-green-500/10 hover:scale-110"
            title="Support the project"
          >
            <DollarSign size={20} />
          </button>
          <button
            onClick={onSettingsClick}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-300 text-gray-600"
            )}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
