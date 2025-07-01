import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OneRMResult {
  formula: string;
  result: number;
}

const CalculatorTab = () => {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [rpe, setRpe] = useState('');
  const [oneRMResults, setOneRMResults] = useState<OneRMResult[]>([]);
  const [percentageWeight, setPercentageWeight] = useState('');
  const [percentage, setPercentage] = useState('');
  const [percentageResult, setPercentageResult] = useState('');

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
    
    // RPE to percentage mapping (approximate)
    const rpePercentages: { [key: number]: number } = {
      10: 100, 9.5: 97, 9: 93, 8.5: 90, 8: 87, 
      7.5: 83, 7: 80, 6.5: 77, 6: 73, 5.5: 70, 5: 67
    };
    
    const percentage = rpePercentages[targetRPE] || 70;
    const recommendedWeight = (oneRM * percentage) / 100;
    
    setPercentageResult(`${Math.round(recommendedWeight * 10) / 10} lbs (${percentage}% of 1RM)`);
  };

  const calculatePercentage = () => {
    const w = parseFloat(percentageWeight);
    const p = parseFloat(percentage);
    
    if (!w || !p) return;
    
    const result = (w * p) / 100;
    setPercentageResult(`${Math.round(result * 10) / 10} lbs`);
  };

  return (
    <div className="p-4 space-y-6 bg-black min-h-full">
      <h2 className="text-2xl font-bold text-center text-blue-400">Calculators</h2>
      
      {/* 1RM Calculator */}
      <Card className="bg-gray-900 border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-400">1RM Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight" className="text-gray-300">Weight (lbs)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="225"
              />
            </div>
            <div>
              <Label htmlFor="reps" className="text-gray-300">Reps</Label>
              <Input
                id="reps"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
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
                <div key={index} className="flex justify-between bg-gray-800 p-2 rounded">
                  <span className="text-gray-300">{result.formula}:</span>
                  <span className="text-white font-bold">{result.result} lbs</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* RPE Calculator */}
      <Card className="bg-gray-900 border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-400">RPE Weight Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="rpeWeight" className="text-gray-300">Known Weight</Label>
              <Input
                id="rpeWeight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="225"
              />
            </div>
            <div>
              <Label htmlFor="rpeReps" className="text-gray-300">Known Reps</Label>
              <Input
                id="rpeReps"
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="5"
              />
            </div>
            <div>
              <Label htmlFor="targetRpe" className="text-gray-300">Target RPE</Label>
              <Select value={rpe} onValueChange={setRpe}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="RPE" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {[10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5].map(rpeValue => (
                    <SelectItem key={rpeValue} value={rpeValue.toString()} className="text-white hover:bg-gray-700">
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
            <div className="bg-gray-800 p-3 rounded">
              <span className="text-blue-400 font-semibold">Recommended Weight: </span>
              <span className="text-white">{percentageResult}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Percentage Calculator */}
      <Card className="bg-gray-900 border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-400">Percentage Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="percentageWeight" className="text-gray-300">Weight (lbs)</Label>
              <Input
                id="percentageWeight"
                type="number"
                value={percentageWeight}
                onChange={(e) => setPercentageWeight(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="300"
              />
            </div>
            <div>
              <Label htmlFor="percentage" className="text-gray-300">Percentage (%)</Label>
              <Input
                id="percentage"
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
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
            <div className="bg-gray-800 p-3 rounded">
              <span className="text-blue-400 font-semibold">Result: </span>
              <span className="text-white font-bold">{percentageResult}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalculatorTab;
