
import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SettingsContext } from '@/pages/Index';
import { PlateInfo } from './plate-calculator/types';
import { getPlateColor } from './plate-calculator/utils';

interface BarInfo {
  weight: number;
  label: string;
}

interface PlateCalculatorSettingsProps {
  availablePlates: PlateInfo[];
  setAvailablePlates: (plates: PlateInfo[]) => void;
  availableBars: BarInfo[];
  setAvailableBars: (bars: BarInfo[]) => void;
  barWeight: number;
  setBarWeight: (weight: number) => void;
  onBack: () => void;
}

const PlateCalculatorSettings: React.FC<PlateCalculatorSettingsProps> = ({
  availablePlates,
  setAvailablePlates,
  availableBars,
  setAvailableBars,
  barWeight,
  setBarWeight,
  onBack
}) => {
  const { isDarkMode, isKg } = useContext(SettingsContext);
  const [customBarWeight, setCustomBarWeight] = useState('');
  const [customBarLabel, setCustomBarLabel] = useState('');
  const [customPlateWeight, setCustomPlateWeight] = useState('');

  const addCustomBar = () => {
    const weight = parseFloat(customBarWeight);
    const label = customBarLabel.trim();
    if (weight > 0 && label && !availableBars.some(bar => bar.weight === weight)) {
      setAvailableBars([...availableBars, { weight, label }].sort((a, b) => a.weight - b.weight));
      setCustomBarWeight('');
      setCustomBarLabel('');
    }
  };

  const removeBar = (weight: number) => {
    setAvailableBars(availableBars.filter(bar => bar.weight !== weight));
    if (barWeight === weight) {
      const remaining = availableBars.filter(bar => bar.weight !== weight);
      if (remaining.length > 0) {
        setBarWeight(remaining[0].weight);
      }
    }
  };

  const addCustomPlate = () => {
    const weight = parseFloat(customPlateWeight);
    if (weight > 0 && !availablePlates.some(plate => plate.weight === weight)) {
      const newPlate = {
        weight,
        count: 0,
        available: 10,
        color: getPlateColor(weight, isKg)
      };
      setAvailablePlates([...availablePlates, newPlate].sort((a, b) => b.weight - a.weight));
      setCustomPlateWeight('');
    }
  };

  const removePlate = (weight: number) => {
    setAvailablePlates(availablePlates.filter(plate => plate.weight !== weight));
  };

  const resetToDefault = () => {
    const defaultBars = isKg 
      ? [
          { weight: 20, label: '20kg Olympic Bar' }, 
          { weight: 15, label: '15kg Women\'s Bar' }
        ]
      : [
          { weight: 45, label: '45lbs Olympic Bar' }, 
          { weight: 35, label: '35lbs Women\'s Bar' }
        ];
    
    setAvailableBars(defaultBars);
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
          <div className="flex justify-between items-center">
            <CardTitle className="text-orange-400">Bar Settings</CardTitle>
            <Button
              onClick={resetToDefault}
              size="sm"
              variant="outline"
              className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
            >
              Reset to Default
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {availableBars.map((bar) => (
              <div key={bar.weight} className="flex items-center justify-between">
                <span className={cn(isDarkMode ? "text-white" : "text-black")}>
                  {bar.label} ({bar.weight} {isKg ? 'kg' : 'lbs'})
                </span>
                <Button
                  onClick={() => removeBar(bar.weight)}
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <Input
              type="number"
              value={customBarWeight}
              onChange={(e) => setCustomBarWeight(e.target.value)}
              placeholder={`Bar weight (${isKg ? 'kg' : 'lbs'})`}
              className={cn(
                "border-gray-700",
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              )}
            />
            <Input
              type="text"
              value={customBarLabel}
              onChange={(e) => setCustomBarLabel(e.target.value)}
              placeholder="Bar name (e.g., Custom Bar)"
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
              <Plus size={16} className="mr-2" />
              Add Custom Bar
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
          <div className="flex space-x-2 mb-4">
            <Input
              type="number"
              value={customPlateWeight}
              onChange={(e) => setCustomPlateWeight(e.target.value)}
              placeholder={`Plate weight (${isKg ? 'kg' : 'lbs'})`}
              className={cn(
                "border-gray-700",
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              )}
            />
            <Button
              onClick={addCustomPlate}
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus size={16} />
            </Button>
          </div>
          
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
                <Button
                  onClick={() => removePlate(plate.weight)}
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlateCalculatorSettings;
