import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AddWorkout from '../../pages/AddWorkout'

// Helper function to render AddWorkout with router
const renderAddWorkout = () => {
  return render(
    <MemoryRouter>
      <AddWorkout />
    </MemoryRouter>
  )
}

describe('AddWorkout', () => {
  it('should render the workout form with all required fields', () => {
    renderAddWorkout()

    expect(screen.getByText('Add New Workout')).toBeInTheDocument()
    expect(screen.getByLabelText('Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Exercise')).toBeInTheDocument()
    expect(screen.getByLabelText('Sets')).toBeInTheDocument()
    expect(screen.getByLabelText('Reps')).toBeInTheDocument()
    expect(screen.getByLabelText('Weight (kg)')).toBeInTheDocument()
    expect(screen.getByLabelText('RPE (1-10)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Workout' })).toBeInTheDocument()
  })

  it('should allow user to fill out the form fields', () => {
    renderAddWorkout()

    const setsInput = screen.getByLabelText('Sets') as HTMLInputElement
    fireEvent.change(setsInput, { target: { value: '3' } })
    expect(setsInput.value).toBe('3')

    const repsInput = screen.getByLabelText('Reps') as HTMLInputElement
    fireEvent.change(repsInput, { target: { value: '10' } })
    expect(repsInput.value).toBe('10')
  })
})