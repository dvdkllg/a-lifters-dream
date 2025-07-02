
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Minus } from 'lucide-react';
import { PlateCalculation } from './types';

interface PlateCalculatorFormProps {
  targetWeight: string;
  setTargetWeight: (weight: string) => void;
  barWeight: number;
  setBarWeight: (weight: number) => void;
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
  calculatePlates,
  setPlates,
  isDarkMode,
  isKg
}) => {
  return (
    <Card className={cn(
      "border-orange-800",
      isDarkMode ? "bg-gray-900" : "bg-gray-100"
    )}>
      <CardHeader>
        <CardTitle className="text-orange-400">Calculate Plates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="barWeight" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
              Bar Weight ({isKg ? 'kg' : 'lbs'})
            </Label>
            <Select value={barWeight.toString()} onValueChange={(value) => setBarWeight(parseFloat(value))}>
              <SelectTrigger className={cn(
                "border-gray-700",
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              )}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={cn(
                "border-gray-700",
                isDarkMode ? "bg-gray-800" : "bg-white"
              )}>
                {isKg ? (
                  <>
                    <SelectItem value="20">Olympic Bar (20 kg)</SelectItem>
                    <SelectItem value="15">Women's Bar (15 kg)</SelectItem>
                    <SelectItem value="10">EZ Bar (10 kg)</SelectItem>
                    <SelectItem value="7">Short Bar (7 kg)</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="45">Olympic Bar (45 lbs)</SelectItem>
                    <SelectItem value="35">Women's Bar (35 lbs)</SelectItem>
                    <SelectItem value="25">EZ Bar (25 lbs)</SelectItem>
                    <SelectItem value="15">Short Bar (15 lbs)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="targetWeight" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
              Target Weight ({isKg ? 'kg' : 'lbs'})
            </Label>
            <Input
              id="targetWeight"
              type="text"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className={cn(
                "border-gray-700",
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              )}
              placeholder="Enter total weight"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={calculatePlates}
            className="flex-1 bg-orange-600 hover:bg-orange-700"
          >
            Calculate Plates
          </Button>
          <Button
            onClick={() => {
              setTargetWeight(barWeight.toString());
              setPlates([]);
            }}
            variant="outline"
            className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
          >
            <Minus size={16} className="mr-1" />
            Empty Bar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlateCalculatorForm;
