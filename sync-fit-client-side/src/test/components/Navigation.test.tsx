import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navigation from '../../components/Navigation'

// Helper function to render Navigation with router
const renderNavigation = (initialPath = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navigation />
    </MemoryRouter>
  )
}

describe('Navigation', () => {
  it('should render all navigation links', () => {
    renderNavigation()

    expect(screen.getByText('💪 SyncFit')).toBeInTheDocument()
    expect(screen.getByText('Workouts')).toBeInTheDocument()
    expect(screen.getByText('Add Workout')).toBeInTheDocument()
    expect(screen.getByText('Progress')).toBeInTheDocument()
  })

  it('should highlight the active link correctly', () => {
    renderNavigation('/add')

    const addWorkoutLink = screen.getByRole('link', { name: 'Add Workout' })
    expect(addWorkoutLink).toHaveClass('active')

    const workoutsLink = screen.getByRole('link', { name: 'Workouts' })
    expect(workoutsLink).not.toHaveClass('active')
  })
})