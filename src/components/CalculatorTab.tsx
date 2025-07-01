import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettingsContext } from '@/pages/Index';
import { cn } from '@/lib/utils';

interface OneRMResult {
  formula: string;
  result: number;
}

const CalculatorTab = () => {
  const { isDarkMode, isKg } = useContext(SettingsContext);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [oneRMResults, setOneRMResults] = useState<OneRMResult[]>([]);
  const [percentageWeight, setPercentageWeight] = useState('');
  const [percentage, setPercentage] = useState('');
  const [percentageResult, setPercentageResult] = useState('');

  const weightUnit = isKg ? 'kg' : 'lbs';

  const calculateOneRM = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    
    if (!w || !r || r < 1) return;

    const results: OneRMResult[] = [];
    
    // Epley Formula
    const epley = w * (1 + r / 30);
    results.push({ formula: 'Epley', result: Math.round(epley * 10) / 10 });
    
    // Brzycki Formula
    const brzycki = w / (1.0278 - 0.0278 * r);
    results.push({ formula: 'Brzycki', result: Math.round(brzycki * 10) / 10 });
    
    // McGlothin Formula
    const mcglothin = (100 * w) / (101.3 - 2.67123 * r);
    results.push({ formula: 'McGlothin', result: Math.round(mcglothin * 10) / 10 });
    
    // Lombardi Formula
    const lombardi = w * Math.pow(r, 0.10);
    results.push({ formula: 'Lombardi', result: Math.round(lombardi * 10) / 10 });

    setOneRMResults(results);
  };

  const calculateRPEWeight = () => {
    const w = parseFloat(weight);
    const r = parseInt(reps);
    const targetRPE = parseFloat(rpe);
    
    if (!w || !r || !targetRPE) return;

    // Calculate 1RM using Epley formula
    const oneRM = w * (1 + r / 30);
    
    // RPE to percentage mapping
    const rpePercentages: { [key: number]: number } = {
      10: 100, 9.5: 97, 9: 93, 8.5: 90, 8: 87, 
      7.5: 83, 7: 80, 6.5: 77, 6: 73, 5.5: 70, 5: 67
    };
    
    const percentage = rpePercentages[targetRPE] || 70;
    const recommendedWeight = (oneRM * percentage) / 100;
    
    setPercentageResult(`${Math.round(recommendedWeight * 10) / 10} ${weightUnit} (${percentage}% of 1RM)`);
  };

  const calculatePercentage = () => {
    const w = parseFloat(percentageWeight);
    const p = parseFloat(percentage);
    
    if (!w || !p) return;
    
    const result = (w * p) / 100;
    setPercentageResult(`${Math.round(result * 10) / 10} ${weightUnit}`);
  };

  return (
    <div className={cn(
      "p-4 space-y-6 min-h-full",
      isDarkMode ? "bg-black" : "bg-white"
    )}>
      <h2 className="text-2xl font-bold text-center text-blue-400">Calculators</h2>
      
      {/* 1RM Calculator */}
      <Card className={cn(
        "border-blue-800",
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      )}>
        <CardHeader>
          <CardTitle className="text-blue-400">1RM Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Weight ({weightUnit})
              </Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={cn(
                  "border-gray-700",
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                )}
                placeholder="225"
              />
            </div>
            <div>
              <Label htmlFor="reps" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Reps
              </Label>
              <Input
                id="reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className={cn(
                  "border-gray-700",
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                )}
                placeholder="5"
              />
            </div>
          </div>
          
          <Button
            onClick={calculateOneRM}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Calculate 1RM
          </Button>
          
          {oneRMResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-400">Results:</h4>
              {oneRMResults.map((result, index) => (
                <div key={index} className={cn(
                  "flex justify-between p-2 rounded",
                  isDarkMode ? "bg-gray-800" : "bg-gray-200"
                )}>
                  <span className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                    {result.formula}:
                  </span>
                  <span className={cn(
                    "font-bold",
                    isDarkMode ? "text-white" : "text-black"
                  )}>
                    {result.result} {weightUnit}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* RPE Calculator */}
      <Card className={cn(
        "border-blue-800",
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      )}>
        <CardHeader>
          <CardTitle className="text-blue-400">RPE Weight Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rpeWeight" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Known Weight ({weightUnit})
              </Label>
              <Input
                id="rpeWeight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className={cn(
                  "border-gray-700",
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                )}
                placeholder="225"
              />
            </div>
            <div>
              <Label htmlFor="rpeReps" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Known Reps
              </Label>
              <Input
                id="rpeReps"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className={cn(
                  "border-gray-700",
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                )}
                placeholder="5"
              />
            </div>
            <div>
              <Label htmlFor="targetRpe" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Target RPE
              </Label>
              <Select value={rpe} onValueChange={setRpe}>
                <SelectTrigger className={cn(
                  "border-gray-700",
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                )}>
                  <SelectValue placeholder="RPE" />
                </SelectTrigger>
                <SelectContent className={cn(
                  "border-gray-700",
                  isDarkMode ? "bg-gray-800" : "bg-white"
                )}>
                  {[10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5].map(rpeValue => (
                    <SelectItem 
                      key={rpeValue} 
                      value={rpeValue.toString()} 
                      className={cn(
                        "hover:bg-gray-700",
                        isDarkMode ? "text-white" : "text-black"
                      )}
                    >
                      RPE {rpeValue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            onClick={calculateRPEWeight}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Calculate RPE Weight
          </Button>
          
          {percentageResult && (
            <div className={cn(
              "p-3 rounded",
              isDarkMode ? "bg-gray-800" : "bg-gray-200"
            )}>
              <span className="text-blue-400 font-semibold">Recommended Weight: </span>
              <span className={cn(isDarkMode ? "text-white" : "text-black")}>
                {percentageResult}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Percentage Calculator */}
      <Card className={cn(
        "border-blue-800",
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      )}>
        <CardHeader>
          <CardTitle className="text-blue-400">Percentage Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="percentageWeight" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Weight ({weightUnit})
              </Label>
              <Input
                id="percentageWeight"
                type="number"
                value={percentageWeight}
                onChange={(e) => setPercentageWeight(e.target.value)}
                className={cn(
                  "border-gray-700",
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                )}
                placeholder="300"
              />
            </div>
            <div>
              <Label htmlFor="percentage" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Percentage (%)
              </Label>
              <Input
                id="percentage"
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className={cn(
                  "border-gray-700",
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                )}
                placeholder="85"
              />
            </div>
          </div>
          
          <Button
            onClick={calculatePercentage}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Calculate
          </Button>
          
          {percentageResult && (
            <div className={cn(
              "p-3 rounded",
              isDarkMode ? "bg-gray-800" : "bg-gray-200"
            )}>
              <span className="text-blue-400 font-semibold">Result: </span>
              <span className={cn(
                "font-bold",
                isDarkMode ? "text-white" : "text-black"
              )}>
                {percentageResult}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculatorTab;
