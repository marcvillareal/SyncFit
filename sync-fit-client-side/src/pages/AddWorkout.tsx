import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../services/workoutService';
import type { WorkoutCreateRequest } from '../types';

const AddWorkout: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<WorkoutCreateRequest>({
    date: new Date().toISOString().split('T')[0], // Today's date
    exercise: '',
    sets: 1,
    reps: 1,
    weight: 0,
    rpe: 5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await workoutService.createWorkout(formData);
      navigate('/');
    } catch (err) {
      setError('Failed to create workout. Please try again.');
      console.error('Error creating workout:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof WorkoutCreateRequest, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="add-workout-page">
      <div className="page-header">
        <h1>Add New Workout</h1>
      </div>

      <form onSubmit={handleSubmit} className="workout-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="exercise">Exercise</label>
          <input
            id="exercise"
            type="text"
            value={formData.exercise}
            onChange={(e) => handleInputChange('exercise', e.target.value)}
            placeholder="e.g., Bench Press, Squat, Deadlift"
            required
            className="form-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sets">Sets</label>
            <input
              id="sets"
              type="number"
              min="1"
              max="50"
              value={formData.sets}
              onChange={(e) => handleInputChange('sets', parseInt(e.target.value))}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="reps">Reps</label>
            <input
              id="reps"
              type="number"
              min="1"
              max="1000"
              value={formData.reps}
              onChange={(e) => handleInputChange('reps', parseInt(e.target.value))}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              id="weight"
              type="number"
              min="0"
              max="1000"
              step="0.5"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rpe">RPE (1-10)</label>
            <input
              id="rpe"
              type="number"
              min="1"
              max="10"
              step="0.5"
              value={formData.rpe}
              onChange={(e) => handleInputChange('rpe', parseFloat(e.target.value))}
              required
              className="form-input"
            />
            <small className="form-help">Rate of Perceived Exertion (1 = very easy, 10 = maximum effort)</small>
          </div>
        </div>

        <div className="calculated-volume">
          <strong>
            Total Volume: {(formData.sets * formData.reps * formData.weight).toFixed(1)} kg
          </strong>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Workout'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWorkout;