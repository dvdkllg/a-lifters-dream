
import React, { useEffect, useRef, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { X, RotateCcw } from 'lucide-react';
import { SettingsContext } from '@/pages/Index';
import { cn } from '@/lib/utils';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

interface TimerOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  onReset: () => void;
}

const TimerOverlay: React.FC<TimerOverlayProps> = ({ isVisible, onClose, onReset }) => {
  const { isDarkMode } = useContext(SettingsContext);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isVisible) {
      // Create and play alarm sound
      if (!audioRef.current) {
        audioRef.current = new Audio();
        // Using a web-compatible alarm sound URL
        audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D2um8gBTOH0fPTfjMGLnvN8+KVRAM';
        audioRef.current.loop = true;
        audioRef.current.volume = 0.7;
      }
      
      audioRef.current.play().catch(console.error);
      
      // Trigger haptic feedback on mobile
      if (Capacitor.isNativePlatform()) {
        const vibrate = async () => {
          for (let i = 0; i < 5; i++) {
            await Haptics.impact({ style: ImpactStyle.Heavy });
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        };
        vibrate();
      }
    } else {
      // Stop alarm when overlay is closed
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onClose();
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 animate-pulse">
      <div className={cn(
        "p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4 border-4",
        isDarkMode ? "bg-gray-900 border-green-400" : "bg-white border-green-500"
      )}>
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">⏰</div>
          <h2 className={cn(
            "text-2xl font-bold mb-2",
            isDarkMode ? "text-white" : "text-black"
          )}>
            Rest Timer Finished!
          </h2>
          <p className={cn(
            "text-lg",
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>
            Time for your next set!
          </p>
        </div>
        
        <div className="flex space-x-4 justify-center">
          <Button
            onClick={handleClose}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg"
          >
            <X size={20} className="mr-2" />
            Dismiss
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 text-lg"
          >
            <RotateCcw size={20} className="mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimerOverlay;
