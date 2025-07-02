
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PlateInfo } from './types';

interface PlateManagerProps {
  availablePlates: PlateInfo[];
  setAvailablePlates: (plates: PlateInfo[]) => void;
  isDarkMode: boolean;
  isKg: boolean;
}

const PlateManager: React.FC<PlateManagerProps> = ({
  availablePlates,
  setAvailablePlates,
  isDarkMode,
  isKg
}) => {
  return (
    <Card className={cn(
      "border-orange-800",
      isDarkMode ? "bg-gray-900" : "bg-gray-100"
    )}>
      <CardHeader>
        <CardTitle className="text-orange-400">Plate Settings</CardTitle>
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
        ))}
      </CardContent>
    </Card>
  );
};

export default PlateManager;
