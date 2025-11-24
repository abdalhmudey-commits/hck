export type Habit = {
  id: string;
  name: string;
  description: string;
  reminderMessage: string;
  frequency: number; // in minutes
  createdAt: number;
  reminderType: 'text' | 'audio';
  audioSrc?: string; // Base64 encoded audio or blob URL
};

export type Language = {
  code: string;
  name: string;
  dir: 'ltr' | 'rtl';
};
