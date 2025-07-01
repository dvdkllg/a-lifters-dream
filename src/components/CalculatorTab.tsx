
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const commonExercises = [
  'Squat', 'Bench Press', 'Deadlift', 'Overhead Press', 'Barbell Row',
  'Pull-ups', 'Dips', 'Bulgarian Split Squat', 'Romanian Deadlift', 'Hip Thrust',
  'Incline Bench Press', 'Close-Grip Bench Press', 'Sumo Deadlift', 'Front Squat', 'Goblet Squat',
  'Lat Pulldown', 'Seated Row', 'Chest Fly', 'Lateral Raise', 'Bicep Curl',
  'Tricep Extension', 'Face Pull', 'Leg Press', 'Leg Curl', 'Leg Extension',
  'Calf Raise', 'Plank', 'Russian Twist', 'Mountain Climber', 'Burpee',
  'Kettlebell Swing', 'Turkish Get-Up', 'Farmer\'s Walk', 'Box Jump', 'Jump Squat',
  'Push-up', 'Pike Push-up', 'Handstand Push-up', 'Archer Squat', 'Pistol Squat',
  'Single Leg Deadlift', 'Step-up', 'Reverse Lunge', 'Walking Lunge', 'Wall Sit',
  'Glute Bridge', 'Bird Dog', 'Dead Bug', 'Side Plank', 'Bear Crawl'
];

const CalculatorTab = () => {
  const [oneRMData, setOneRMData] = useState({
    exercise: '',
    weight: '',
    reps: '',
    rpe: ''
  });

  const [rpeData, setRPEData] = useState({
    exercise: '',
    oneRM: '',
    targetReps: '',
    targetRPE: ''
  });

  const [oneRMResult, setOneRMResult] = useState<number | null>(null);
  const [rpeResult, setRPEResult] = useState<number | null>(null);

  const calculateOneRM = () => {
    const weight = parseFloat(oneRMData.weight);
    const reps = parseInt(oneRMData.reps);
    const rpe = parseFloat(oneRMData.rpe);

    if (!weight || !reps || !rpe) return;

    // Epley formula: 1RM = weight × (1 + reps/30)
    const baseOneRM = weight * (1 + reps / 30);
    
    // Adjust by RPE: 1RM_adjusted = 1RM × (RPE/10)
    const adjustedOneRM = baseOneRM * (rpe / 10);
    
    setOneRMResult(Math.round(adjustedOneRM * 10) / 10);
  };

  const calculateRPEWeight = () => {
    const oneRM = parseFloat(rpeData.oneRM);
    const reps = parseInt(rpeData.targetReps);
    const rpe = parseFloat(rpeData.targetRPE);

    if (!oneRM || !reps || !rpe) return;

    // Calculate percentage based on RPE and reps
    // This is a simplified RPE to percentage conversion
    const rpePercentages: { [key: string]: { [key: number]: number } } = {
      '6.5': { 1: 0.86, 2: 0.82, 3: 0.79, 4: 0.76, 5: 0.73, 6: 0.70, 7: 0.67, 8: 0.64, 9: 0.61, 10: 0.58 },
      '7': { 1: 0.89, 2: 0.85, 3: 0.82, 4: 0.79, 5: 0.76, 6: 0.73, 7: 0.70, 8: 0.67, 9: 0.64, 10: 0.61 },
      '7.5': { 1: 0.92, 2: 0.88, 3: 0.85, 4: 0.82, 5: 0.79, 6: 0.76, 7: 0.73, 8: 0.70, 9: 0.67, 10: 0.64 },
      '8': { 1: 0.95, 2: 0.91, 3: 0.88, 4: 0.85, 5: 0.82, 6: 0.79, 7: 0.76, 8: 0.73, 9: 0.70, 10: 0.67 },
      '8.5': { 1: 0.97, 2: 0.94, 3: 0.91, 4: 0.88, 5: 0.85, 6: 0.82, 7: 0.79, 8: 0.76, 9: 0.73, 10: 0.70 },
      '9': { 1: 1.00, 2: 0.97, 3: 0.94, 4: 0.91, 5: 0.88, 6: 0.85, 7: 0.82, 8: 0.79, 9: 0.76, 10: 0.73 },
      '9.5': { 1: 1.00, 2: 1.00, 3: 0.97, 4: 0.94, 5: 0.91, 6: 0.88, 7: 0.85, 8: 0.82, 9: 0.79, 10: 0.76 },
      '10': { 1: 1.00, 2: 1.00, 3: 1.00, 4: 0.97, 5: 0.94, 6: 0.91, 7: 0.88, 8: 0.85, 9: 0.82, 10: 0.79 }
    };

    const percentage = rpePercentages[rpe.toString()]?.[reps] || 0.7;
    const weight = oneRM * percentage;
    
    setRPEResult(Math.round(weight * 10) / 10);
  };

  const getPercentageTable = (oneRM: number) => {
    const percentages = [100, 90, 80, 70, 60, 50, 40, 30];
    return percentages.map(percent => ({
      percentage: percent,
      weight: Math.round(oneRM * (percent / 100) * 10) / 10
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Calculators</h2>
      
      <Tabs defaultValue="onerm" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="onerm" className="data-[state=active]:bg-blue-600">1RM Calculator</TabsTrigger>
          <TabsTrigger value="rpe" className="data-[state=active]:bg-blue-600">RPE Calculator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="onerm">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>1RM Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="exercise-onerm">Exercise</Label>
                <Select value={oneRMData.exercise} onValueChange={(value) => setOneRMData({...oneRMData, exercise: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="Squat">Squat</SelectItem>
                    <SelectItem value="Bench Press">Bench Press</SelectItem>
                    <SelectItem value="Deadlift">Deadlift</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={oneRMData.weight}
                  onChange={(e) => setOneRMData({...oneRMData, weight: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter weight"
                />
              </div>
              
              <div>
                <Label htmlFor="reps">Repetitions</Label>
                <Input
                  id="reps"
                  type="number"
                  value={oneRMData.reps}
                  onChange={(e) => setOneRMData({...oneRMData, reps: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter reps"
                />
              </div>
              
              <div>
                <Label htmlFor="rpe-onerm">RPE (6.5-10)</Label>
                <Select value={oneRMData.rpe} onValueChange={(value) => setOneRMData({...oneRMData, rpe: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select RPE" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {['6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'].map(rpe => (
                      <SelectItem key={rpe} value={rpe}>RPE {rpe}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={calculateOneRM} className="w-full bg-blue-600 hover:bg-blue-700">
                Calculate 1RM
              </Button>
              
              {oneRMResult && (
                <div className="mt-4 space-y-4">
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <h3 className="text-xl font-bold text-green-400">Estimated 1RM: {oneRMResult} kg</h3>
                  </div>
                  
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Percentage Table</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {getPercentageTable(oneRMResult).map(({ percentage, weight }) => (
                        <div key={percentage} className="flex justify-between p-2 bg-slate-600 rounded">
                          <span>{percentage}%</span>
                          <span>{weight} kg</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rpe">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle>RPE Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="exercise-rpe">Exercise</Label>
                <Select value={rpeData.exercise} onValueChange={(value) => setRPEData({...rpeData, exercise: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 max-h-60">
                    {commonExercises.map(exercise => (
                      <SelectItem key={exercise} value={exercise}>{exercise}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="onerm">Current 1RM (kg)</Label>
                <Input
                  id="onerm"
                  type="number"
                  value={rpeData.oneRM}
                  onChange={(e) => setRPEData({...rpeData, oneRM: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter your 1RM"
                />
              </div>
              
              <div>
                <Label htmlFor="target-reps">Target Reps</Label>
                <Input
                  id="target-reps"
                  type="number"
                  value={rpeData.targetReps}
                  onChange={(e) => setRPEData({...rpeData, targetReps: e.target.value})}
                  className="bg-slate-700 border-slate-600"
                  placeholder="Enter target reps"
                />
              </div>
              
              <div>
                <Label htmlFor="target-rpe">Target RPE</Label>
                <Select value={rpeData.targetRPE} onValueChange={(value) => setRPEData({...rpeData, targetRPE: value})}>
                  <SelectTrigger className="bg-slate-700 border-slate-600">
                    <SelectValue placeholder="Select target RPE" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {['6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'].map(rpe => (
                      <SelectItem key={rpe} value={rpe}>RPE {rpe}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={calculateRPEWeight} className="w-full bg-green-600 hover:bg-green-700">
                Calculate Weight
              </Button>
              
              {rpeResult && (
                <div className="mt-4">
                  <div className="text-center p-4 bg-slate-700 rounded-lg">
                    <h3 className="text-xl font-bold text-green-400">Use: {rpeResult} kg</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      For {rpeData.targetReps} reps at RPE {rpeData.targetRPE}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalculatorTab;
