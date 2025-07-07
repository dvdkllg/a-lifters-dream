
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { SecureStorageService } from './secureStorageService';

export class BackgroundService {
  private static instance: BackgroundService;
  private storageService: SecureStorageService;
  private supplementCheckInterval: NodeJS.Timeout | null = null;
  private motivationCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.storageService = SecureStorageService.getInstance();
    this.initializeService();
  }

  public static getInstance(): BackgroundService {
    if (!BackgroundService.instance) {
      BackgroundService.instance = new BackgroundService();
    }
    return BackgroundService.instance;
  }

  private async initializeService() {
    // Request notification permissions
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.requestPermissions();
    }

    // Start background checks
    this.startSupplementCheck();
    this.startMotivationCheck();
    this.resumeTimer();
  }

  // Timer Management
  async saveTimerState(time: number, isRunning: boolean, initialTime: number) {
    const timerState = {
      time,
      isRunning,
      initialTime,
      lastUpdate: Date.now()
    };
    await this.storageService.setItem('timerState', timerState);
  }

  async getTimerState() {
    return await this.storageService.getItem<{
      time: number;
      isRunning: boolean;
      initialTime: number;
      lastUpdate: number;
    }>('timerState');
  }

  async resumeTimer() {
    const timerState = await this.getTimerState();
    if (timerState && timerState.isRunning) {
      const now = Date.now();
      const elapsed = Math.floor((now - timerState.lastUpdate) / 1000);
      const newTime = Math.max(0, timerState.time - elapsed);
      
      if (newTime === 0) {
        this.triggerTimerFinished();
      } else {
        // Update timer state
        await this.saveTimerState(newTime, true, timerState.initialTime);
      }
    }
  }

  private async triggerTimerFinished() {
    await this.saveTimerState(0, false, 0);
    
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [{
          id: 999,
          title: 'Rest Timer Finished!',
          body: 'Time for your next set!',
          sound: 'default'
        }]
      });
    } else {
      // Web notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Rest Timer Finished!', {
          body: 'Time for your next set!',
          icon: '/lovable-uploads/762242bf-9156-463f-ab66-3b7ae004a168.png'
        });
      }
    }

    // Dispatch custom event for overlay
    window.dispatchEvent(new CustomEvent('timerFinished'));
  }

  // Supplement Management
  private startSupplementCheck() {
    if (this.supplementCheckInterval) {
      clearInterval(this.supplementCheckInterval);
    }

    this.supplementCheckInterval = setInterval(async () => {
      await this.checkSupplementReminders();
    }, 60000); // Check every minute
  }

  private async checkSupplementReminders() {
    const supplements = await this.storageService.getItem<any[]>('supplements');
    if (!supplements) return;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    for (const supplement of supplements) {
      if (supplement.scheduleTimes && supplement.scheduleTimes.includes(currentTime)) {
        await this.triggerSupplementNotification(supplement);
      }
    }
  }

  private async triggerSupplementNotification(supplement: any) {
    const notificationId = parseInt(supplement.id) || Math.floor(Math.random() * 1000);
    
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [{
          id: notificationId,
          title: 'Supplement Reminder',
          body: `Time to take ${supplement.pillsPerDose} ${supplement.name} pill(s)`,
          sound: 'default'
        }]
      });
    } else {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Supplement Reminder', {
          body: `Time to take ${supplement.pillsPerDose} ${supplement.name} pill(s)`,
          icon: '/lovable-uploads/762242bf-9156-463f-ab66-3b7ae004a168.png'
        });
      }
    }

    // Dispatch custom event for overlay
    window.dispatchEvent(new CustomEvent('supplementReminder', {
      detail: { supplement }
    }));
  }

  // Motivation Management
  private startMotivationCheck() {
    if (this.motivationCheckInterval) {
      clearInterval(this.motivationCheckInterval);
    }

    this.motivationCheckInterval = setInterval(async () => {
      await this.checkMotivationReminder();
    }, 24 * 60 * 60 * 1000); // Check daily
  }

  private async checkMotivationReminder() {
    const motivationEnabled = await this.storageService.getItem<boolean>('motivationReminder');
    if (!motivationEnabled) return;

    const lastAppOpen = await this.storageService.getItem<number>('lastAppOpen');
    const now = Date.now();
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;

    if (lastAppOpen && (now - lastAppOpen) > twoDaysInMs) {
      const harshMode = await this.storageService.getItem<boolean>('harshMotivation');
      await this.triggerMotivationNotification(harshMode || false);
    }
  }

  private async triggerMotivationNotification(harsh: boolean) {
    const message = harsh 
      ? "Stop making excuses! Your gains are disappearing while you're slacking off!"
      : "Time to get back to the gym! Your fitness journey is waiting.";

    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [{
          id: 888,
          title: 'Motivation Reminder',
          body: message,
          sound: 'default'
        }]
      });
    } else {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Motivation Reminder', {
          body: message,
          icon: '/lovable-uploads/762242bf-9156-463f-ab66-3b7ae004a168.png'
        });
      }
    }
  }

  async updateLastAppOpen() {
    await this.storageService.setItem('lastAppOpen', Date.now());
  }

  // Clean up
  destroy() {
    if (this.supplementCheckInterval) {
      clearInterval(this.supplementCheckInterval);
    }
    if (this.motivationCheckInterval) {
      clearInterval(this.motivationCheckInterval);
    }
  }
}
