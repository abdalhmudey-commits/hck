'use client';

import { useHabits } from '@/context/habit-context';
import { useLanguage } from '@/context/language-context';
import { HabitItem } from './habit-item';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

export function HabitList() {
  const { habits, isHabitsHydrated } = useHabits();
  const { t, isHydrated: isLanguageHydrated } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isHydrated = isHabitsHydrated && isLanguageHydrated && isClient;

  if (!isHydrated) {
    return (
       <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>{t('no_habits_message')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} />
      ))}
    </div>
  );
}
