import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { workoutService } from '../services/workoutService';
import type { Workout } from '../types';
import { format, parseISO } from 'date-fns';

const WorkoutsList: React.FC = React.memo(() => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    week?: string;
    exercise?: string;
  }>({});

  const loadWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await workoutService.getWorkouts(filter);
      setWorkouts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load workouts');
      console.error('Error loading workouts:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const handleDeleteWorkout = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      await workoutService.deleteWorkout(id);
      setWorkouts(workouts.filter(w => w.id !== id));
    } catch (err) {
      setError('Failed to delete workout');
      console.error('Error deleting workout:', err);
    }
  };

  const getCurrentWeek = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = Math.floor((now.getTime() - firstDayOfYear.getTime()) / 86400000);
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
  }, []);

  if (loading) {
    return <div className="loading">Loading workouts...</div>;
  }

  return (
    <div className="workouts-page">
      <div className="page-header">
        <h1>Your Workouts</h1>
        <Link to="/add" className="btn btn-primary">
          Add New Workout
        </Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by exercise..."
          value={filter.exercise || ''}
          onChange={(e) => setFilter({ ...filter, exercise: e.target.value || undefined })}
          className="filter-input"
        />
        <input
          type="text"
          placeholder="Week (YYYY-WW)"
          value={filter.week || ''}
          onChange={(e) => setFilter({ ...filter, week: e.target.value || undefined })}
          className="filter-input"
        />
        <button
          onClick={() => setFilter({ week: getCurrentWeek })}
          className="btn btn-secondary"
        >
          This Week
        </button>
        <button
          onClick={() => setFilter({})}
          className="btn btn-secondary"
        >
          Clear Filters
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {workouts.length === 0 ? (
        <div className="empty-state">
          <p>No workouts found.</p>
          <Link to="/add" className="btn btn-primary">
            Add your first workout
          </Link>
        </div>
      ) : (
        <div className="workouts-grid">
          {workouts.map((workout) => (
            <div key={workout.id} className="workout-card">
              <div className="workout-header">
                <h3>{workout.exercise}</h3>
                <span className="workout-date">
                  {format(parseISO(workout.date), 'MMM dd, yyyy')}
                </span>
              </div>
              
              <div className="workout-details">
                <div className="detail-item">
                  <span className="label">Sets:</span>
                  <span className="value">{workout.sets}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Reps:</span>
                  <span className="value">{workout.reps}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Weight:</span>
                  <span className="value">{workout.weight} kg</span>
                </div>
                <div className="detail-item">
                  <span className="label">RPE:</span>
                  <span className="value">{workout.rpe}/10</span>
                </div>
                <div className="detail-item">
                  <span className="label">Volume:</span>
                  <span className="value">{(workout.sets * workout.reps * workout.weight).toFixed(1)} kg</span>
                </div>
              </div>

              <div className="workout-actions">
                <Link to={`/workout/${workout.id}`} className="btn btn-sm btn-secondary">
                  View Details
                </Link>
                <button
                  onClick={() => handleDeleteWorkout(workout.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default WorkoutsList;