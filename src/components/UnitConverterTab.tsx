
import React, { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { SettingsContext } from '@/pages/Index';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const UnitConverterTab = () => {
  const { isDarkMode } = useContext(SettingsContext);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');
  const [isKgToLbs, setIsKgToLbs] = useState(true); // true = kg to lbs, false = lbs to kg

  const parseWeight = (value: string): number => {
    return parseFloat(value.replace(',', '.')) || 0;
  };

  const convert = () => {
    const value = parseWeight(inputValue);
    if (value === 0) {
      setResult('');
      return;
    }

    let convertedValue: number;
    if (isKgToLbs) {
      convertedValue = value * 2.20462; // kg to lbs
    } else {
      convertedValue = value / 2.20462; // lbs to kg
    }

    setResult(convertedValue.toFixed(2));
  };

  const clear = () => {
    setInputValue('');
    setResult('');
  };

  return (
    <div className={cn(
      "p-4 space-y-6 min-h-full",
      isDarkMode ? "bg-black" : "bg-white"
    )}>
      <h2 className="text-2xl font-bold text-center text-cyan-400">Unit Converter</h2>
      
      <Card className={cn(
        "border-cyan-800",
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      )}>
        <CardHeader>
          <CardTitle className="text-cyan-400">Weight Converter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Conversion Direction Switch */}
          <div className="flex items-center justify-center space-x-4">
            <span className={cn(
              "font-semibold",
              !isKgToLbs ? "text-cyan-400" : isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              lbs
            </span>
            <Switch
              checked={isKgToLbs}
              onCheckedChange={setIsKgToLbs}
              className="data-[state=checked]:bg-cyan-600"
            />
            <span className={cn(
              "font-semibold",
              isKgToLbs ? "text-cyan-400" : isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              kg
            </span>
          </div>

          {/* Conversion Display */}
          <div className="text-center">
            <p className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
              Converting from <span className="font-bold text-cyan-400">
                {isKgToLbs ? 'Kilograms' : 'Pounds'}
              </span> to <span className="font-bold text-cyan-400">
                {isKgToLbs ? 'Pounds' : 'Kilograms'}
              </span>
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="inputWeight" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                Enter weight in {isKgToLbs ? 'kg' : 'lbs'}
              </Label>
              <Input
                id="inputWeight"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && convert()}
                className={cn(
                  "border-gray-700 text-lg text-center",
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                )}
                placeholder="0"
              />
            </div>

            {/* Conversion Arrow and Result */}
            <div className="flex items-center justify-center space-x-4">
              <div className={cn(
                "flex-1 p-4 rounded-lg text-center",
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              )}>
                <p className={cn(isDarkMode ? "text-gray-400" : "text-gray-600", "text-sm")}>
                  {isKgToLbs ? 'Kilograms' : 'Pounds'}
                </p>
                <p className={cn(
                  "text-xl font-bold",
                  isDarkMode ? "text-white" : "text-black"
                )}>
                  {inputValue || '0'} {isKgToLbs ? 'kg' : 'lbs'}
                </p>
              </div>
              
              <ArrowRight className="text-cyan-400" size={24} />
              
              <div className={cn(
                "flex-1 p-4 rounded-lg text-center",
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              )}>
                <p className={cn(isDarkMode ? "text-gray-400" : "text-gray-600", "text-sm")}>
                  {isKgToLbs ? 'Pounds' : 'Kilograms'}
                </p>
                <p className="text-xl font-bold text-cyan-400">
                  {result || '0'} {isKgToLbs ? 'lbs' : 'kg'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={convert}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
            >
              Convert
            </Button>
            <Button
              onClick={clear}
              variant="outline"
              className="border-cyan-600 text-cyan-400 hover:bg-cyan-600 hover:text-white"
            >
              Clear
            </Button>
          </div>

          {/* Quick Reference */}
          <div className={cn(
            "p-3 rounded-lg text-xs",
            isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-600"
          )}>
            <p className="font-semibold mb-1">Quick Reference:</p>
            <p>• 1 kg = 2.20462 lbs</p>
            <p>• 1 lbs = 0.453592 kg</p>
            <p>• Accepts both "," and "." as decimal separators</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitConverterTab;
