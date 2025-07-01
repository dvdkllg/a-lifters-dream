
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Plus, Delete, ArrowLeft } from 'lucide-react';
import { SettingsContext } from '@/pages/Index';
import { cn } from '@/lib/utils';

interface Preset {
  id: string;
  name: string;
  seconds: number;
}

const TimerTab = () => {
  const { isDarkMode } = useContext(SettingsContext);
  const [time, setTime] = useState(0);
  const [originalTime, setOriginalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [presets, setPresets] = useState<Preset[]>([
    { id: '1', name: '1 min', seconds: 60 },
    { id: '2', name: '3 min', seconds: 180 },
    { id: '3', name: '5 min', seconds: 300 }
  ]);
  const [showPresetForm, setShowPresetForm] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            alert('Rest complete! Time to get back to work! 💪');
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

  const handleNumpadInput = (digit: string) => {
    if (isRunning) return;

    if (digit === 'clear') {
      setTime(0);
      setOriginalTime(0);
      return;
    }

    if (digit === 'back') {
      const timeString = Math.floor(time / 60).toString().padStart(2, '0') + 
                        (time % 60).toString().padStart(2, '0');
      const newTimeString = timeString.slice(0, -1).padStart(4, '0');
      const mins = parseInt(newTimeString.slice(0, 2));
      const secs = parseInt(newTimeString.slice(2));
      const totalSeconds = (mins * 60) + secs;
      setTime(totalSeconds);
      setOriginalTime(totalSeconds);
      return;
    }

    // Handle digit input
    const currentMins = Math.floor(time / 60);
    const currentSecs = time % 60;
    const timeString = currentMins.toString().padStart(2, '0') + 
                      currentSecs.toString().padStart(2, '0');
    
    if (timeString.length >= 4 && timeString !== '0000') return;
    
    const newTimeString = (timeString + digit).slice(-4);
    const mins = parseInt(newTimeString.slice(0, 2));
    const secs = parseInt(newTimeString.slice(2));
    
    if (secs > 59) return;
    
    const totalSeconds = (mins * 60) + secs;
    setTime(totalSeconds);
    setOriginalTime(totalSeconds);
  };

  const toggleTimer = () => {
    if (time > 0) {
      setIsRunning(!isRunning);
    }
  };

  const addMinute = () => {
    if (!isRunning) {
      const newTime = time + 60;
      setTime(newTime);
      setOriginalTime(newTime);
    }
  };

  const getProgressPercentage = () => {
    if (originalTime === 0) return 0;
    return ((originalTime - time) / originalTime) * 100;
  };

  const addPreset = () => {
    if (newPresetName && time > 0) {
      const newPreset: Preset = {
        id: Date.now().toString(),
        name: newPresetName,
        seconds: time
      };
      setPresets([...presets, newPreset]);
      setNewPresetName('');
      setShowPresetForm(false);
    }
  };

  const loadPreset = (seconds: number) => {
    if (!isRunning) {
      setTime(seconds);
      setOriginalTime(seconds);
    }
  };

  const deletePreset = (id: string) => {
    setPresets(presets.filter(p => p.id !== id));
  };

  const circumference = 2 * Math.PI * 90; // radius of 90
  const strokeDashoffset = circumference - (getProgressPercentage() / 100) * circumference;

  return (
    <div className={cn(
      "p-4 space-y-6 min-h-full",
      isDarkMode ? "bg-black" : "bg-white"
    )}>
      <h2 className="text-2xl font-bold text-center text-green-400">Rest Timer</h2>
      
      {/* Timer Display with Circle */}
      <Card className={cn(
        "border-green-800",
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      )}>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke={isDarkMode ? "#374151" : "#d1d5db"}
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-bold text-green-400">
                  {formatTime(time)}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                onClick={toggleTimer}
                disabled={time === 0}
                className="bg-green-600 hover:bg-green-700 px-8"
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                {isRunning ? 'Pause' : 'Start'}
              </Button>
              
              <Button
                onClick={addMinute}
                disabled={isRunning}
                variant="outline"
                className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white px-6"
              >
                +1:00
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Numpad */}
      <Card className={cn(
        "border-green-800",
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      )}>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                onClick={() => handleNumpadInput(num.toString())}
                disabled={isRunning}
                variant="outline"
                className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white h-12 text-lg font-semibold"
              >
                {num}
              </Button>
            ))}
            <Button
              onClick={() => handleNumpadInput('clear')}
              disabled={isRunning}
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white h-12 text-sm font-semibold"
            >
              Clear
            </Button>
            <Button
              onClick={() => handleNumpadInput('0')}
              disabled={isRunning}
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white h-12 text-lg font-semibold"
            >
              0
            </Button>
            <Button
              onClick={() => handleNumpadInput('back')}
              disabled={isRunning}
              variant="outline"
              className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white h-12"
            >
              <ArrowLeft size={20} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Presets */}
      <Card className={cn(
        "border-green-800",
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      )}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-green-400">Presets</CardTitle>
            <Button
              onClick={() => setShowPresetForm(!showPresetForm)}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showPresetForm && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Preset name"
                className={cn(
                  "flex-1 px-3 py-2 rounded border",
                  "border-green-600 bg-gray-800 text-white"
                )}
              />
              <Button
                onClick={addPreset}
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
              >
                Add
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <div key={preset.id} className="flex items-center gap-2">
                <Button
                  onClick={() => loadPreset(preset.seconds)}
                  disabled={isRunning}
                  variant="outline"
                  className="flex-1 border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                >
                  {preset.name}
                </Button>
                <Button
                  onClick={() => deletePreset(preset.id)}
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Delete size={14} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {isRunning && (
        <div className="text-center text-green-400 font-semibold animate-pulse">
          Rest in progress... 💪
        </div>
      )}
    </div>
  );
};

export default TimerTab;
