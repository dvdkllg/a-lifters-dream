
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { PlateInfo } from './types';

interface BarInfo {
  weight: number;
  label: string;
}

interface ReverseCalculatorProps {
  barWeight: number;
  availablePlates: PlateInfo[];
  availableBars: BarInfo[];
  loadedPlates: { [key: number]: number };
  addPlateToReverse: (plateWeight: number) => void;
  removePlateFromReverse: (plateWeight: number) => void;
  reverseResult: string;
  isDarkMode: boolean;
  isKg: boolean;
  setBarWeight: (weight: number) => void;
}

const ReverseCalculator: React.FC<ReverseCalculatorProps> = ({
  barWeight,
  availablePlates,
  availableBars,
  loadedPlates,
  addPlateToReverse,
  removePlateFromReverse,
  reverseResult,
  isDarkMode,
  isKg,
  setBarWeight
}) => {
  const getPlateTextColor = (weight: number) => {
    if (weight === 2.5) return "text-white";
    if (weight === 1.25) return "text-black";
    return "text-black";
  };

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
        <div className="space-y-2">
          <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
            Bar Type:
          </Label>
          <Select value={barWeight.toString()} onValueChange={(value) => setBarWeight(Number(value))}>
            <SelectTrigger className={cn(
              "border-orange-600",
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={cn(
              "z-50",
              isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            )}>
              {availableBars.map((bar) => (
                <SelectItem 
                  key={bar.weight} 
                  value={bar.weight.toString()}
                  className={cn(
                    isDarkMode ? "text-white hover:bg-gray-700" : "text-black hover:bg-gray-100"
                  )}
                >
                  {bar.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                    getPlateTextColor(plate.weight)
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
