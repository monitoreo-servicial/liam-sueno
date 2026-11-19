export type SleepType = 'nap' | 'night';

export type SleepMethod = 
  | 'brazos' 
  | 'teta' 
  | 'biberon' 
  | 'cuna_solo' 
  | 'cochecito' 
  | 'porteo' 
  | 'movimiento' 
  | 'otro';

export type SleepLocation = 
  | 'cuna' 
  | 'cama' 
  | 'cochecito' 
  | 'brazos' 
  | 'nido' 
  | 'huevito' 
  | 'otro';

export type SleepQuality = 
  | 'tranquilo' 
  | 'inquieto' 
  | 'corto' 
  | 'lloroso';

export type Caregiver = 'Papá' | 'Mamá' | 'Abuelos' | 'Cuidador';

export interface SleepSession {
  id: string;
  type: SleepType;
  start_time: string; // ISO string
  end_time: string | null; // ISO string or null if currently sleeping
  method: SleepMethod;
  location: SleepLocation;
  quality: SleepQuality;
  notes: string | null;
  logged_by: Caregiver | string;
  created_at: string;
  updated_at: string;
}

export interface BabySettings {
  id: string;
  baby_name: string;
  birth_date: string; // YYYY-MM-DD
  wake_window_min_minutes: number; // default 90
  wake_window_max_minutes: number; // default 120
  target_naps: number; // default 4
  desired_bedtime: string; // "20:30"
  desired_wake_time: string; // "07:30"
  updated_at: string;
}

export interface WakeWindowState {
  isAwake: boolean;
  minutesElapsed: number; // time awake or time asleep
  formattedElapsed: string;
  progressPercent: number; // 0 to 100% of max wake window
  statusLevel: 'fresh' | 'sweet_spot' | 'tired' | 'overtired';
  statusText: string;
  statusColor: 'green' | 'yellow' | 'amber' | 'red';
  nextNapTime: Date | null;
  currentSession: SleepSession | null;
  lastCompletedSession: SleepSession | null;
}
