'use client';

import { ThemeProvider } from './theme-provider';
import { LanguageProvider } from '@/context/language-context';
import { NotificationsProvider } from '@/context/notifications-context';
import { HabitProvider } from '@/context/habit-context';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <NotificationsProvider>
          <HabitProvider>
            {children}
          </HabitProvider>
        </NotificationsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
