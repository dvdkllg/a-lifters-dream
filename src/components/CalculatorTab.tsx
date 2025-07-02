
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
  
  // RPE Calculator states
  const [oneRM, setOneRM] = useState('');
  const [targetReps, setTargetReps] = useState('');
  const [targetRPE, setTargetRPE] = useState('');
  const [rpeResult, setRpeResult] = useState('');

  const weightUnit = isKg ? 'kg' : 'lbs';

  const parseWeight = (value: string): number => {
    return parseFloat(value.replace(',', '.')) || 0;
  };

  const calculateOneRM = () => {
    const w = parseWeight(weight);
    const r = parseInt(reps);
    const rpeValue = parseFloat(rpe.replace(',', '.'));
    
    if (!w || !r || r < 1) return;

    const results: OneRMResult[] = [];
    
    // RPE to percentage mapping (scientifically accurate)
    const rpePercentages: { [key: number]: number } = {
      10: 100, 9.5: 97, 9: 93, 8.5: 90, 8: 87, 
      7.5: 83, 7: 80, 6.5: 77, 6: 73, 5.5: 70, 5: 67
    };
    
    // Adjust weight based on RPE if provided
    let adjustedWeight = w;
    if (rpeValue && rpePercentages[rpeValue]) {
      const percentage = rpePercentages[rpeValue];
      // Convert RPE weight to what it would be at 100% effort
      adjustedWeight = w / (percentage / 100);
    }
    
    // Epley Formula: 1RM = weight × (1 + reps/30)
    const epley = adjustedWeight * (1 + r / 30);
    results.push({ formula: 'Epley', result: Math.round(epley * 10) / 10 });
    
    // Brzycki Formula: 1RM = weight / (1.0278 - 0.0278 × reps)
    const brzycki = adjustedWeight / (1.0278 - 0.0278 * r);
    results.push({ formula: 'Brzycki', result: Math.round(brzycki * 10) / 10 });
    
    // McGlothin Formula: 1RM = (100 × weight) / (101.3 - 2.67123 × reps)
    const mcglothin = (100 * adjustedWeight) / (101.3 - 2.67123 * r);
    results.push({ formula: 'McGlothin', result: Math.round(mcglothin * 10) / 10 });
    
    // Lombardi Formula: 1RM = weight × reps^0.10
    const lombardi = adjustedWeight * Math.pow(r, 0.10);
    results.push({ formula: 'Lombardi', result: Math.round(lombardi * 10) / 10 });

    setOneRMResults(results);
  };

  const calculateRPEWeight = () => {
    const oneRMValue = parseWeight(oneRM);
    const repsValue = parseInt(targetReps);
    const rpeValue = parseFloat(targetRPE.replace(',', '.'));
    
    if (!oneRMValue || !repsValue || !rpeValue) return;

    // RPE to percentage mapping
    const rpePercentages: { [key: number]: number } = {
      10: 100, 9.5: 97, 9: 93, 8.5: 90, 8: 87, 
      7.5: 83, 7: 80, 6.5: 77, 6: 73, 5.5: 70, 5: 67
    };
    
    const rpePercentage = rpePercentages[rpeValue] || 70;
    
    // Calculate theoretical max for the rep range using Epley formula
    const theoreticalMax = oneRMValue / (1 + repsValue / 30);
    
    // Apply RPE percentage to get working weight
    const recommendedWeight = theoreticalMax * (rpePercentage / 100);
    
    setRpeResult(`${Math.round(recommendedWeight * 10) / 10} ${weightUnit}`);
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
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="weight" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Weight ({weightUnit})
              </Label>
              <Input
                id="weight"
                type="text"
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
            <div>
              <Label htmlFor="rpe" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                RPE (Optional)
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

      {/* RPE Weight Calculator */}
      <Card className={cn(
        "border-blue-800",
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      )}>
        <CardHeader>
          <CardTitle className="text-blue-400">RPE Weight Calculator</CardTitle>
          <p className={cn(isDarkMode ? "text-gray-400" : "text-gray-600", "text-sm")}>
            Calculate working weight based on your 1RM, target reps, and desired RPE
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="oneRM" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                1RM ({weightUnit})
              </Label>
              <Input
                id="oneRM"
                type="text"
                value={oneRM}
                onChange={(e) => setOneRM(e.target.value)}
                className={cn(
                  "border-gray-700",
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                )}
                placeholder="300"
              />
            </div>
            <div>
              <Label htmlFor="targetReps" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Target Reps
              </Label>
              <Input
                id="targetReps"
                type="number"
                value={targetReps}
                onChange={(e) => setTargetReps(e.target.value)}
                className={cn(
                  "border-gray-700",
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                )}
                placeholder="5"
              />
            </div>
            <div>
              <Label htmlFor="targetRPE" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Target RPE
              </Label>
              <Select value={targetRPE} onValueChange={setTargetRPE}>
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
            Calculate Weight
          </Button>
          
          {rpeResult && (
            <div className={cn(
              "p-3 rounded",
              isDarkMode ? "bg-gray-800" : "bg-gray-200"
            )}>
              <span className="text-blue-400 font-semibold">Recommended Weight: </span>
              <span className={cn(isDarkMode ? "text-white" : "text-black")}>
                {rpeResult}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculatorTab;
