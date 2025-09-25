import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Progress from '../../pages/Progress'

// Mock the workoutService
vi.mock('../../services/workoutService', () => ({
  workoutService: {
    getWeeklyStats: vi.fn(() => Promise.resolve([
      { week: '2025-W38', volume: 15500, totalWorkouts: 4 },
      { week: '2025-W37', volume: 14200, totalWorkouts: 3 }
    ]))
  }
}))

// Helper function to render Progress with router
const renderProgress = () => {
  return render(
    <MemoryRouter>
      <Progress />
    </MemoryRouter>
  )
}

describe('Progress', () => {
  it('should render progress page with loading state initially', () => {
    renderProgress()

    expect(screen.getByText('Loading progress data...')).toBeInTheDocument()
  })

  it('should render the loading div with correct class', () => {
    renderProgress()

    const loadingElement = screen.getByText('Loading progress data...')
    expect(loadingElement).toHaveClass('loading')
  })
})