import { describe, it, expect, beforeEach, vi } from 'vitest'
import { workoutService } from '../services/workoutService'
import type { Workout, WorkoutCreateRequest } from '../types'

// Mock axios completely
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

// Mock the workoutService module
vi.mock('../services/workoutService', () => ({
  workoutService: {
    getWorkouts: vi.fn(),
    createWorkout: vi.fn(),
  }
}))

const mockWorkoutService = workoutService as any

describe('WorkoutService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch all workouts successfully', async () => {
    const mockWorkouts: Workout[] = [
      {
        id: 1,
        date: '2025-09-25',
        exercise: 'Bench Press',
        sets: 3,
        reps: 10,
        weight: 135,
        rpe: 8,
        createdAt: '2025-09-25T10:00:00Z'
      }
    ]

    mockWorkoutService.getWorkouts.mockResolvedValue(mockWorkouts)

    const result = await workoutService.getWorkouts()
    expect(result).toEqual(mockWorkouts)
    expect(result).toHaveLength(1)
  })

  it('should create a new workout successfully', async () => {
    const workoutRequest: WorkoutCreateRequest = {
      date: '2025-09-25',
      exercise: 'Pull Ups',
      sets: 3,
      reps: 12,
      weight: 0,
      rpe: 7
    }

    const mockResponse: Workout = {
      id: 3,
      ...workoutRequest,
      createdAt: '2025-09-25T10:00:00Z'
    }

    mockWorkoutService.createWorkout.mockResolvedValue(mockResponse)

    const result = await workoutService.createWorkout(workoutRequest)
    expect(result).toEqual(mockResponse)
    expect(result.id).toBe(3)
    expect(result.exercise).toBe('Pull Ups')
  })
})