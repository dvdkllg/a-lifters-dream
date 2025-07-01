
import React, { useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { SettingsContext } from '@/pages/Index';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { isDarkMode, isKg, setIsDarkMode, setIsKg } = useContext(SettingsContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">Settings</CardTitle>
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
            <Label htmlFor="dark-mode" className="text-gray-300">
              Dark Mode
            </Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="units" className="text-gray-300">
              Use Kilograms
            </Label>
            <Switch
              id="units"
              checked={isKg}
              onCheckedChange={setIsKg}
            />
          </div>
          
          <div className="text-xs text-gray-500">
            <p>• Dark mode changes the app theme</p>
            <p>• Units setting affects calculators and plate calculator</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsModal;
