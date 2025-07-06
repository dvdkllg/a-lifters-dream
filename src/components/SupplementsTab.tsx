import React, { useState, useContext, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Clock, Trash2, Bell } from 'lucide-react';
import { SettingsContext } from '@/pages/Index';
import { cn } from '@/lib/utils';
import { LocalNotifications, ScheduleEvery } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { SecureStorageService } from '@/services/secureStorageService';
import { useNotificationManager } from '@/hooks/useNotificationManager';
import NotificationOverlay from './NotificationOverlay';

interface Supplement {
  id: string;
  name: string;
  pillsPerDose: number;
  scheduleTimes: string[];
}

const SupplementsTab = () => {
  const { isDarkMode } = useContext(SettingsContext);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    pillsPerDose: 1,
    scheduleTimes: ['']
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const { notification, isVisible, showNotification, hideNotification } = useNotificationManager();
  const storageService = SecureStorageService.getInstance();

  // Load supplements from storage on component mount
  useEffect(() => {
    const loadSupplements = async () => {
      const savedSupplements = await storageService.getItem<Supplement[]>('supplements');
      if (savedSupplements) {
        setSupplements(savedSupplements);
      }
    };
    loadSupplements();
  }, []);

  // Save supplements to storage whenever they change
  useEffect(() => {
    if (supplements.length > 0) {
      storageService.setItem('supplements', supplements);
    }
  }, [supplements]);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      requestNotificationPermissions();
    }
    
    // Set up interval to check for supplement reminders
    const interval = setInterval(checkSupplementReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [supplements]);

  const checkSupplementReminders = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    supplements.forEach(supplement => {
      if (supplement.scheduleTimes.includes(currentTime)) {
        showNotification({
          title: 'Supplement Reminder',
          message: `Time to take ${supplement.pillsPerDose} ${supplement.name} pill(s)`,
          type: 'supplement'
        });
      }
    });
  };

  const requestNotificationPermissions = async () => {
    try {
      const result = await LocalNotifications.requestPermissions();
      setNotificationsEnabled(result.display === 'granted');
    } catch (error) {
      console.log('Notification permissions error:', error);
    }
  };

  const scheduleNotifications = async (supplement: Supplement) => {
    if (!Capacitor.isNativePlatform() || !notificationsEnabled) return;

    try {
      // Cancel existing notifications for this supplement
      await LocalNotifications.cancel({
        notifications: [{ id: parseInt(supplement.id) }]
      });

      // Schedule new notifications
      const notifications = supplement.scheduleTimes.map((time, index) => {
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
        
        // If time has passed today, schedule for tomorrow
        if (scheduledTime <= now) {
          scheduledTime.setDate(scheduledTime.getDate() + 1);
        }

        return {
          id: parseInt(supplement.id) + index,
          title: 'Supplement Reminder',
          body: `Time to take ${supplement.pillsPerDose} ${supplement.name} pill(s)`,
          schedule: {
            at: scheduledTime,
            repeats: true,
            every: 'day' as ScheduleEvery
          },
          sound: 'default'
        };
      });

      await LocalNotifications.schedule({ notifications });
    } catch (error) {
      console.log('Schedule notification error:', error);
    }
  };

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      scheduleTimes: [...formData.scheduleTimes, '']
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimes = [...formData.scheduleTimes];
    newTimes[index] = value;
    setFormData({ ...formData, scheduleTimes: newTimes });
  };

  const removeTimeSlot = (index: number) => {
    const newTimes = formData.scheduleTimes.filter((_, i) => i !== index);
    setFormData({ ...formData, scheduleTimes: newTimes });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplement: Supplement = {
      id: Date.now().toString(),
      name: formData.name,
      pillsPerDose: formData.pillsPerDose,
      scheduleTimes: formData.scheduleTimes.filter(time => time !== '')
    };
    
    const updatedSupplements = [...supplements, newSupplement];
    setSupplements(updatedSupplements);
    await scheduleNotifications(newSupplement);
    setFormData({ name: '', pillsPerDose: 1, scheduleTimes: [''] });
    setShowForm(false);
  };

  const deleteSupplement = async (id: string) => {
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.cancel({
        notifications: [{ id: parseInt(id) }]
      });
    }
    const updatedSupplements = supplements.filter(sup => sup.id !== id);
    setSupplements(updatedSupplements);
  };

  const getNextDose = (scheduleTimes: string[]) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const times = scheduleTimes.map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }).sort((a, b) => a - b);
    
    const nextTime = times.find(time => time > currentTime) || times[0];
    const hours = Math.floor(nextTime / 60);
    const minutes = nextTime % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <div className={cn(
        "p-4 space-y-4 min-h-full pb-safe",
        isDarkMode ? "bg-black" : "bg-white"
      )}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-purple-400">Supplements</h2>
          <div className="flex gap-2">
            {Capacitor.isNativePlatform() && (
              <Button
                onClick={requestNotificationPermissions}
                size="sm"
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
              >
                <Bell size={16} />
              </Button>
            )}
            <Button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700">
              <Plus size={16} />
              Add Supplement
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className={cn(
            "border-purple-800",
            isDarkMode ? "bg-gray-900" : "bg-gray-100"
          )}>
            <CardHeader>
              <CardTitle className="text-purple-400">Add New Supplement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                    Supplement Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={cn(
                      "border-gray-700",
                      isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                    )}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="pills" className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                    Pills per Dose
                  </Label>
                  <Input
                    id="pills"
                    type="number"
                    min="1"
                    value={formData.pillsPerDose}
                    onChange={(e) => setFormData({ ...formData, pillsPerDose: parseInt(e.target.value) })}
                    className={cn(
                      "border-gray-700",
                      isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                    )}
                  />
                </div>
                
                <div>
                  <Label className={cn(isDarkMode ? "text-gray-300" : "text-gray-700")}>
                    Schedule Times
                  </Label>
                  {formData.scheduleTimes.map((time, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => updateTimeSlot(index, e.target.value)}
                        className={cn(
                          "border-gray-700",
                          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                        )}
                      />
                      {formData.scheduleTimes.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTimeSlot(index)}
                          className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTimeSlot}
                    className="mt-2 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                  >
                    Add Time
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    Save Supplement
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {supplements.map((supplement) => (
            <Card key={supplement.id} className={cn(
              "border-purple-800",
              isDarkMode ? "bg-gray-900" : "bg-gray-100"
            )}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-semibold text-lg flex items-center gap-2",
                      isDarkMode ? "text-white" : "text-black"
                    )}>
                      💊 {supplement.name}
                    </h3>
                    <p className={cn(isDarkMode ? "text-gray-300" : "text-gray-600")}>
                      {supplement.pillsPerDose} pill(s) per dose
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock size={16} className="text-purple-400" />
                      <span className={cn(
                        "text-sm",
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      )}>
                        Next dose: {getNextDose(supplement.scheduleTimes)}
                      </span>
                    </div>
                    <div className={cn(
                      "text-xs mt-1",
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      Times: {supplement.scheduleTimes.join(', ')}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSupplement(supplement.id)}
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {supplements.length === 0 && !showForm && (
          <div className={cn(
            "text-center py-8",
            isDarkMode ? "text-gray-400" : "text-gray-500"
          )}>
            <p>No supplements added yet.</p>
            <p className="text-sm">Tap "Add Supplement" to get started.</p>
          </div>
        )}
      </div>
      
      <NotificationOverlay
        isVisible={isVisible}
        title={notification?.title || ''}
        message={notification?.message || ''}
        type={notification?.type}
        onClose={hideNotification}
      />
    </>
  );
};

export default SupplementsTab;
