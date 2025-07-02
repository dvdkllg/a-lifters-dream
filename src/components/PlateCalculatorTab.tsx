
import React, { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsContext } from '@/pages/Index';
import { cn } from '@/lib/utils';
import { ArrowLeftRight, Minus, Settings } from 'lucide-react';

interface PlateInfo {
  weight: number;
  count: number;
  available: number;
  color: string;
}

interface PlateCalculation {
  plate: number;
  count: number;
  color: string;
}

const PlateCalculatorTab = () => {
  const { isDarkMode, isKg } = useContext(SettingsContext);
  const [targetWeight, setTargetWeight] = useState('');
  const [barWeight, setBarWeight] = useState(isKg ? 20 : 45);
  const [plates, setPlates] = useState<PlateCalculation[]>([]);
  const [isReverse, setIsReverse] = useState(false);
  const [loadedPlates, setLoadedPlates] = useState<{ [key: number]: number }>({});
  const [reverseResult, setReverseResult] = useState('');
  const [availablePlates, setAvailablePlates] = useState<PlateInfo[]>(
    isKg 
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
        }))
  );
  const [showPlateManager, setShowPlateManager] = useState(false);

  // Update plates and bar weight when unit changes
  useEffect(() => {
    const newPlates = isKg 
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
    
    setAvailablePlates(newPlates);
    setBarWeight(isKg ? 20 : 45);
    setLoadedPlates({});
    setReverseResult('');
    setPlates([]);
  }, [isKg]);

  const weightUnit = isKg ? 'kg' : 'lbs';

  function getPlateColor(weight: number, isKgSystem: boolean): string {
    if (isKgSystem) {
      switch (weight) {
        case 25: return 'bg-red-500';
        case 20: return 'bg-blue-500';
        case 15: return 'bg-yellow-500';
        case 10: return 'bg-green-500';
        case 5: return 'bg-gray-100 border-2 border-gray-400';
        case 2.5: return 'bg-black';
        default: return 'bg-gray-100 border-2 border-gray-400';
      }
    } else {
      switch (weight) {
        case 55: return 'bg-red-500';
        case 45: return 'bg-blue-500';
        case 35: return 'bg-yellow-500';
        case 25: return 'bg-green-500';
        case 10: return 'bg-gray-100 border-2 border-gray-400';
        case 5: return 'bg-gray-100 border-2 border-gray-400';
        case 2.5: return 'bg-black';
        default: return 'bg-gray-100 border-2 border-gray-400';
      }
    }
  }

  const parseWeight = (value: string): number => {
    return parseFloat(value.replace(',', '.')) || 0;
  };

  const calculatePlates = () => {
    const target = parseWeight(targetWeight);
    if (!target || target <= barWeight) {
      setPlates([]);
      return;
    }

    const weightToLoad = (target - barWeight) / 2;
    let remainingWeight = weightToLoad;
    const neededPlates: PlateCalculation[] = [];

    // Use only available plates with available count > 0
    const usablePlates = availablePlates
      .filter(p => p.available > 0)
      .sort((a, b) => b.weight - a.weight);

    for (const plateInfo of usablePlates) {
      const maxCount = Math.min(
        Math.floor(remainingWeight / plateInfo.weight),
        plateInfo.available
      );
      
      if (maxCount > 0) {
        neededPlates.push({ 
          plate: plateInfo.weight, 
          count: maxCount, 
          color: plateInfo.color 
        });
        remainingWeight -= maxCount * plateInfo.weight;
        remainingWeight = Math.round(remainingWeight * 1000) / 1000;
      }
    }

    setPlates(neededPlates);
  };

  const calculateReverse = () => {
    const totalPlateWeight = Object.entries(loadedPlates).reduce((sum, [weight, count]) => {
      return sum + (parseFloat(weight) * count);
    }, 0);
    const total = barWeight + (totalPlateWeight * 2);
    setReverseResult(`${total} ${weightUnit}`);
  };

  const emptyBar = () => {
    setLoadedPlates({});
    setReverseResult(`${barWeight} ${weightUnit}`);
  };

  const getTotalWeight = () => {
    const plateWeight = plates.reduce((sum, p) => sum + (p.plate * p.count), 0);
    return barWeight + (plateWeight * 2);
  };

  const getClosestWeight = () => {
    if (plates.length === 0) return null;
    const actualWeight = getTotalWeight();
    const targetWeightNum = parseWeight(targetWeight);
    if (actualWeight !== targetWeightNum) {
      return actualWeight;
    }
    return null;
  };

  const addPlateToReverse = (plateWeight: number) => {
    setLoadedPlates(prev => ({
      ...prev,
      [plateWeight]: (prev[plateWeight] || 0) + 1
    }));
  };

  const removePlateFromReverse = (plateWeight: number) => {
    setLoadedPlates(prev => {
      const newCount = (prev[plateWeight] || 0) - 1;
      if (newCount <= 0) {
        const { [plateWeight]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [plateWeight]: newCount
      };
    });
  };

  // Auto-calculate reverse when plates change
  useEffect(() => {
    calculateReverse();
  }, [loadedPlates, barWeight]);

  const PlateVisualization = ({ plateList }: { plateList: PlateCalculation[] }) => (
    <div className="flex items-center justify-center my-4 overflow-x-auto">
      <div className="flex items-center space-x-1">
        {/* Left plates */}
        <div className="flex">
          {plateList.map((plate, index) => (
            Array.from({ length: plate.count }).map((_, i) => (
              <div
                key={`left-${index}-${i}`}
                className={cn(
                  "w-4 h-12 rounded-sm mr-0.5 flex items-center justify-center text-xs font-bold",
                  plate.color,
                  plate.plate === 2.5 || plate.plate === 1.25 ? "text-white" : "text-black"
                )}
              >
                {plate.plate}
              </div>
            ))
          ))}
        </div>
        
        {/* Barbell */}
        <div className="w-20 h-2 bg-gray-600 mx-2 rounded"></div>
        
        {/* Right plates */}
        <div className="flex">
          {plateList.map((plate, index) => (
            Array.from({ length: plate.count }).map((_, i) => (
              <div
                key={`right-${index}-${i}`}
                className={cn(
                  "w-4 h-12 rounded-sm ml-0.5 flex items-center justify-center text-xs font-bold",
                  plate.color,
                  plate.plate === 2.5 || plate.plate === 1.25 ? "text-white" : "text-black"
                )}
              >
                {plate.plate}
              </div>
            ))
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn(
      "p-4 space-y-6 min-h-full",
      isDarkMode ? "bg-black" : "bg-white"
    )}>
      <h2 className="text-2xl font-bold text-center text-orange-400">Plate Calculator</h2>
      
      {/* Mode Toggle and Plate Manager */}
      <div className="flex justify-center space-x-2">
        <Button
          onClick={() => setIsReverse(!isReverse)}
          variant="outline"
          className={cn(
            "border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white",
            isDarkMode ? "bg-gray-900" : "bg-white"
          )}
        >
          <ArrowLeftRight size={16} className="mr-2" />
          {isReverse ? 'Weight Calculator' : 'Reverse Calculator'}
        </Button>
        
        <Button
          onClick={() => setShowPlateManager(!showPlateManager)}
          variant="outline"
          className={cn(
            "border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white",
            isDarkMode ? "bg-gray-900" : "bg-white"
          )}
        >
          <Settings size={16} className="mr-2" />
          Manage Plates
        </Button>
      </div>

      {/* Plate Manager */}
      {showPlateManager && (
        <Card className={cn(
          "border-orange-800",
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        )}>
          <CardHeader>
            <CardTitle className="text-orange-400">Manage Available Plates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availablePlates.map((plate, index) => (
              <div key={plate.weight} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn("w-4 h-4 rounded-sm", plate.color)}></div>
                  <span className={cn(isDarkMode ? "text-white" : "text-black")}>
                    {plate.weight} {weightUnit}
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
      )}

      {!isReverse ? (
        <>
          {/* Standard Calculator */}
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
                    Bar Weight ({weightUnit})
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
                    Target Weight ({weightUnit})
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

          {/* Results */}
          {plates.length > 0 && (
            <Card className={cn(
              "border-orange-800",
              isDarkMode ? "bg-gray-900" : "bg-gray-100"
            )}>
              <CardHeader>
                <CardTitle className="text-orange-400">Plates per Side</CardTitle>
                <p className={cn(isDarkMode ? "text-gray-400" : "text-gray-600")}>
                  Total weight: {getTotalWeight()} {weightUnit}
                  {getClosestWeight() && (
                    <span className="text-yellow-500 ml-2">
                      (Closest possible: {getClosestWeight()} {weightUnit})
                    </span>
                  )}
                </p>
              </CardHeader>
              <CardContent>
                <PlateVisualization plateList={plates} />
                
                <div className="space-y-3 mt-4">
                  {plates.map((plate, index) => (
                    <div key={index} className={cn(
                      "flex justify-between items-center p-3 rounded-lg",
                      isDarkMode ? "bg-gray-800" : "bg-gray-200"
                    )}>
                      <div className="flex items-center space-x-3">
                        <div className={cn("w-4 h-4 rounded-sm", plate.color)}></div>
                        <span className={cn(isDarkMode ? "text-white" : "text-black", "font-semibold")}>
                          {plate.plate} {weightUnit}
                        </span>
                      </div>
                      <span className="text-orange-400 font-bold">x{plate.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <>
          {/* Reverse Calculator */}
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
                  Bar Weight: {barWeight} {weightUnit}
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
        </>
      )}
    </div>
  );
};

export default PlateCalculatorTab;
