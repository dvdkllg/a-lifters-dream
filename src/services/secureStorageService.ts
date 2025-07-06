
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export class SecureStorageService {
  private static instance: SecureStorageService;
  private readonly keyPrefix = 'ald_'; // App-specific prefix
  private readonly maxRetries = 3;

  public static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  private sanitizeKey(key: string): string {
    // Sanitize key to prevent injection attacks
    return this.keyPrefix + key.replace(/[^a-zA-Z0-9_-]/g, '');
  }

  private async retryOperation<T>(operation: () => Promise<T>, retries = this.maxRetries): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        console.warn(`Storage operation failed, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.retryOperation(operation, retries - 1);
      }
      throw error;
    }
  }

  async setItem(key: string, value: any): Promise<void> {
    const sanitizedKey = this.sanitizeKey(key);
    
    return this.retryOperation(async () => {
      try {
        const stringValue = JSON.stringify(value);
        if (Capacitor.isNativePlatform()) {
          await Preferences.set({ key: sanitizedKey, value: stringValue });
        } else {
          localStorage.setItem(sanitizedKey, stringValue);
        }
      } catch (error) {
        console.error('Error storing data:', error);
        throw new Error('Failed to store data securely');
      }
    });
  }

  async getItem<T>(key: string): Promise<T | null> {
    const sanitizedKey = this.sanitizeKey(key);
    
    return this.retryOperation(async () => {
      try {
        let value: string | null = null;
        
        if (Capacitor.isNativePlatform()) {
          const result = await Preferences.get({ key: sanitizedKey });
          value = result.value;
        } else {
          value = localStorage.getItem(sanitizedKey);
        }

        if (value === null) return null;
        return JSON.parse(value) as T;
      } catch (error) {
        console.error('Error retrieving data:', error);
        return null;
      }
    });
  }

  async removeItem(key: string): Promise<void> {
    const sanitizedKey = this.sanitizeKey(key);
    
    return this.retryOperation(async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          await Preferences.remove({ key: sanitizedKey });
        } else {
          localStorage.removeItem(sanitizedKey);
        }
      } catch (error) {
        console.error('Error removing data:', error);
        throw new Error('Failed to remove data securely');
      }
    });
  }

  async clear(): Promise<void> {
    return this.retryOperation(async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          // Only clear app-specific keys
          const { keys } = await Preferences.keys();
          const appKeys = keys.filter(key => key.startsWith(this.keyPrefix));
          await Promise.all(appKeys.map(key => Preferences.remove({ key })));
        } else {
          // Only clear app-specific keys from localStorage
          const keysToRemove = Object.keys(localStorage).filter(key => key.startsWith(this.keyPrefix));
          keysToRemove.forEach(key => localStorage.removeItem(key));
        }
      } catch (error) {
        console.error('Error clearing data:', error);
        throw new Error('Failed to clear data securely');
      }
    });
  }
}
