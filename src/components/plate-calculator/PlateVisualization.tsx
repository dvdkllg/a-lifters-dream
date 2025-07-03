
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
    if (weight >= 5 || weight >= 10) return 'w-2.5';
    return 'w-2';
  };

  const getPlateHeight = (weight: number) => {
    if (weight >= 20 || weight >= 45) return 'h-16'; // Largest plates
    if (weight >= 15 || weight >= 35) return 'h-12'; // Medium-large plates
    if (weight >= 10 || weight >= 25) return 'h-10'; // Medium plates
    if (weight >= 5 || weight >= 10) return 'h-8';   // Small plates
    return 'h-6'; // Smallest plates
  };
  
  return (
    <div className="flex items-center justify-center my-6 overflow-x-auto">
      <div className="flex items-center space-x-0.5 min-w-0">
        {/* Left plates - heaviest inside (reverse order for left side) */}
        <div className="flex items-center">
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
          )).reverse()}
        </div>
        
        {/* Left sleeve/collar */}
        <div className="w-3 h-8 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 rounded-sm mx-1 flex-shrink-0 border border-gray-600"></div>
        
        {/* Main barbell */}
        <div className="flex items-center flex-shrink-0">
          <div className="w-32 h-6 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 relative border-t border-b border-gray-600 rounded-sm">
            <div className="absolute top-1 left-0 right-0 h-0.5 bg-gray-200 opacity-50 rounded-sm"></div>
            <div className="absolute bottom-1 left-0 right-0 h-0.5 bg-gray-600 opacity-50 rounded-sm"></div>
          </div>
        </div>
        
        {/* Right sleeve/collar */}
        <div className="w-3 h-8 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 rounded-sm mx-1 flex-shrink-0 border border-gray-600"></div>
        
        {/* Right plates - heaviest inside (normal order) */}
        <div className="flex items-center">
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
