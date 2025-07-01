
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

const TimerTab = () => {
  const [time, setTime] = useState(0); // time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [customSeconds, setCustomSeconds] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            // Play notification sound or vibration here
            alert('Timer finished!');
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setPresetTime = (minutes: number) => {
    setTime(minutes * 60);
    setIsRunning(false);
  };

  const setCustomTime = () => {
    const mins = parseInt(customMinutes) || 0;
    const secs = parseInt(customSeconds) || 0;
    const totalSeconds = (mins * 60) + secs;
    
    if (totalSeconds > 0) {
      setTime(totalSeconds);
      setIsRunning(false);
      setCustomMinutes('');
      setCustomSeconds('');
    }
  };

  const toggleTimer = () => {
    if (time > 0) {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const getProgressPercentage = () => {
    if (time === 0) return 0;
    // This would need to track the original time to show progress
    return 0;
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-center">Rest Timer</h2>
      
      {/* Timer Display */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="text-6xl font-bold mb-4 text-blue-400">
              {formatTime(time)}
            </div>
            
            {/* Progress circle could go here */}
            <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                onClick={toggleTimer}
                disabled={time === 0}
                className="bg-green-600 hover:bg-green-700 px-6"
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              
              <Button
                onClick={resetTimer}
                variant="outline"
                className="border-slate-600 px-6"
              >
                <RotateCcw size={20} />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preset Times */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Quick Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => setPresetTime(1)}
              variant="outline"
              className="border-slate-600 hover:bg-blue-600 hover:border-blue-600"
            >
              1 Min
            </Button>
            <Button
              onClick={() => setPresetTime(3)}
              variant="outline"
              className="border-slate-600 hover:bg-blue-600 hover:border-blue-600"
            >
              3 Min
            </Button>
            <Button
              onClick={() => setPresetTime(5)}
              variant="outline"
              className="border-slate-600 hover:bg-blue-600 hover:border-blue-600"
            >
              5 Min
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Time */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Custom Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Minutes</label>
              <Input
                type="number"
                min="0"
                max="59"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="bg-slate-700 border-slate-600"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Seconds</label>
              <Input
                type="number"
                min="0"
                max="59"
                value={customSeconds}
                onChange={(e) => setCustomSeconds(e.target.value)}
                className="bg-slate-700 border-slate-600"
                placeholder="0"
              />
            </div>
            <Button
              onClick={setCustomTime}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Set
            </Button>
          </div>
        </CardContent>
      </Card>

      {isRunning && (
        <div className="text-center text-green-400 font-semibold">
          Timer is running...
        </div>
      )}
    </div>
  );
};

export default TimerTab;
