
import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SettingsContext } from '@/pages/Index';
import { PlateInfo } from './plate-calculator/types';
import { getPlateColor } from './plate-calculator/utils';

interface PlateCalculatorSettingsProps {
  availablePlates: PlateInfo[];
  setAvailablePlates: (plates: PlateInfo[]) => void;
  barWeight: number;
  setBarWeight: (weight: number) => void;
  onBack: () => void;
}

const PlateCalculatorSettings: React.FC<PlateCalculatorSettingsProps> = ({
  availablePlates,
  setAvailablePlates,
  barWeight,
  setBarWeight,
  onBack
}) => {
  const { isDarkMode, isKg } = useContext(SettingsContext);
  const [customBarWeight, setCustomBarWeight] = useState('');

  const addCustomBar = () => {
    const weight = parseFloat(customBarWeight);
    if (weight > 0) {
      setBarWeight(weight);
      setCustomBarWeight('');
    }
  };

  const resetToDefault = () => {
    setBarWeight(isKg ? 20 : 45);
  };

  const resetPlates = () => {
    const defaultPlates = isKg 
      ? [25, 20, 15, 10, 5, 2.5, 1.25].map(weight => ({
          weight,
          count: 0,
          available: 10,
          color: getPlateColor(weight, true)
        }))
      : [55, 45, 35, 25, 10, 5, 2.5].map(weight => ({
          weight,
          count: 0,
          available: 10,
          color: getPlateColor(weight, false)
        }));
    
    setAvailablePlates(defaultPlates);
  };

  return (
    <div className={cn(
      "p-4 space-y-6 min-h-full",
      isDarkMode ? "bg-black" : "bg-white"
    )}>
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-2xl font-bold text-orange-400">Plate Calculator Settings</h2>
      </div>

      {/* Bar Settings */}
      <Card className={cn(
        "border-orange-800",
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      )}>
        <CardHeader>
          <CardTitle className="text-orange-400">Bar Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={cn(isDarkMode ? "text-white" : "text-black")}>
              Current Bar Weight: {barWeight} {isKg ? 'kg' : 'lbs'}
            </span>
            <Button
              onClick={resetToDefault}
              size="sm"
              variant="outline"
              className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
            >
              Reset to Default
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Input
              type="number"
              value={customBarWeight}
              onChange={(e) => setCustomBarWeight(e.target.value)}
              placeholder={`Custom bar weight (${isKg ? 'kg' : 'lbs'})`}
              className={cn(
                "border-gray-700",
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              )}
            />
            <Button
              onClick={addCustomBar}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
            >
              Set Custom Bar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plate Settings */}
      <Card className={cn(
        "border-orange-800",
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      )}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-orange-400">Plate Inventory</CardTitle>
            <Button
              onClick={resetPlates}
              size="sm"
              variant="outline"
              className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
            >
              Reset All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {availablePlates.map((plate, index) => (
            <div key={plate.weight} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn("w-4 h-4 rounded-sm", plate.color)}></div>
                <span className={cn(isDarkMode ? "text-white" : "text-black")}>
                  {plate.weight} {isKg ? 'kg' : 'lbs'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                  Available:
                </span>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={plate.available}
                  onChange={(e) => {
                    const newPlates = [...availablePlates];
                    newPlates[index].available = parseInt(e.target.value) || 0;
                    setAvailablePlates(newPlates);
                  }}
                  className={cn(
                    "w-20 border-gray-700",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlateCalculatorSettings;
