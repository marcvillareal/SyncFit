import axios from 'axios';
import type { Workout, WorkoutCreateRequest, WeeklyStats, HealthResponse } from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.PROD ? 'http://localhost:8080' : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response interceptors for error handling
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const workoutService = {
  // Get all workouts or filter by parameters
  async getWorkouts(params?: {
    week?: string;
    exercise?: string;
    days?: number;
  }): Promise<Workout[]> {
    const response = await api.get('/workouts', { params });
    return response.data;
  },

  // Get workout by ID
  async getWorkoutById(id: number): Promise<Workout> {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },

  // Create new workout
  async createWorkout(workout: WorkoutCreateRequest): Promise<Workout> {
    const response = await api.post('/workouts', workout);
    return response.data.workout;
  },

  // Delete workout
  async deleteWorkout(id: number): Promise<void> {
    await api.delete(`/workouts/${id}`);
  },

  // Get weekly statistics
  async getWeeklyStats(range: string = 'last4w'): Promise<WeeklyStats[]> {
    const response = await api.get('/stats', { params: { range } });
    return response.data;
  },

  // Health check
  async getHealth(): Promise<HealthResponse> {
    const response = await api.get('/health');
    return response.data;
  }
};

export default workoutService;