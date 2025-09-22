import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { workoutService } from '../services/workoutService';
import type { Workout } from '../types';
import { format, parseISO } from 'date-fns';

const WorkoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadWorkout(parseInt(id));
    }
  }, [id]);

  const loadWorkout = async (workoutId: number) => {
    try {
      setLoading(true);
      const data = await workoutService.getWorkoutById(workoutId);
      setWorkout(data);
      setError(null);
    } catch (err) {
      setError('Failed to load workout details');
      console.error('Error loading workout:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!workout || !window.confirm('Are you sure you want to delete this workout?')) {
      return;
    }

    try {
      await workoutService.deleteWorkout(workout.id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete workout');
      console.error('Error deleting workout:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading workout details...</div>;
  }

  if (error) {
    return (
      <div className="error-page">
        <div className="error-message">{error}</div>
        <Link to="/" className="btn btn-primary">
          Back to Workouts
        </Link>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="error-page">
        <div className="error-message">Workout not found</div>
        <Link to="/" className="btn btn-primary">
          Back to Workouts
        </Link>
      </div>
    );
  }

  const volume = workout.sets * workout.reps * workout.weight;

  return (
    <div className="workout-detail-page">
      <div className="page-header">
        <h1>{workout.exercise}</h1>
        <div className="header-actions">
          <Link to="/" className="btn btn-secondary">
            Back to Workouts
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
          >
            Delete Workout
          </button>
        </div>
      </div>

      <div className="workout-detail-card">
        <div className="detail-header">
          <h2>Workout Details</h2>
          <span className="workout-date">
            {format(parseISO(workout.date), 'EEEE, MMMM dd, yyyy')}
          </span>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <div className="detail-label">Exercise</div>
            <div className="detail-value">{workout.exercise}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Sets</div>
            <div className="detail-value">{workout.sets}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Reps per Set</div>
            <div className="detail-value">{workout.reps}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Weight</div>
            <div className="detail-value">{workout.weight} kg</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">RPE (Rate of Perceived Exertion)</div>
            <div className="detail-value">{workout.rpe}/10</div>
          </div>

          <div className="detail-item highlight">
            <div className="detail-label">Total Volume</div>
            <div className="detail-value">{volume.toFixed(1)} kg</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Total Reps</div>
            <div className="detail-value">{workout.sets * workout.reps}</div>
          </div>

          {workout.createdAt && (
            <div className="detail-item">
              <div className="detail-label">Logged On</div>
              <div className="detail-value">
                {format(parseISO(workout.createdAt), 'MMM dd, yyyy')}
              </div>
            </div>
          )}
        </div>

        <div className="workout-breakdown">
          <h3>Set Breakdown</h3>
          <div className="sets-grid">
            {Array.from({ length: workout.sets }, (_, i) => (
              <div key={i} className="set-card">
                <div className="set-number">Set {i + 1}</div>
                <div className="set-details">
                  {workout.reps} reps × {workout.weight} kg = {(workout.reps * workout.weight).toFixed(1)} kg
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;