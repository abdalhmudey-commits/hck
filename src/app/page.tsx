'use client';

import { AddHabitForm } from '@/components/habit/add-habit-form';
import { HabitList } from '@/components/habit/habit-list';

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-8">
        <AddHabitForm />
        <HabitList />
      </div>
    </div>
  );
}
