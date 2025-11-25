import React, { createContext, useContext, useReducer, useEffect } from "react";
import type {
  ScheduleState,
  CalendarEvent,
  Task,
  DayPoolItem,
  UserPreferences,
} from "@/types/kira";

// Initial State
const initialState: ScheduleState = {
  events: [],
  tasks: [],
  dayPool: [],
  preferences: {
    workingHours: { start: 6, end: 22 },
  },
};

// Actions
type Action =
  | { type: "ADD_EVENT"; payload: CalendarEvent }
  | { type: "UPDATE_EVENT"; payload: CalendarEvent }
  | { type: "DELETE_EVENT"; payload: string }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "ADD_DAY_POOL_ITEM"; payload: DayPoolItem }
  | { type: "REMOVE_DAY_POOL_ITEM"; payload: string }
  | { type: "UPDATE_PREFERENCES"; payload: Partial<UserPreferences> }
  | { type: "LOAD_STATE"; payload: ScheduleState };

// Reducer
const scheduleReducer = (state: ScheduleState, action: Action): ScheduleState => {
  switch (action.type) {
    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.payload] };
    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map(e => (e.id === action.payload.id ? action.payload : e)),
      };
    case "DELETE_EVENT":
      return { ...state, events: state.events.filter(e => e.id !== action.payload) };
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map(t => (t.id === action.payload.id ? action.payload : t)),
      };
    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case "ADD_DAY_POOL_ITEM":
      return { ...state, dayPool: [...state.dayPool, action.payload] };
    case "REMOVE_DAY_POOL_ITEM":
      return { ...state, dayPool: state.dayPool.filter(i => i.id !== action.payload) };
    case "UPDATE_PREFERENCES":
      return { ...state, preferences: { ...state.preferences, ...action.payload } };
    case "LOAD_STATE":
      return action.payload;
    default:
      return state;
  }
};

// Context
interface ScheduleContextType {
  state: ScheduleState;
  dispatch: React.Dispatch<Action>;
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  toggleTaskStatus: (id: string) => void;
  addToDayPool: (taskId: string, date: Date) => void;
  removeFromDayPool: (id: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

// Persistence Key
const STORAGE_KEY = "kira-schedule-v1";

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Restore Date objects
        parsed.events = parsed.events.map(
          (e: { start: string; end: string; [key: string]: unknown }) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          })
        );
        parsed.tasks = parsed.tasks.map((t: { createdAt: string; [key: string]: unknown }) => ({
          ...t,
          createdAt: new Date(t.createdAt),
        }));
        if (parsed.dayPool) {
          parsed.dayPool = parsed.dayPool.map((i: { date: string; [key: string]: unknown }) => ({
            ...i,
            date: new Date(i.date),
          }));
        } else {
          parsed.dayPool = [];
        }
        dispatch({ type: "LOAD_STATE", payload: parsed });
      } catch (e) {
        console.error("Failed to load schedule state", e);
      }
    } else {
      // Load Mock Data if empty
      const mockEvents: CalendarEvent[] = [
        {
          id: "1",
          title: "Deep Work",
          start: new Date(new Date().setHours(9, 0, 0, 0)),
          end: new Date(new Date().setHours(11, 30, 0, 0)),
          type: "work",
        },
        {
          id: "2",
          title: "Team Sync",
          start: new Date(new Date().setHours(14, 0, 0, 0)),
          end: new Date(new Date().setHours(15, 0, 0, 0)),
          type: "work",
        },
      ];
      const mockTasks: Task[] = [
        {
          id: "1",
          title: "Review quarterly goals",
          tag: "work",
          status: "todo",
          createdAt: new Date(),
        },
        {
          id: "2",
          title: "Buy groceries for dinner",
          tag: "personal",
          status: "todo",
          createdAt: new Date(),
        },
        { id: "3", title: "Call Mom", tag: "social", status: "todo", createdAt: new Date() },
      ];
      dispatch({
        type: "LOAD_STATE",
        payload: {
          events: mockEvents,
          tasks: mockTasks,
          dayPool: [],
          preferences: initialState.preferences,
        },
      });
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (state !== initialState) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  // Helper Functions
  const checkOverlap = (newEvent: CalendarEvent, events: CalendarEvent[]): boolean => {
    const otherEvents = events.filter(e => e.id !== newEvent.id);
    return otherEvents.some(existingEvent => {
      return newEvent.start < existingEvent.end && newEvent.end > existingEvent.start;
    });
  };

  const addEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = { ...event, id: crypto.randomUUID() };

    if (checkOverlap(newEvent, state.events)) {
      // Ideally we should notify the user, but for now just return
      console.warn("Event overlap detected, creation blocked.");
      return;
    }

    dispatch({ type: "ADD_EVENT", payload: newEvent });
  };

  const updateEvent = (event: CalendarEvent) => {
    if (checkOverlap(event, state.events)) {
      console.warn("Event overlap detected, update blocked.");
      return;
    }
    dispatch({ type: "UPDATE_EVENT", payload: event });
  };

  const deleteEvent = (id: string) => {
    dispatch({ type: "DELETE_EVENT", payload: id });
  };

  const addTask = (task: Omit<Task, "id" | "createdAt" | "status">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      status: "todo",
      createdAt: new Date(),
    };
    dispatch({ type: "ADD_TASK", payload: newTask });
  };

  const toggleTaskStatus = (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      const newStatus = task.status === "done" ? "todo" : "done";
      dispatch({ type: "UPDATE_TASK", payload: { ...task, status: newStatus } });
    }
  };

  const addToDayPool = (taskId: string, date: Date) => {
    const newItem: DayPoolItem = {
      id: crypto.randomUUID(),
      taskId,
      date,
      order: state.dayPool.length, // Simple order for now
    };
    dispatch({ type: "ADD_DAY_POOL_ITEM", payload: newItem });
  };

  const removeFromDayPool = (id: string) => {
    dispatch({ type: "REMOVE_DAY_POOL_ITEM", payload: id });
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    dispatch({ type: "UPDATE_PREFERENCES", payload: prefs });
  };

  return (
    <ScheduleContext.Provider
      value={{
        state,
        dispatch,
        addEvent,
        updateEvent,
        deleteEvent,
        addTask,
        toggleTaskStatus,
        addToDayPool,
        removeFromDayPool,
        updatePreferences,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};
