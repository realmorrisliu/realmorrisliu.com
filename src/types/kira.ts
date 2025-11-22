export type EventType = 'work' | 'personal' | 'urgent' | 'wellness' | 'study' | 'social';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: EventType;
  description?: string;
}

export interface Task {
  id: string;
  title: string;
  tag: EventType;
  status: 'todo' | 'done';
  createdAt: Date;
}

export interface DayPoolItem {
  id: string;
  taskId: string;
  date: Date;
  order: number;
}

export interface UserPreferences {
  workingHours: {
    start: number;
    end: number;
  };
}

export interface ScheduleState {
  events: CalendarEvent[];
  tasks: Task[];
  dayPool: DayPoolItem[];
  preferences: UserPreferences;
}
