
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phoneNumber?: string;
  address?: string;
}

export interface FocusSession {
  id: string;
  startTime: number;
  endTime?: number;
  interruptions: number;
  totalDuration: number;
  videoTitle: string;
  xp: number;
}

export interface AIAdvice {
  title: string;
  content: string;
  category: 'ADHD' | 'Focus' | 'Habits';
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  description: string;
}

export interface UserProgress {
  points: number;
  level: number;
  streak: number;
  lastSessionDate: string | null;
  totalFocusMinutes: number;
  completedModules: string[];
  badges: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  videoUrl: string;
  thumbnail?: string;
}

// Added CommunityPost interface to fix the import error in CommunitySupport.tsx
export interface CommunityPost {
  id: string;
  user: string;
  content: string;
  time: string;
  cheers: number;
}

export enum AppState {
  AUTH = 'auth',
  HOME = 'home',
  FOCUS_MODE = 'focus_mode',
  DASHBOARD = 'dashboard',
  COACH = 'coach',
  MODULES = 'modules',
  PRICING = 'pricing',
  GRANTS = 'grants',
  CALIBRATION = 'calibration',
  PROFILE = 'profile'
}

export type Language = 'en' | 'ar';
