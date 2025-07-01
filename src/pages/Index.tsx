
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Pill, Calculator, Timer, Weight } from 'lucide-react';
import SupplementsTab from '@/components/SupplementsTab';
import CalculatorTab from '@/components/CalculatorTab';
import TimerTab from '@/components/TimerTab';
import PlateCalculatorTab from '@/components/PlateCalculatorTab';

type TabType = 'supplements' | 'calculator' | 'timer' | 'platecalculator';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('supplements');

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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 p-4 shadow-lg border-b border-purple-900">
        <h1 className="text-xl font-bold text-center text-purple-400">A Lifter's Dream</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderActiveTab()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gray-900 border-t border-purple-900">
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
    </div>
  );
};

export default Index;
