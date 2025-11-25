'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Habit } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useNotifications } from './notifications-context';
import { useLanguage } from './language-context';
import { translateHabitReminder } from '@/ai/flows/translate-habit-reminder';

interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  deleteHabit: (id: string) => void;
  isHabitsHydrated: boolean;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const getIntervalInMs = (frequency: number, timeUnit: 'minutes' | 'hours' | 'days'): number => {
    switch (timeUnit) {
        case 'minutes':
            return frequency * 60 * 1000;
        case 'hours':
            return frequency * 60 * 60 * 1000;
        case 'days':
            return frequency * 24 * 60 * 60 * 1000;
        default:
            return frequency * 60 * 1000;
    }
}

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits, isHabitsHydrated] = useLocalStorage<Habit[]>('habits', []);
  const { notificationsEnabled, requestPermission, setNotificationsEnabled } = useNotifications();
  const { language } = useLanguage();
  const intervalIds = useRef<NodeJS.Timeout[]>([]);

  // Effect to sync notification permission on initial load
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      } else {
        setNotificationsEnabled(false);
      }
    }
  }, [setNotificationsEnabled]);


  const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    let permissionGranted = notificationsEnabled;
    if (!permissionGranted) {
        permissionGranted = await requestPermission();
    }

    if (!permissionGranted) {
      console.log("Notification permission denied. Habit added without reminders.");
    }

    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setHabits((prevHabits) => [...prevHabits, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };
  
  useEffect(() => {
    // Clear existing intervals
    intervalIds.current.forEach(clearInterval);
    intervalIds.current = [];

    if (notificationsEnabled && isHabitsHydrated) {
        habits.forEach(habit => {
            const intervalMs = getIntervalInMs(habit.frequency, habit.timeUnit);
            const intervalId = setInterval(async () => {
              if (habit.reminderType === 'text' && habit.reminderMessage) {
                try {
                  const { translatedText } = await translateHabitReminder({
                    text: habit.reminderMessage,
                    language: language.code,
                  });
                  new Notification(habit.name, {
                    body: translatedText,
                    icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/icons/icon-192x192.png`,
                  });
                } catch (error) {
                  console.error('Failed to translate and send notification:', error);
                  // Fallback to original message
                  new Notification(habit.name, {
                    body: habit.reminderMessage,
                    icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/icons/icon-192x192.png`,
                  });
                }
              } else if (habit.reminderType === 'audio' && habit.audioSrc) {
                const audio = new Audio(habit.audioSrc);
                audio.play();
              }
            }, intervalMs);
            
            intervalIds.current.push(intervalId);
        });
    }

    return () => {
      intervalIds.current.forEach(clearInterval);
    };
  }, [habits, notificationsEnabled, language.code, isHabitsHydrated]);

  return (
    <HabitContext.Provider value={{ habits, addHabit, deleteHabit, isHabitsHydrated }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
