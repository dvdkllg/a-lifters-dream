
import React from 'react';
import { cn } from '@/lib/utils';
import { PlateCalculation } from './types';

interface PlateVisualizationProps {
  plateList: PlateCalculation[];
}

const PlateVisualization: React.FC<PlateVisualizationProps> = ({ plateList }) => {
  // Sort plates by weight (heaviest first for inside placement)
  const sortedPlates = [...plateList].sort((a, b) => b.plate - a.plate);
  
  const getPlateWidth = (weight: number) => {
    if (weight >= 20 || weight >= 45) return 'w-4';
    if (weight >= 10 || weight >= 25) return 'w-3';
    if (weight >= 5 || weight >= 10) return 'w-2';
    return 'w-1.5';
  };

  const getPlateHeight = (weight: number) => {
    if (weight >= 20 || weight >= 45) return 'h-16';
    if (weight >= 10 || weight >= 25) return 'h-14';
    if (weight >= 5 || weight >= 10) return 'h-12';
    return 'h-10';
  };
  
  return (
    <div className="flex items-center justify-center my-6 overflow-x-auto">
      <div className="flex items-center space-x-0.5 min-w-0">
        {/* Left plates - heaviest inside */}
        <div className="flex">
          {sortedPlates.map((plate, plateIndex) => (
            Array.from({ length: Number(plate.count) }).map((_, i) => (
              <div
                key={`left-${plateIndex}-${i}`}
                className={cn(
                  "rounded-sm flex items-center justify-center text-xs font-bold flex-shrink-0 -ml-0.5 first:ml-0",
                  getPlateWidth(plate.plate),
                  getPlateHeight(plate.plate),
                  plate.color,
                  plate.plate === 2.5 || plate.plate === 1.25 ? "text-white" : "text-black"
                )}
                style={{ 
                  zIndex: 100 - plateIndex - i,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span className="transform -rotate-90 text-xs font-bold">
                  {plate.plate}
                </span>
              </div>
            ))
          ))}
        </div>
        
        {/* Left collar */}
        <div className="w-2 h-6 bg-gray-400 rounded-sm mx-1 flex-shrink-0"></div>
        
        {/* Barbell with simplified realistic design */}
        <div className="flex items-center flex-shrink-0">
          {/* Main bar */}
          <div className="w-32 h-4 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 relative border-t border-b border-gray-600 rounded-sm">
            <div className="absolute top-0.5 left-0 right-0 h-0.5 bg-gray-200 opacity-50 rounded-sm"></div>
            <div className="absolute bottom-0.5 left-0 right-0 h-0.5 bg-gray-600 opacity-50 rounded-sm"></div>
          </div>
        </div>
        
        {/* Right collar */}
        <div className="w-2 h-6 bg-gray-400 rounded-sm mx-1 flex-shrink-0"></div>
        
        {/* Right plates - heaviest inside */}
        <div className="flex">
          {sortedPlates.map((plate, plateIndex) => (
            Array.from({ length: Number(plate.count) }).map((_, i) => (
              <div
                key={`right-${plateIndex}-${i}`}
                className={cn(
                  "rounded-sm flex items-center justify-center text-xs font-bold flex-shrink-0 -mr-0.5 last:mr-0",
                  getPlateWidth(plate.plate),
                  getPlateHeight(plate.plate),
                  plate.color,
                  plate.plate === 2.5 || plate.plate === 1.25 ? "text-white" : "text-black"
                )}
                style={{ 
                  zIndex: 100 - plateIndex - i,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span className="transform rotate-90 text-xs font-bold">
                  {plate.plate}
                </span>
              </div>
            ))
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlateVisualization;
