import React, { useState, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SettingsContext } from '@/pages/Index';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import TimerOverlay from './TimerOverlay';
import { StorageService } from '@/services/storageService';

const TimerTab = () => {
  const { isDarkMode } = useContext(SettingsContext);
  const [time, setTime] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeInput, setTimeInput] = useState('');
  const [presets, setPresets] = useState([60, 90, 120, 180, 300]);
  const [newPreset, setNewPreset] = useState('');
  const [showAddPreset, setShowAddPreset] = useState(false);
  const [showTimerOverlay, setShowTimerOverlay] = useState(false);

  const storageService = StorageService.getInstance();

  // Load presets from storage on component mount
  useEffect(() => {
    const loadPresets = async () => {
      const savedPresets = await storageService.getItem<number[]>('timerPresets');
      if (savedPresets) {
        setPresets(savedPresets);
      }
    };
    loadPresets();
  }, []);

  // Save presets to storage whenever they change
  useEffect(() => {
    storageService.setItem('timerPresets', presets);
  }, [presets]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
      handleTimerFinished();
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const handleTimerFinished = async () => {
    setShowTimerOverlay(true);
    
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Heavy });
        await LocalNotifications.schedule({
          notifications: [{
            id: 1,
            title: 'Rest Timer Finished!',
            body: 'Your rest period is complete. Time for the next set!',
            sound: 'default'
          }]
        });
      } catch (error) {
        console.log('Timer notification error:', error);
      }
    }
  };

  const handleStart = () => {
    if (time > 0) {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(initialTime);
  };

  const addMinute = () => {
    setTime(prev => prev + 60);
    setInitialTime(prev => prev + 60);
  };

  const handleNumberPad = (num: string) => {
    if (num === 'clear') {
      setTimeInput('');
      setTime(0);
      setInitialTime(0);
      return;
    }
    
    if (num === 'back') {
      const newInput = timeInput.slice(0, -1);
      setTimeInput(newInput);
      updateTimeFromInput(newInput);
      return;
    }

    const newInput = timeInput + num;
    if (newInput.length <= 6) { // Limit to 6 digits (HHMMSS)
      setTimeInput(newInput);
      updateTimeFromInput(newInput);
    }
  };

  const updateTimeFromInput = (input: string) => {
    if (!input) {
      setTime(0);
      setInitialTime(0);
      return;
    }

    // Pad input to 6 digits and parse as HHMMSS
    const paddedInput = input.padStart(6, '0');
    const hours = parseInt(paddedInput.slice(0, 2)) || 0;
    const minutes = parseInt(paddedInput.slice(2, 4)) || 0;
    const seconds = parseInt(paddedInput.slice(4, 6)) || 0;
    
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setTime(totalSeconds);
    setInitialTime(totalSeconds);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setPresetTime = (seconds: number) => {
    setTime(seconds);
    setInitialTime(seconds);
    // Convert seconds back to input format
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const inputStr = `${hours.toString().padStart(2, '0')}${mins.toString().padStart(2, '0')}${secs.toString().padStart(2, '0')}`;
    setTimeInput(inputStr.replace(/^0+/, '') || '0');
    setIsRunning(false);
  };

  const addPreset = () => {
    const seconds = parseInt(newPreset) || 0;
    if (seconds > 0 && !presets.includes(seconds)) {
      setPresets([...presets, seconds].sort((a, b) => a - b));
      setNewPreset('');
      setShowAddPreset(false);
    }
  };

  const removePreset = (seconds: number) => {
    setPresets(presets.filter(p => p !== seconds));
  };

  const handleOverlayReset = () => {
    setTime(initialTime);
    setIsRunning(false);
  };

  const progress = initialTime > 0 ? ((initialTime - time) / initialTime) * 100 : 0;
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      <div className={cn(
        "p-4 space-y-6 min-h-full pb-safe",
        isDarkMode ? "bg-black" : "bg-white"
      )}>
        <h2 className="text-2xl font-bold text-center text-green-400">Rest Timer</h2>
        
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left side - Main Timer and Number Pad */}
          <div className="flex-1 space-y-6">
            {/* Main Timer */}
            <Card className={cn(
              "border-green-800",
              isDarkMode ? "bg-gray-900" : "bg-gray-100"
            )}>
              <CardContent className="p-6">
                {/* Timer Display with Circular Progress */}
                <div className="relative flex items-center justify-center mb-6">
                  <svg className="w-40 h-40 transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className={cn(isDarkMode ? "text-gray-700" : "text-gray-300")}
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className="text-green-400"
                      style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeDashoffset,
                        transition: 'stroke-dashoffset 1s linear'
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn(
                      "text-2xl font-bold",
                      isDarkMode ? "text-white" : "text-black"
                    )}>
                      {formatTime(time)}
                    </span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex justify-center space-x-4 mb-6">
                  <Button
                    onClick={handleStart}
                    className={cn(
                      "flex items-center space-x-2",
                      isRunning 
                        ? "bg-red-600 hover:bg-red-700" 
                        : "bg-green-600 hover:bg-green-700"
                    )}
                  >
                    {isRunning ? <Pause size={20} /> : <Play size={20} />}
                    <span>{isRunning ? 'Pause' : 'Start'}</span>
                  </Button>
                  
                  <Button
                    onClick={addMinute}
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                  >
                    <Plus size={16} />
                    1:00
                  </Button>
                  
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                  >
                    <RotateCcw size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Number Pad */}
            <Card className={cn(
              "border-green-800",
              isDarkMode ? "bg-gray-900" : "bg-gray-100"
            )}>
              <CardHeader>
                <CardTitle className="text-green-400 text-center">Set Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                      key={num}
                      onClick={() => handleNumberPad(num.toString())}
                      className={cn(
                        "h-12 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"
                      )}
                    >
                      {num}
                    </Button>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={() => handleNumberPad('clear')}
                    className="h-12 bg-red-600 hover:bg-red-700 text-white font-bold"
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={() => handleNumberPad('0')}
                    className="h-12 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"
                  >
                    0
                  </Button>
                  <Button
                    onClick={() => handleNumberPad('back')}
                    className="h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold"
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Presets */}
          <div className="w-full lg:w-64">
            <Card className={cn(
              "border-green-800 h-full",
              isDarkMode ? "bg-gray-900" : "bg-gray-100"
            )}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-green-400">Presets</CardTitle>
                  <Button
                    onClick={() => setShowAddPreset(!showAddPreset)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAddPreset && (
                  <div className="space-y-2">
                    <Input
                      type="number"
                      value={newPreset}
                      onChange={(e) => setNewPreset(e.target.value)}
                      placeholder="Seconds"
                      className={cn(
                        "border-gray-700",
                        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                      )}
                    />
                    <Button
                      onClick={addPreset}
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Add
                    </Button>
                  </div>
                )}
                
                <div className="space-y-2">
                  {presets.map((seconds) => (
                    <div key={seconds} className="flex items-center space-x-2">
                      <Button
                        onClick={() => setPresetTime(seconds)}
                        variant="outline"
                        className={cn(
                          "flex-1 border-green-600 text-green-400 hover:bg-green-600 hover:text-white",
                          isDarkMode ? "bg-gray-800" : "bg-white"
                        )}
                      >
                        {formatTime(seconds)}
                      </Button>
                      <Button
                        onClick={() => removePreset(seconds)}
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white p-2"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <TimerOverlay
        isVisible={showTimerOverlay}
        onClose={() => setShowTimerOverlay(false)}
        onReset={handleOverlayReset}
      />
    </>
  );
};

export default TimerTab;
