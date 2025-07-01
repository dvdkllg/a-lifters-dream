
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Supplements, Calculator, Timer, Dumbbell } from 'lucide-react';
import SupplementsTab from '@/components/SupplementsTab';
import CalculatorTab from '@/components/CalculatorTab';
import TimerTab from '@/components/TimerTab';
import WorkoutLogTab from '@/components/WorkoutLogTab';

type TabType = 'supplements' | 'calculator' | 'timer' | 'workoutlog';

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
      case 'workoutlog':
        return <WorkoutLogTab />;
      default:
        return <SupplementsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="bg-slate-800 p-4 shadow-lg">
        <h1 className="text-xl font-bold text-center">Fitness Tracker</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderActiveTab()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-slate-800 border-t border-slate-700">
        <div className="flex justify-around py-2">
          <button
            onClick={() => setActiveTab('supplements')}
            className={cn(
              "flex flex-col items-center py-2 px-4 rounded-lg transition-colors",
              activeTab === 'supplements' 
                ? "bg-blue-600 text-white" 
                : "text-slate-400 hover:text-white"
            )}
          >
            <Supplements size={20} />
            <span className="text-xs mt-1">Supplements</span>
          </button>
          
          <button
            onClick={() => setActiveTab('calculator')}
            className={cn(
              "flex flex-col items-center py-2 px-4 rounded-lg transition-colors",
              activeTab === 'calculator' 
                ? "bg-blue-600 text-white" 
                : "text-slate-400 hover:text-white"
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
                ? "bg-blue-600 text-white" 
                : "text-slate-400 hover:text-white"
            )}
          >
            <Timer size={20} />
            <span className="text-xs mt-1">Rest Timer</span>
          </button>
          
          <button
            onClick={() => setActiveTab('workoutlog')}
            className={cn(
              "flex flex-col items-center py-2 px-4 rounded-lg transition-colors",
              activeTab === 'workoutlog' 
                ? "bg-blue-600 text-white" 
                : "text-slate-400 hover:text-white"
            )}
          >
            <Dumbbell size={20} />
            <span className="text-xs mt-1">Workout Log</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
