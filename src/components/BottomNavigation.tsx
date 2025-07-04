
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
      "fixed bottom-0 left-0 right-0 pb-safe",
      isDarkMode ? "bg-gray-900" : "bg-gray-100"
    )}>
      <div className="flex justify-around py-2 px-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-col items-center py-2 px-2 rounded-lg transition-colors text-xs min-w-[60px]",
              activeTab === id 
                ? TAB_THEMES[id].active + " " + TAB_THEMES[id].text
                : "text-gray-400 hover:text-white"
            )}
          >
            <Icon size={18} />
            <span className="mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
