
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlateInfo } from './types';

interface ReverseCalculatorProps {
  barWeight: number;
  availablePlates: PlateInfo[];
  loadedPlates: { [key: number]: number };
  addPlateToReverse: (plateWeight: number) => void;
  removePlateFromReverse: (plateWeight: number) => void;
  emptyBar: () => void;
  reverseResult: string;
  isDarkMode: boolean;
  isKg: boolean;
}

const ReverseCalculator: React.FC<ReverseCalculatorProps> = ({
  barWeight,
  availablePlates,
  loadedPlates,
  addPlateToReverse,
  removePlateFromReverse,
  emptyBar,
  reverseResult,
  isDarkMode,
  isKg
}) => {
  return (
    <Card className={cn(
      "border-orange-800",
      isDarkMode ? "bg-gray-900" : "bg-gray-100"
    )}>
      <CardHeader>
        <CardTitle className="text-orange-400">Reverse Calculator</CardTitle>
        <p className={cn(isDarkMode ? "text-gray-400" : "text-gray-600")}>
          Tap plates to add them to both sides
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
            Bar Weight: {barWeight} {isKg ? 'kg' : 'lbs'}
          </Label>
        </div>
        
        <div className="space-y-4">
          <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
            Available Plates:
          </Label>
          <div className="grid grid-cols-4 gap-3">
            {availablePlates.map((plate) => (
              <div key={plate.weight} className="flex flex-col items-center space-y-2">
                <button
                  onClick={() => addPlateToReverse(plate.weight)}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold transition-transform hover:scale-105",
                    plate.color,
                    plate.weight === 2.5 || plate.weight === 1.25 ? "text-white" : "text-black"
                  )}
                >
                  {plate.weight}
                </button>
                <span className={cn(
                  "text-xs",
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                )}>
                  {loadedPlates[plate.weight] || 0}
                </span>
                {loadedPlates[plate.weight] > 0 && (
                  <button
                    onClick={() => removePlateFromReverse(plate.weight)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <Button
          onClick={emptyBar}
          variant="outline"
          className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white w-full"
        >
          Empty Bar
        </Button>
        
        <div className={cn(
          "p-4 rounded text-center font-bold text-xl",
          isDarkMode ? "bg-gray-800 text-orange-400" : "bg-gray-200 text-orange-600"
        )}>
          Total Weight: {reverseResult}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReverseCalculator;
