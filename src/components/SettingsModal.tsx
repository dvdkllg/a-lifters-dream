
import React, { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Sun, Moon, Bell, Zap } from 'lucide-react';
import { SettingsContext } from '@/pages/Index';
import { cn } from '@/lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { 
    isDarkMode, 
    isKg, 
    setIsDarkMode, 
    setIsKg, 
    motivationReminder, 
    setMotivationReminder, 
    harshMotivation, 
    setHarshMotivation 
  } = useContext(SettingsContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className={cn(
        "w-full max-w-md border-gray-700 max-h-[90vh] overflow-y-auto",
        isDarkMode ? "bg-gray-900" : "bg-white"
      )}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className={cn(isDarkMode ? "text-white" : "text-black")}>Settings</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
              Theme
            </Label>
            <div className="flex items-center space-x-3">
              <Sun size={18} className={cn(!isDarkMode ? "text-yellow-500" : "text-gray-400")} />
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                className="data-[state=checked]:bg-gray-700"
              />
              <Moon size={18} className={cn(isDarkMode ? "text-blue-400" : "text-gray-400")} />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
              Weight Units
            </Label>
            <div className="flex space-x-2">
              <Button
                variant={!isKg ? "default" : "outline"}
                onClick={() => setIsKg(false)}
                className={cn(
                  "flex-1",
                  !isKg 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                )}
              >
                Pounds (lbs)
              </Button>
              <Button
                variant={isKg ? "default" : "outline"}
                onClick={() => setIsKg(true)}
                className={cn(
                  "flex-1",
                  isKg 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                )}
              >
                Kilograms (kg)
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell size={18} className={cn(isDarkMode ? "text-gray-400" : "text-gray-600")} />
                <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                  Motivation Reminder
                </Label>
              </div>
              <Switch
                checked={motivationReminder}
                onCheckedChange={setMotivationReminder}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
            
            {motivationReminder && (
              <div className="ml-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap size={16} className={cn(isDarkMode ? "text-orange-400" : "text-orange-600")} />
                    <Label className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-600")}>
                      Harsh Motivation
                    </Label>
                  </div>
                  <Switch
                    checked={harshMotivation}
                    onCheckedChange={setHarshMotivation}
                    className="data-[state=checked]:bg-orange-600"
                  />
                </div>
                <div className={cn("text-xs pl-6", isDarkMode ? "text-gray-500" : "text-gray-600")}>
                  <p>• Get notified if you haven't opened the app for 2 days</p>
                  <p>• Harsh mode uses more intense language</p>
                </div>
              </div>
            )}
          </div>
          
          <div className={cn("text-xs", isDarkMode ? "text-gray-500" : "text-gray-600")}>
            <p>• Theme setting changes the app appearance</p>
            <p>• Units setting affects all calculators</p>
            <p>• Notifications require permission on mobile devices</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsModal;
