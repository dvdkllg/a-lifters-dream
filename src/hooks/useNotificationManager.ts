
import { useState, useCallback } from 'react';

interface NotificationData {
  title: string;
  message: string;
  type?: 'supplement' | 'general';
}

export const useNotificationManager = () => {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showNotification = useCallback((data: NotificationData) => {
    setNotification(data);
    setIsVisible(true);
  }, []);

  const hideNotification = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setNotification(null), 300); // Allow animation to complete
  }, []);

  return {
    notification,
    isVisible,
    showNotification,
    hideNotification
  };
};
