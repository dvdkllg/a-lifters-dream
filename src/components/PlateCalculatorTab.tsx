
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlateCalculation {
  plate: number;
  count: number;
}

const PlateCalculatorTab = () => {
  const [targetWeight, setTargetWeight] = useState('');
  const [barWeight, setBarWeight] = useState(45);
  const [plates, setPlates] = useState<PlateCalculation[]>([]);

  const availablePlates = [45, 35, 25, 10, 5, 2.5];

  const calculatePlates = () => {
    const target = parseFloat(targetWeight);
    if (!target || target <= barWeight) {
      setPlates([]);
      return;
    }

    const weightToLoad = (target - barWeight) / 2; // Half for one side
    let remainingWeight = weightToLoad;
    const neededPlates: PlateCalculation[] = [];

    for (const plateWeight of availablePlates) {
      const count = Math.floor(remainingWeight / plateWeight);
      if (count > 0) {
        neededPlates.push({ plate: plateWeight, count });
        remainingWeight -= count * plateWeight;
      }
    }

    setPlates(neededPlates);
  };

  const getTotalWeight = () => {
    const plateWeight = plates.reduce((sum, p) => sum + (p.plate * p.count), 0);
    return barWeight + (plateWeight * 2);
  };

  return (
    <div className="p-4 space-y-6 bg-black min-h-full">
      <h2 className="text-2xl font-bold text-center text-orange-400">Plate Calculator</h2>
      
      {/* Input Section */}
      <Card className="bg-gray-900 border-orange-800">
        <CardHeader>
          <CardTitle className="text-orange-400">Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="barWeight" className="text-gray-300">Bar Weight (lbs)</Label>
            <Input
              id="barWeight"
              type="number"
              value={barWeight}
              onChange={(e) => setBarWeight(parseFloat(e.target.value) || 45)}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="targetWeight" className="text-gray-300">Target Weight (lbs)</Label>
            <Input
              id="targetWeight"
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
              placeholder="Enter total weight"
            />
          </div>
          
          <Button
            onClick={calculatePlates}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Calculate Plates
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {plates.length > 0 && (
        <Card className="bg-gray-900 border-orange-800">
          <CardHeader>
            <CardTitle className="text-orange-400">Plates per Side</CardTitle>
            <p className="text-gray-400">Total weight: {getTotalWeight()} lbs</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plates.map((plate, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                  <span className="text-white font-semibold">{plate.plate} lbs</span>
                  <span className="text-orange-400 font-bold">x{plate.count}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-400">
                Load plates from heaviest to lightest on each side of the bar
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {targetWeight && plates.length === 0 && parseFloat(targetWeight) > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <p className="text-gray-400 text-center">
              {parseFloat(targetWeight) <= barWeight 
                ? "Target weight must be greater than bar weight" 
                : "No calculation available"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlateCalculatorTab;
