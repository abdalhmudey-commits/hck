'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';

interface NotificationsContextType {
  notificationsEnabled: boolean;
  toggleNotifications: () => void;
  requestPermission: () => Promise<boolean>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useLocalStorage('notificationsEnabled', false);
  const { toast } = useToast();

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast({ title: 'Notifications not supported', description: 'This browser does not support desktop notification.', variant: 'destructive' });
      setIsEnabled(false);
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      toast({ title: 'Notification permission denied', description: 'Please enable notifications in your browser settings.', variant: 'destructive' });
      setIsEnabled(false);
      return false;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setIsEnabled(true);
      return true;
    } else {
      setIsEnabled(false);
      return false;
    }
  }, [setIsEnabled, toast]);

  const toggleNotifications = useCallback(async () => {
    if (!isEnabled) {
      const permissionGranted = await requestPermission();
      if (permissionGranted) {
        setIsEnabled(true);
        toast({ title: 'Notifications Enabled', description: 'You will now receive reminders.' });
      }
    } else {
      setIsEnabled(false);
      toast({ title: 'Notifications Disabled', description: 'You will no longer receive reminders.' });
    }
  }, [isEnabled, requestPermission, setIsEnabled, toast]);

  return (
    <NotificationsContext.Provider value={{ notificationsEnabled: isEnabled, toggleNotifications, requestPermission }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
