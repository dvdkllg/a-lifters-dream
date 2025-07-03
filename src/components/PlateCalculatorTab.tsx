import React, { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsContext } from '@/pages/Index';
import { cn } from '@/lib/utils';
import { ArrowLeftRight, Minus, Settings, Plus } from 'lucide-react';
import PlateVisualization from './plate-calculator/PlateVisualization';
import PlateManager from './plate-calculator/PlateManager';
import CustomBarSettings from './plate-calculator/CustomBarSettings';
import PlateCalculatorForm from './plate-calculator/PlateCalculatorForm';
import ReverseCalculator from './plate-calculator/ReverseCalculator';
import { PlateInfo, PlateCalculation } from './plate-calculator/types';
import { getPlateColor } from './plate-calculator/utils';

const PlateCalculatorTab = () => {
  const { isDarkMode, isKg } = useContext(SettingsContext);
  const [targetWeight, setTargetWeight] = useState('');
  const [barWeight, setBarWeight] = useState(20); // Default to kg
  const [plates, setPlates] = useState<PlateCalculation[]>([]);
  const [isReverse, setIsReverse] = useState(false);
  const [loadedPlates, setLoadedPlates] = useState<{ [key: number]: number }>({});
  const [reverseResult, setReverseResult] = useState('');
  const [availablePlates, setAvailablePlates] = useState<PlateInfo[]>(
    [25, 20, 15, 10, 5, 2.5, 1.25].map(weight => ({
      weight,
      count: 0,
      available: 10,
      color: getPlateColor(weight, true)
    }))
  );
  const [showPlateManager, setShowPlateManager] = useState(false);
  const [showCustomBar, setShowCustomBar] = useState(false);
  const [customBarWeight, setCustomBarWeight] = useState('');

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
    setReverseResult(`${isKg ? 20 : 45} ${isKg ? 'kg' : 'lbs'}`);
    setPlates([]);
  }, [isKg]);

  // Initialize reverse result on component mount
  useEffect(() => {
    if (reverseResult === '') {
      setReverseResult(`${barWeight} ${isKg ? 'kg' : 'lbs'}`);
    }
  }, [barWeight, isKg, reverseResult]);

  const weightUnit = isKg ? 'kg' : 'lbs';

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
      return sum + (parseFloat(weight) * Number(count));
    }, 0);
    const total = barWeight + (totalPlateWeight * 2);
    setReverseResult(`${total} ${weightUnit}`);
  };

  const emptyBar = () => {
    setLoadedPlates({});
    setReverseResult(`${barWeight} ${weightUnit}`);
  };

  const getTotalWeight = () => {
    const plateWeight = plates.reduce((sum, p) => sum + (p.plate * Number(p.count)), 0);
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
    setLoadedPlates(prev => {
      const newPlates = {
        ...prev,
        [plateWeight]: (prev[plateWeight] || 0) + 1
      };
      
      // Calculate new total immediately
      const totalPlateWeight = Object.entries(newPlates).reduce((sum, [weight, count]) => {
        return sum + (parseFloat(weight) * Number(count));
      }, 0);
      const total = barWeight + (totalPlateWeight * 2);
      setReverseResult(`${total} ${weightUnit}`);
      
      return newPlates;
    });
  };

  const removePlateFromReverse = (plateWeight: number) => {
    setLoadedPlates(prev => {
      const newCount = (prev[plateWeight] || 0) - 1;
      let newPlates;
      if (newCount <= 0) {
        const { [plateWeight]: _, ...rest } = prev;
        newPlates = rest;
      } else {
        newPlates = {
          ...prev,
          [plateWeight]: newCount
        };
      }
      
      // Calculate new total immediately
      const totalPlateWeight = Object.entries(newPlates).reduce((sum, [weight, count]) => {
        return sum + (parseFloat(weight) * Number(count));
      }, 0);
      const total = barWeight + (totalPlateWeight * 2);
      setReverseResult(`${total} ${weightUnit}`);
      
      return newPlates;
    });
  };

  const addCustomBar = () => {
    const weight = parseFloat(customBarWeight);
    if (weight > 0) {
      setBarWeight(weight);
      setCustomBarWeight('');
      setShowCustomBar(false);
    }
  };

  const ReverseVisualization = () => {
    const reversePlates: PlateCalculation[] = Object.entries(loadedPlates).map(([weight, count]) => ({
      plate: parseFloat(weight),
      count: Number(count),
      color: getPlateColor(parseFloat(weight), isKg)
    }));

    return <PlateVisualization plateList={reversePlates} />;
  };

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
    setReverseResult(`${isKg ? 20 : 45} ${isKg ? 'kg' : 'lbs'}`);
    setPlates([]);
  }, [isKg]);

  // Initialize reverse result on component mount
  useEffect(() => {
    if (reverseResult === '') {
      setReverseResult(`${barWeight} ${isKg ? 'kg' : 'lbs'}`);
    }
  }, [barWeight, isKg, reverseResult]);

  const weightUnit = isKg ? 'kg' : 'lbs';

  return (
    <div className={cn(
      "p-4 space-y-6 min-h-full",
      isDarkMode ? "bg-black" : "bg-white"
    )}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-400">Plate Calculator</h2>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowCustomBar(!showCustomBar)}
            size="sm"
            variant="outline"
            className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
          >
            Bar
          </Button>
          <Button
            onClick={() => setShowPlateManager(!showPlateManager)}
            size="sm"
            variant="outline"
            className="border-orange-600 text-orange-400 hover:bg-orange-600 hover:text-white"
          >
            <Settings size={16} />
          </Button>
        </div>
      </div>

      {/* Calculator Mode Toggle Slider */}
      <div className="flex justify-center">
        <div className={cn(
          "relative inline-flex rounded-full p-1 transition-colors",
          isDarkMode ? "bg-gray-800" : "bg-gray-200"
        )}>
          <div
            className={cn(
              "absolute top-1 bottom-1 w-1/2 rounded-full transition-transform duration-200 ease-in-out",
              "bg-orange-400 shadow-sm",
              isReverse ? "translate-x-full" : "translate-x-0"
            )}
          />
          <button
            onClick={() => setIsReverse(false)}
            className={cn(
              "relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors",
              !isReverse 
                ? "text-white" 
                : isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"
            )}
          >
            Weight Calculator
          </button>
          <button
            onClick={() => setIsReverse(true)}
            className={cn(
              "relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors",
              isReverse 
                ? "text-white" 
                : isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"
            )}
          >
            Reverse Calculator
          </button>
        </div>
      </div>

      {/* Always visible bar visualization */}
      <Card className={cn(
        "border-orange-800",
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      )}>
        <CardContent className="p-4">
          {isReverse ? <ReverseVisualization /> : <PlateVisualization plateList={plates} />}
        </CardContent>
      </Card>

      {/* Custom Bar Settings */}
      {showCustomBar && (
        <CustomBarSettings
          customBarWeight={customBarWeight}
          setCustomBarWeight={setCustomBarWeight}
          addCustomBar={addCustomBar}
          isDarkMode={isDarkMode}
          isKg={isKg}
        />
      )}

      {/* Settings Panels */}
      {showPlateManager && (
        <PlateManager
          availablePlates={availablePlates}
          setAvailablePlates={setAvailablePlates}
          isDarkMode={isDarkMode}
          isKg={isKg}
        />
      )}

      {!isReverse ? (
        <>
          <PlateCalculatorForm
            targetWeight={targetWeight}
            setTargetWeight={setTargetWeight}
            barWeight={barWeight}
            setBarWeight={setBarWeight}
            calculatePlates={calculatePlates}
            setPlates={setPlates}
            isDarkMode={isDarkMode}
            isKg={isKg}
          />

          {/* Results */}
          {(plates.length > 0 || targetWeight) && (
            <Card className={cn(
              "border-orange-800",
              isDarkMode ? "bg-gray-900" : "bg-gray-100"
            )}>
              <CardHeader>
                <CardTitle className="text-orange-400">Plates per Side</CardTitle>
                <p className={cn(isDarkMode ? "text-gray-400" : "text-gray-600")}>
                  Total weight: {getTotalWeight()} {isKg ? 'kg' : 'lbs'}
                  {getClosestWeight() && (
                    <span className="text-yellow-500 ml-2">
                      (Closest possible: {getClosestWeight()} {isKg ? 'kg' : 'lbs'})
                    </span>
                  )}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plates.map((plate, index) => (
                    <div key={index} className={cn(
                      "flex justify-between items-center p-3 rounded-lg",
                      isDarkMode ? "bg-gray-800" : "bg-gray-200"
                    )}>
                      <div className="flex items-center space-x-3">
                        <div className={cn("w-4 h-4 rounded-sm", plate.color)}></div>
                        <span className={cn(isDarkMode ? "text-white" : "text-black", "font-semibold")}>
                          {plate.plate} {isKg ? 'kg' : 'lbs'}
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
        <ReverseCalculator
          barWeight={barWeight}
          availablePlates={availablePlates}
          loadedPlates={loadedPlates}
          addPlateToReverse={addPlateToReverse}
          removePlateFromReverse={removePlateFromReverse}
          emptyBar={emptyBar}
          reverseResult={reverseResult}
          isDarkMode={isDarkMode}
          isKg={isKg}
          setBarWeight={setBarWeight}
        />
      )}
    </div>
  );
};

export default PlateCalculatorTab;
