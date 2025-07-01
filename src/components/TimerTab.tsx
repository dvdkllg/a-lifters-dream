
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Square, RotateCcw, Delete } from 'lucide-react';

const TimerTab = () => {
  const [time, setTime] = useState(0); // time in seconds
  const [originalTime, setOriginalTime] = useState(0); // for progress calculation
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState('00:00');
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
    const seconds = minutes * 60;
    setTime(seconds);
    setOriginalTime(seconds);
    setIsRunning(false);
    setInputTime(formatTime(seconds));
  };

  const handleNumpadInput = (digit: string) => {
    if (digit === 'clear') {
      setInputTime('00:00');
      setTime(0);
      setOriginalTime(0);
      return;
    }

    if (digit === 'delete') {
      const cleanTime = inputTime.replace(':', '');
      const newTime = cleanTime.slice(0, -1).padStart(4, '0');
      const formatted = `${newTime.slice(0, 2)}:${newTime.slice(2)}`;
      setInputTime(formatted);
      
      const mins = parseInt(newTime.slice(0, 2));
      const secs = parseInt(newTime.slice(2));
      const totalSeconds = (mins * 60) + secs;
      setTime(totalSeconds);
      setOriginalTime(totalSeconds);
      return;
    }

    // Handle digit input
    const cleanTime = inputTime.replace(':', '');
    if (cleanTime.length >= 4) return; // Max 99:59
    
    const newTime = (cleanTime + digit).padStart(4, '0');
    const formatted = `${newTime.slice(0, 2)}:${newTime.slice(2)}`;
    
    // Validate seconds (max 59)
    const secs = parseInt(newTime.slice(2));
    if (secs > 59) return;
    
    setInputTime(formatted);
    
    const mins = parseInt(newTime.slice(0, 2));
    const totalSeconds = (mins * 60) + secs;
    setTime(totalSeconds);
    setOriginalTime(totalSeconds);
  };

  const toggleTimer = () => {
    if (time > 0) {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(originalTime);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTime(0);
    setOriginalTime(0);
    setInputTime('00:00');
  };

  const getProgressPercentage = () => {
    if (originalTime === 0) return 0;
    return ((originalTime - time) / originalTime) * 100;
  };

  const numpadButtons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'delete']
  ];

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
            
            {/* Progress bar */}
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
                disabled={originalTime === 0}
                variant="outline"
                className="border-slate-600 px-6"
              >
                <RotateCcw size={20} />
                Reset
              </Button>

              <Button
                onClick={stopTimer}
                variant="outline"
                className="border-slate-600 px-6"
              >
                <Square size={20} />
                Stop
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Input Display */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-4 text-green-400">
              Set Time: {inputTime}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Numpad */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Enter Time (MM:SS)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {numpadButtons.flat().map((button) => (
              <Button
                key={button}
                onClick={() => handleNumpadInput(button)}
                variant="outline"
                className="border-slate-600 hover:bg-blue-600 hover:border-blue-600 h-12 text-lg font-semibold"
              >
                {button === 'clear' ? 'Clear' : 
                 button === 'delete' ? <Delete size={20} /> : 
                 button}
              </Button>
            ))}
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

      {isRunning && (
        <div className="text-center text-green-400 font-semibold">
          Timer is running...
        </div>
      )}
    </div>
  );
};

export default TimerTab;
