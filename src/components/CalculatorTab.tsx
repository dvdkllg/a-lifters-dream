
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
  
  // 1RM Calculator states (now includes RPE)
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [oneRepMax, setOneRepMax] = useState<number | null>(null);

  // RPE Calculator states (1RM + target reps/rpe → weight)
  const [knownOneRM, setKnownOneRM] = useState('');
  const [targetReps, setTargetReps] = useState('');
  const [targetRPE, setTargetRPE] = useState('');
  const [recommendedWeight, setRecommendedWeight] = useState<number | null>(null);

  // Percentage Calculator states (with optional reps/rpe)
  const [maxWeight, setMaxWeight] = useState('');
  const [percentage, setPercentage] = useState('');
  const [optionalReps, setOptionalReps] = useState('');
  const [optionalRPE, setOptionalRPE] = useState('');
  const [percentageResult, setPercentageResult] = useState<number | null>(null);

  // RPE to RIR conversion
  const rpeToRir = (rpe: number): number => {
    return Math.max(0, 10 - rpe);
  };

  // Advanced 1RM calculation using RPE
  const calculate1RM = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    const rpeValue = parseFloat(rpe);
    
    if (w > 0 && r > 0 && r <= 20) {
      let result: number;
      
      if (rpeValue && rpeValue >= 5 && rpeValue <= 10) {
        // RPE-based calculation
        const rir = rpeToRir(rpeValue);
        const totalReps = r + rir;
        // Using modified Epley formula with RPE adjustment
        result = w * (1 + totalReps / 30);
      } else {
        // Standard Epley formula
        result = w * (1 + r / 30);
      }
      
      setOneRepMax(Math.round(result * 10) / 10);
    }
  };

  // RPE-based weight calculation
  const calculateRPEWeight = () => {
    const oneRM = parseFloat(knownOneRM);
    const targetR = parseInt(targetReps);
    const targetRPEValue = parseFloat(targetRPE);
    
    if (oneRM > 0 && targetR > 0 && targetRPEValue >= 5 && targetRPEValue <= 10) {
      const rir = rpeToRir(targetRPEValue);
      const totalReps = targetR + rir;
      
      // Calculate weight based on RPE and target reps
      const weight = oneRM / (1 + totalReps / 30);
      setRecommendedWeight(Math.round(weight * 10) / 10);
    }
  };

  // Enhanced percentage calculator
  const calculatePercentage = () => {
    const max = parseFloat(maxWeight);
    const percent = parseFloat(percentage);
    
    if (max > 0 && percent > 0 && percent <= 100) {
      let baseWeight = (max * percent) / 100;
      
      // Adjust based on optional reps and RPE
      if (optionalReps && optionalRPE) {
        const r = parseInt(optionalReps);
        const rpeValue = parseFloat(optionalRPE);
        
        if (r > 0 && rpeValue >= 5 && rpeValue <= 10) {
          const rir = rpeToRir(rpeValue);
          const totalReps = r + rir;
          
          // Calculate what percentage should actually be used for the given reps/RPE
          const adjustedMax = max / (1 + totalReps / 30);
          baseWeight = adjustedMax * (percent / 100);
        }
      }
      
      setPercentageResult(Math.round(baseWeight * 10) / 10);
    }
  };

  const renderCalculator = () => {
    switch (calculatorType) {
      case '1rm':
        return (
          <Card className={cn(
            "border-blue-800",
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          )}>
            <CardHeader>
              <CardTitle className={cn("text-blue-600", isDarkMode && "text-blue-400")}>
                1 Rep Max Calculator
              </CardTitle>
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
                <Input
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="Enter reps performed"
                  min="1"
                  max="20"
                  className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  RPE (Optional, 5-10):
                </Label>
                <Select value={rpe} onValueChange={setRpe}>
                  <SelectTrigger className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}>
                    <SelectValue placeholder="Select RPE (optional)" />
                  </SelectTrigger>
                  <SelectContent className={cn(
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  )}>
                    <SelectItem value="">None</SelectItem>
                    {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((rpeVal) => (
                      <SelectItem key={rpeVal} value={rpeVal.toString()}>
                        {rpeVal}
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
                  isDarkMode ? "bg-gray-800 text-blue-400" : "bg-blue-50 text-blue-600"
                )}>
                  <p className="text-sm font-medium">
                    Estimated 1 Rep Max {rpe ? '(RPE-Enhanced)' : '(Epley Formula)'}:
                  </p>
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
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          )}>
            <CardHeader>
              <CardTitle className={cn("text-blue-600", isDarkMode && "text-blue-400")}>
                RPE Weight Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Known 1RM ({isKg ? 'kg' : 'lbs'}):
                </Label>
                <Input
                  type="number"
                  value={knownOneRM}
                  onChange={(e) => setKnownOneRM(e.target.value)}
                  placeholder={`Enter your 1RM in ${isKg ? 'kg' : 'lbs'}`}
                  className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Target Reps:
                </Label>
                <Input
                  type="number"
                  value={targetReps}
                  onChange={(e) => setTargetReps(e.target.value)}
                  placeholder="How many reps do you want to do?"
                  min="1"
                  max="20"
                  className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Target RPE (5-10):
                </Label>
                <Select value={targetRPE} onValueChange={setTargetRPE}>
                  <SelectTrigger className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}>
                    <SelectValue placeholder="Select target RPE" />
                  </SelectTrigger>
                  <SelectContent className={cn(
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  )}>
                    {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((rpeVal) => (
                      <SelectItem key={rpeVal} value={rpeVal.toString()}>
                        {rpeVal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={calculateRPEWeight}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Calculator size={16} className="mr-2" />
                Calculate Weight
              </Button>

              {recommendedWeight && (
                <div className={cn(
                  "p-4 rounded text-center",
                  isDarkMode ? "bg-gray-800 text-blue-400" : "bg-blue-50 text-blue-600"
                )}>
                  <p className="text-sm font-medium">
                    Recommended Weight for {targetReps} reps at RPE {targetRPE}:
                  </p>
                  <p className="text-2xl font-bold">{recommendedWeight} {isKg ? 'kg' : 'lbs'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'percentage':
        return (
          <Card className={cn(
            "border-blue-800",
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          )}>
            <CardHeader>
              <CardTitle className={cn("text-blue-600", isDarkMode && "text-blue-400")}>
                Percentage Calculator
              </CardTitle>
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
                  step="0.1"
                  className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Target Reps (Optional):
                </Label>
                <Input
                  type="number"
                  value={optionalReps}
                  onChange={(e) => setOptionalReps(e.target.value)}
                  placeholder="Enter target reps (optional)"
                  min="1"
                  max="20"
                  className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Target RPE (Optional):
                </Label>
                <Select value={optionalRPE} onValueChange={setOptionalRPE}>
                  <SelectTrigger className={cn(
                    "border-blue-600",
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                  )}>
                    <SelectValue placeholder="Select RPE (optional)" />
                  </SelectTrigger>
                  <SelectContent className={cn(
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  )}>
                    <SelectItem value="">None</SelectItem>
                    {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((rpeVal) => (
                      <SelectItem key={rpeVal} value={rpeVal.toString()}>
                        {rpeVal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  isDarkMode ? "bg-gray-800 text-blue-400" : "bg-blue-50 text-blue-600"
                )}>
                  <p className="text-sm font-medium">
                    {percentage}% of {maxWeight} {isKg ? 'kg' : 'lbs'}
                    {optionalReps && optionalRPE ? ` (adjusted for ${optionalReps} reps @ RPE ${optionalRPE})` : ''}:
                  </p>
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
      "p-4 space-y-6 min-h-full pb-safe",
      isDarkMode ? "bg-black" : "bg-white"
    )}>
      <h2 className={cn("text-2xl font-bold text-center", isDarkMode ? "text-blue-400" : "text-blue-600")}>
        Calculators
      </h2>
      
      {/* Calculator Type Slider */}
      <div className="flex justify-center px-4">
        <div className={cn(
          "relative inline-flex rounded-xl p-1 transition-all duration-300 shadow-lg",
          isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-100 border border-gray-300"
        )}>
          <div
            className={cn(
              "absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-out shadow-md",
              "bg-gradient-to-r from-blue-500 to-blue-600",
              calculatorType === '1rm' ? "left-1 w-[calc(33.333%-0.125rem)]" :
              calculatorType === 'rpe' ? "left-[33.333%] w-[calc(33.333%-0.125rem)]" : 
              "left-[66.666%] w-[calc(33.333%-0.125rem)]"
            )}
          />
          <button
            onClick={() => setCalculatorType('1rm')}
            className={cn(
              "relative z-10 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 min-w-[80px]",
              calculatorType === '1rm' 
                ? "text-white shadow-sm" 
                : isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"
            )}
          >
            1RM
          </button>
          <button
            onClick={() => setCalculatorType('rpe')}
            className={cn(
              "relative z-10 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 min-w-[80px]",
              calculatorType === 'rpe' 
                ? "text-white shadow-sm" 
                : isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"
            )}
          >
            RPE
          </button>
          <button
            onClick={() => setCalculatorType('percentage')}
            className={cn(
              "relative z-10 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 min-w-[80px]",
              calculatorType === 'percentage' 
                ? "text-white shadow-sm" 
                : isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-800"
            )}
          >
            %
          </button>
        </div>
      </div>

      {renderCalculator()}
    </div>
  );
};

export default CalculatorTab;
