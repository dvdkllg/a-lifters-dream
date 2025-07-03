
import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsContext } from '@/pages/Index';
import { cn } from '@/lib/utils';
import { Calculator } from 'lucide-react';

const CalculatorTab = () => {
  const { isDarkMode, isKg } = useContext(SettingsContext);
  const [calculatorType, setCalculatorType] = useState<'1rm' | 'rpe' | 'percentage'>('1rm');
  
  // 1RM Calculator states
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [oneRepMax, setOneRepMax] = useState<number | null>(null);

  // RPE Calculator states
  const [rpeWeight, setRpeWeight] = useState('');
  const [rpeReps, setRpeReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [rpeResult, setRpeResult] = useState<number | null>(null);

  // Percentage Calculator states
  const [maxWeight, setMaxWeight] = useState('');
  const [percentage, setPercentage] = useState('');
  const [percentageResult, setPercentageResult] = useState<number | null>(null);

  const calculate1RM = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    
    if (w > 0 && r > 0 && r <= 12) {
      // Using Brzycki formula: 1RM = Weight × (36 / (37 - Reps))
      const result = w * (36 / (37 - r));
      setOneRepMax(Math.round(result * 10) / 10);
    }
  };

  const calculateRPE = () => {
    const w = parseFloat(rpeWeight);
    const r = parseInt(rpeReps);
    const rpeValue = parseFloat(rpe);
    
    if (w > 0 && r > 0 && rpeValue >= 6 && rpeValue <= 10) {
      // RPE-based 1RM estimation
      const repsInReserve = 10 - rpeValue;
      const totalReps = r + repsInReserve;
      const result = w * (36 / (37 - totalReps));
      setRpeResult(Math.round(result * 10) / 10);
    }
  };

  const calculatePercentage = () => {
    const max = parseFloat(maxWeight);
    const percent = parseFloat(percentage);
    
    if (max > 0 && percent > 0 && percent <= 100) {
      const result = (max * percent) / 100;
      setPercentageResult(Math.round(result * 10) / 10);
    }
  };

  const renderCalculator = () => {
    switch (calculatorType) {
      case '1rm':
        return (
          <Card className={cn(
            "border-blue-800",
            isDarkMode ? "bg-gray-900" : "bg-gray-100"
          )}>
            <CardHeader>
              <CardTitle className="text-blue-400">1 Rep Max Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Weight ({isKg ? 'kg' : 'lbs'}):
                </Label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={`Enter weight in ${isKg ? 'kg' : 'lbs'}`}
                  className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Reps:
                </Label>
                <Select value={reps} onValueChange={setReps}>
                  <SelectTrigger className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}>
                    <SelectValue placeholder="Select reps" />
                  </SelectTrigger>
                  <SelectContent className={cn(
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  )}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((rep) => (
                      <SelectItem key={rep} value={rep.toString()}>
                        {rep}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={calculate1RM}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Calculator size={16} className="mr-2" />
                Calculate 1RM
              </Button>

              {oneRepMax && (
                <div className={cn(
                  "p-4 rounded text-center",
                  isDarkMode ? "bg-gray-800 text-blue-400" : "bg-gray-200 text-blue-600"
                )}>
                  <p className="text-sm font-medium">Estimated 1 Rep Max:</p>
                  <p className="text-2xl font-bold">{oneRepMax} {isKg ? 'kg' : 'lbs'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'rpe':
        return (
          <Card className={cn(
            "border-blue-800",
            isDarkMode ? "bg-gray-900" : "bg-gray-100"
          )}>
            <CardHeader>
              <CardTitle className="text-blue-400">RPE Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Weight ({isKg ? 'kg' : 'lbs'}):
                </Label>
                <Input
                  type="number"
                  value={rpeWeight}
                  onChange={(e) => setRpeWeight(e.target.value)}
                  placeholder={`Enter weight in ${isKg ? 'kg' : 'lbs'}`}
                  className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Reps:
                </Label>
                <Input
                  type="number"
                  value={rpeReps}
                  onChange={(e) => setRpeReps(e.target.value)}
                  placeholder="Enter reps performed"
                  className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  RPE (6-10):
                </Label>
                <Select value={rpe} onValueChange={setRpe}>
                  <SelectTrigger className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}>
                    <SelectValue placeholder="Select RPE" />
                  </SelectTrigger>
                  <SelectContent className={cn(
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  )}>
                    {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((rpeVal) => (
                      <SelectItem key={rpeVal} value={rpeVal.toString()}>
                        {rpeVal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={calculateRPE}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Calculator size={16} className="mr-2" />
                Calculate RPE-based 1RM
              </Button>

              {rpeResult && (
                <div className={cn(
                  "p-4 rounded text-center",
                  isDarkMode ? "bg-gray-800 text-blue-400" : "bg-gray-200 text-blue-600"
                )}>
                  <p className="text-sm font-medium">Estimated 1 Rep Max:</p>
                  <p className="text-2xl font-bold">{rpeResult} {isKg ? 'kg' : 'lbs'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'percentage':
        return (
          <Card className={cn(
            "border-blue-800",
            isDarkMode ? "bg-gray-900" : "bg-gray-100"
          )}>
            <CardHeader>
              <CardTitle className="text-blue-400">Percentage Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  1RM ({isKg ? 'kg' : 'lbs'}):
                </Label>
                <Input
                  type="number"
                  value={maxWeight}
                  onChange={(e) => setMaxWeight(e.target.value)}
                  placeholder={`Enter your 1RM in ${isKg ? 'kg' : 'lbs'}`}
                  className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Percentage (%):
                </Label>
                <Input
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="Enter percentage (e.g., 85)"
                  min="1"
                  max="100"
                  className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}
                />
              </div>

              <Button
                onClick={calculatePercentage}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Calculator size={16} className="mr-2" />
                Calculate Weight
              </Button>

              {percentageResult && (
                <div className={cn(
                  "p-4 rounded text-center",
                  isDarkMode ? "bg-gray-800 text-blue-400" : "bg-gray-200 text-blue-600"
                )}>
                  <p className="text-sm font-medium">{percentage}% of {maxWeight} {isKg ? 'kg' : 'lbs'}:</p>
                  <p className="text-2xl font-bold">{percentageResult} {isKg ? 'kg' : 'lbs'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "p-4 space-y-6 min-h-full",
      isDarkMode ? "bg-black" : "bg-white"
    )}>
      <h2 className="text-2xl font-bold text-center text-blue-400">Calculators</h2>
      
      {/* Calculator Type Toggle Slider */}
      <div className="flex justify-center">
        <div className={cn(
          "relative inline-flex rounded-full p-1 transition-colors",
          isDarkMode ? "bg-gray-800" : "bg-gray-200"
        )}>
          <div
            className={cn(
              "absolute top-1 bottom-1 w-1/3 rounded-full transition-transform duration-200 ease-in-out",
              "bg-blue-400 shadow-sm",
              calculatorType === '1rm' ? "translate-x-0" :
              calculatorType === 'rpe' ? "translate-x-full" : "translate-x-[200%]"
            )}
          />
          <button
            onClick={() => setCalculatorType('1rm')}
            className={cn(
              "relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors",
              calculatorType === '1rm' 
                ? "text-white" 
                : isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"
            )}
          >
            1RM
          </button>
          <button
            onClick={() => setCalculatorType('rpe')}
            className={cn(
              "relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors",
              calculatorType === 'rpe' 
                ? "text-white" 
                : isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"
            )}
          >
            RPE
          </button>
          <button
            onClick={() => setCalculatorType('percentage')}
            className={cn(
              "relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-colors",
              calculatorType === 'percentage' 
                ? "text-white" 
                : isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"
            )}
          >
            Percentage
          </button>
        </div>
      </div>

      {renderCalculator()}
    </div>
  );
};

export default CalculatorTab;
