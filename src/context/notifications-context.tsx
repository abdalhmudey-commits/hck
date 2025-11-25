'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from './language-context';

interface NotificationsContextType {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  toggleNotifications: () => void;
  requestPermission: (showAlerts?: boolean) => Promise<boolean>;
  isNotificationsHydrated: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEnabled, setIsEnabled, isHydrated] = useLocalStorage('notificationsEnabled', false);
  const { toast } = useToast();
  const { t, isHydrated: isLanguageHydrated } = useLanguage();
  
  const isNotificationsHydrated = isHydrated && isLanguageHydrated;

  const requestPermission = useCallback(async (showAlerts = true): Promise<boolean> => {
    if (!isNotificationsHydrated || typeof window === 'undefined' || !('Notification' in window)) {
      if (showAlerts) {
        toast({ title: t('notifications_not_supported_title'), description: t('notifications_not_supported_desc'), variant: 'destructive' });
      }
      setIsEnabled(false);
      return false;
    }

    if (Notification.permission === 'granted') {
      setIsEnabled(true);
      return true;
    }

    if (Notification.permission === 'denied') {
      if (showAlerts) {
        toast({ title: t('notification_permission_denied_title'), description: t('notification_permission_denied_desc'), variant: 'destructive' });
      }
      setIsEnabled(false);
      return false;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setIsEnabled(true);
      if (showAlerts) {
        toast({ title: t('notifications_enabled_title'), description: t('notifications_enabled_desc') });
      }
      return true;
    } else {
      setIsEnabled(false);
      if (showAlerts) {
        toast({ title: t('notification_permission_denied_title'), description: t('notification_permission_denied_desc'), variant: 'destructive' });
      }
      return false;
    }
  }, [setIsEnabled, toast, t, isNotificationsHydrated]);

  const toggleNotifications = useCallback(async () => {
    if (!isNotificationsHydrated) return;
    if (!isEnabled) {
      await requestPermission(true);
    } else {
      setIsEnabled(false);
      toast({ title: t('notifications_disabled_title'), description: t('notifications_disabled_desc') });
    }
  }, [isEnabled, requestPermission, setIsEnabled, toast, t, isNotificationsHydrated]);

  return (
    <NotificationsContext.Provider value={{ notificationsEnabled: isEnabled, setNotificationsEnabled: setIsEnabled, toggleNotifications, requestPermission, isNotificationsHydrated }}>
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
