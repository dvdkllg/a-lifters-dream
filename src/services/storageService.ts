
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export class StorageService {
  private static instance: StorageService;

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async setItem(key: string, value: any): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (Capacitor.isNativePlatform()) {
        await Preferences.set({ key, value: stringValue });
      } else {
        localStorage.setItem(key, stringValue);
      }
    } catch (error) {
      console.error('Error storing data:', error);
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      let value: string | null = null;
      
      if (Capacitor.isNativePlatform()) {
        const result = await Preferences.get({ key });
        value = result.value;
      } else {
        value = localStorage.getItem(key);
      }

      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        await Preferences.remove({ key });
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        await Preferences.clear();
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}
