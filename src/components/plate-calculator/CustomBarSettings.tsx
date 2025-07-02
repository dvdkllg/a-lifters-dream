
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CustomBarSettingsProps {
  customBarWeight: string;
  setCustomBarWeight: (weight: string) => void;
  addCustomBar: () => void;
  isDarkMode: boolean;
  isKg: boolean;
}

const CustomBarSettings: React.FC<CustomBarSettingsProps> = ({
  customBarWeight,
  setCustomBarWeight,
  addCustomBar,
  isDarkMode,
  isKg
}) => {
  return (
    <Card className={cn(
      "border-orange-800",
      isDarkMode ? "bg-gray-900" : "bg-gray-100"
    )}>
      <CardHeader>
        <CardTitle className="text-orange-400">Custom Bar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            Set
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomBarSettings;
