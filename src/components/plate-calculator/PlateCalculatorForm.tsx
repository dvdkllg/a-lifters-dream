
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calculator } from 'lucide-react';
import { PlateCalculation } from './types';

interface BarInfo {
  weight: number;
  label: string;
}

interface PlateCalculatorFormProps {
  targetWeight: string;
  setTargetWeight: (weight: string) => void;
  barWeight: number;
  setBarWeight: (weight: number) => void;
  availableBars: BarInfo[];
  calculatePlates: () => void;
  setPlates: (plates: PlateCalculation[]) => void;
  isDarkMode: boolean;
  isKg: boolean;
}

const PlateCalculatorForm: React.FC<PlateCalculatorFormProps> = ({
  targetWeight,
  setTargetWeight,
  barWeight,
  setBarWeight,
  availableBars,
  calculatePlates,
  setPlates,
  isDarkMode,
  isKg
}) => {
  const handleTargetWeightChange = (value: string) => {
    setTargetWeight(value);
    if (!value) {
      setPlates([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      calculatePlates();
    }
  };

  return (
    <Card className={cn(
      "border-orange-800",
      isDarkMode ? "bg-gray-900" : "bg-gray-100"
    )}>
      <CardHeader>
        <CardTitle className="text-orange-400">Weight Calculator</CardTitle>
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

        <div className="space-y-2">
          <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
            Target Weight ({isKg ? 'kg' : 'lbs'}):
          </Label>
          <Input
            type="number"
            value={targetWeight}
            onChange={(e) => handleTargetWeightChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Enter target weight in ${isKg ? 'kg' : 'lbs'}`}
            className={cn(
              "border-orange-600",
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            )}
          />
        </div>

        <Button
          onClick={calculatePlates}
          className="w-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center space-x-2"
        >
          <Calculator size={16} />
          <span>Calculate Plates</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlateCalculatorForm;
