
import React from 'react';
import { cn } from '@/lib/utils';
import { Pill, Calculator, Timer, Weight, Scale } from 'lucide-react';
import { TAB_THEMES } from '@/constants/app';

type TabType = 'supplements' | 'calculator' | 'timer' | 'platecalculator' | 'unitconverter';

interface BottomNavigationProps {
  isDarkMode: boolean;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  isDarkMode,
  activeTab,
  onTabChange
}) => {
  const navItems = [
    { id: 'supplements' as TabType, icon: Pill, label: 'Supplements' },
    { id: 'calculator' as TabType, icon: Calculator, label: 'Calculator' },
    { id: 'timer' as TabType, icon: Timer, label: 'Rest Timer' },
    { id: 'platecalculator' as TabType, icon: Weight, label: 'Plates' },
    { id: 'unitconverter' as TabType, icon: Scale, label: 'Converter' }
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 pb-safe backdrop-blur-md border-t",
      isDarkMode 
        ? "bg-gray-900/90 border-gray-800" 
        : "bg-white/90 border-gray-200"
    )}>
      <div className="flex justify-around py-3 px-4">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 text-xs min-w-[64px] group",
              activeTab === id 
                ? cn(
                    TAB_THEMES[id].active,
                    TAB_THEMES[id].text,
                    "shadow-md transform scale-105"
                  )
                : cn(
                    "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 hover:scale-105",
                    isDarkMode && "hover:text-gray-300 hover:bg-gray-800/50"
                  )
            )}
          >
            <Icon 
              size={20} 
              className={cn(
                "transition-transform duration-200",
                activeTab === id && "drop-shadow-sm"
              )} 
            />
            <span className={cn(
              "mt-1 font-medium transition-all duration-200",
              activeTab === id && "text-shadow"
            )}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
