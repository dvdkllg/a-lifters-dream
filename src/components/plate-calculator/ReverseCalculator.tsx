
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
      "border-2 border-orange-200 shadow-lg transition-all duration-300 hover:shadow-xl",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 to-gray-800 border-orange-800" 
        : "bg-gradient-to-br from-orange-50 to-white border-orange-300"
    )}>
      <CardHeader className="pb-4">
        <CardTitle className={cn(
          "text-orange-500 text-xl font-bold tracking-tight",
          isDarkMode ? "text-orange-400" : "text-orange-600"
        )}>
          Reverse Calculator
        </CardTitle>
        <p className={cn(
          "text-sm font-medium",
          isDarkMode ? "text-gray-400" : "text-gray-600"
        )}>
          Tap plates to add them to both sides
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className={cn(
            "text-sm font-semibold",
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>
            Bar Type:
          </Label>
          <Select value={barWeight.toString()} onValueChange={(value) => setBarWeight(Number(value))}>
            <SelectTrigger className={cn(
              "border-2 transition-all duration-200 hover:border-orange-400 focus:border-orange-500 shadow-sm",
              isDarkMode 
                ? "bg-gray-800 text-white border-orange-600 hover:bg-gray-700" 
                : "bg-white text-black border-orange-300 hover:bg-orange-50"
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={cn(
              "z-50 shadow-xl border-2",
              isDarkMode 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-gray-200"
            )}>
              {availableBars.map((bar) => (
                <SelectItem 
                  key={bar.weight} 
                  value={bar.weight.toString()}
                  className={cn(
                    "font-medium transition-colors duration-150",
                    isDarkMode 
                      ? "text-white hover:bg-gray-700" 
                      : "text-black hover:bg-orange-50"
                  )}
                >
                  {bar.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <Label className={cn(
            "text-sm font-semibold",
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>
            Available Plates:
          </Label>
          <div className="grid grid-cols-4 gap-4">
            {availablePlates.map((plate) => (
              <div key={plate.weight} className="flex flex-col items-center space-y-3">
                <button
                  onClick={() => addPlateToReverse(plate.weight)}
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 shadow-md",
                    plate.color,
                    getPlateTextColor(plate.weight)
                  )}
                >
                  {plate.weight}
                </button>
                <div className={cn(
                  "px-2 py-1 rounded-full text-xs font-semibold min-w-[24px] text-center",
                  loadedPlates[plate.weight] > 0 
                    ? cn(
                        isDarkMode ? "bg-orange-600 text-white" : "bg-orange-500 text-white",
                        "shadow-sm"
                      )
                    : cn(
                        isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"
                      )
                )}>
                  {loadedPlates[plate.weight] || 0}
                </div>
                {loadedPlates[plate.weight] > 0 && (
                  <button
                    onClick={() => removePlateFromReverse(plate.weight)}
                    className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors duration-150 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className={cn(
          "p-5 rounded-xl text-center font-bold text-xl shadow-inner border-2 transition-all duration-300",
          isDarkMode 
            ? "bg-gradient-to-r from-gray-800 to-gray-700 text-orange-400 border-gray-600" 
            : "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-orange-200"
        )}>
          <div className="text-sm font-medium opacity-75 mb-1">Total Weight</div>
          {reverseResult}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReverseCalculator;
