import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Streaks from '../../components/Streaks'
import type { Workout } from '../../types'

describe('Streaks', () => {
  beforeEach(() => {
    // Set fake date to September 25, 2025
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 8, 25)) // Month is 0-indexed
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const mockWorkoutsEmpty: Workout[] = []

  const mockWorkoutsMultiple: Workout[] = [
    {
      id: 1,
      date: '2025-09-25',
      exercise: 'Bench Press',
      sets: 3,
      reps: 10,
      weight: 135,
      rpe: 8
    },
    {
      id: 2,
      date: '2025-09-24',
      exercise: 'Squats',
      sets: 4,
      reps: 8,
      weight: 185,
      rpe: 9
    }
  ]

  it('should display zero streak with motivational message for no workouts', () => {
    render(<Streaks workouts={mockWorkoutsEmpty} />)

    expect(screen.getByText('🔥 Workout Streaks')).toBeInTheDocument()
    expect(screen.getByText('💤 0 days')).toBeInTheDocument()
    expect(screen.getByText('Start your streak today!')).toBeInTheDocument()
    expect(screen.getByText('Total active days: 0')).toBeInTheDocument()
  })

  it('should calculate consecutive day streak correctly', () => {
    render(<Streaks workouts={mockWorkoutsMultiple} />)

    expect(screen.getByText('🔥 2 days')).toBeInTheDocument()
    expect(screen.getByText('2 days strong! 💪')).toBeInTheDocument()
    expect(screen.getByText('Total active days: 2')).toBeInTheDocument()
  })
})