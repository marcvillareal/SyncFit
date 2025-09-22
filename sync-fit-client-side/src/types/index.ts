export interface Workout {
  id: number;
  date: string; // YYYY-MM-DD format
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  rpe: number;
  createdAt?: string;
}

export interface WorkoutCreateRequest {
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  rpe: number;
}

export interface WeeklyStats {
  week: string; // YYYY-WW format
  volume: number;
  totalWorkouts: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
  version: string;
}