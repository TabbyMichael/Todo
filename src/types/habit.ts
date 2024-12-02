export interface Habit {
  id: string;
  title: string;
  category: string;
  time: string;
  duration?: number; // in minutes
  location: string;
  isCompleted?: boolean;
  icon?: string;
  streak?: number;
}

export interface Analytics {
  positiveHabits: number;
  percentageIncrease: number;
}

export interface CalendarDay {
  date: number;
  isActive?: boolean;
  hasEvents?: boolean;
  timeSpent?: number; // in minutes
}

export interface DailyProgress {
  date: string;
  completed: number;
  total: number;
  timeSpent: number;
}