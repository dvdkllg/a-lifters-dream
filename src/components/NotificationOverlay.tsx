
import React, { useEffect, useRef, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { X, Bell } from 'lucide-react';
import { SettingsContext } from '@/pages/Index';
import { cn } from '@/lib/utils';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

interface NotificationOverlayProps {
  isVisible: boolean;
  title: string;
  message: string;
  onClose: () => void;
  type?: 'supplement' | 'general';
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({ 
  isVisible, 
  title, 
  message, 
  onClose,
  type = 'general' 
}) => {
  const { isDarkMode } = useContext(SettingsContext);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isVisible) {
      // Create and play notification sound
      if (!audioRef.current) {
        audioRef.current = new Audio();
        // Different sound for supplements vs general notifications
        if (type === 'supplement') {
          audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D2um8gBTOH0fPTfjMGLnvN8+KVRAM';
        } else {
          audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+D2um8gBTOH0fPTfjMGLnvN8+KVRAM';
        }
        audioRef.current.volume = 0.5;
      }
      
      audioRef.current.play().catch(console.error);
      
      // Trigger haptic feedback on mobile
      if (Capacitor.isNativePlatform()) {
        Haptics.impact({ style: ImpactStyle.Medium });
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
  }, [isVisible, type]);

  if (!isVisible) return null;

  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onClose();
  };

  const iconColor = type === 'supplement' ? 'text-purple-400' : 'text-blue-400';
  const borderColor = type === 'supplement' ? 'border-purple-400' : 'border-blue-400';
  const buttonColor = type === 'supplement' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] animate-pulse">
      <div className={cn(
        "p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4 border-4",
        isDarkMode ? "bg-gray-900" : "bg-white",
        borderColor
      )}>
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">
            {type === 'supplement' ? '💊' : <Bell className={cn("mx-auto", iconColor)} size={60} />}
          </div>
          <h2 className={cn(
            "text-2xl font-bold mb-2",
            isDarkMode ? "text-white" : "text-black"
          )}>
            {title}
          </h2>
          <p className={cn(
            "text-lg",
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}>
            {message}
          </p>
        </div>
        
        <Button
          onClick={handleClose}
          className={cn("px-6 py-3 text-lg", buttonColor)}
        >
          <X size={20} className="mr-2" />
          Dismiss
        </Button>
      </div>
    </div>
  );
};

export default NotificationOverlay;
