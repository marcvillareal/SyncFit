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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    exercise: '',
    sets: 0,
    reps: 0,
    weight: 0,
    rpe: 0,
    date: ''
  });

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
      // Initialize edit form with current workout data
      setEditForm({
        exercise: data.exercise,
        sets: data.sets,
        reps: data.reps,
        weight: data.weight,
        rpe: data.rpe,
        date: data.date.split('T')[0] // Convert to YYYY-MM-DD format for input
      });
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (!workout) return;
    // Reset form to original values
    setEditForm({
      exercise: workout.exercise,
      sets: workout.sets,
      reps: workout.reps,
      weight: workout.weight,
      rpe: workout.rpe,
      date: workout.date.split('T')[0]
    });
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!workout) return;

    try {
      const updatedWorkout = await workoutService.updateWorkout(workout.id, {
        exercise: editForm.exercise,
        sets: editForm.sets,
        reps: editForm.reps,
        weight: editForm.weight,
        rpe: editForm.rpe,
        date: editForm.date
      });
      setWorkout(updatedWorkout);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update workout');
      console.error('Error updating workout:', err);
    }
  };

  const handleInputChange = (field: keyof typeof editForm, value: string | number) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
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
        <h1>{isEditing ? 'Edit Workout' : workout.exercise}</h1>
        <div className="header-actions">
          <Link to="/" className="btn btn-secondary">
            Back to Workouts
          </Link>
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                className="btn btn-primary"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancelEdit}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="btn btn-primary"
              >
                Edit Workout
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
              >
                Delete Workout
              </button>
            </>
          )}
        </div>
      </div>

      <div className="workout-detail-card">
        <div className="detail-header">
          <h2>Workout Details</h2>
          <span className="workout-date">
            {isEditing ? (
              <div className="date-input-wrapper">
                <label htmlFor="workout-date" className="sr-only">Workout Date</label>
                <input
                  type="date"
                  id="workout-date"
                  value={editForm.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="date-input"
                />
              </div>
            ) : (
              format(parseISO(workout.date), 'EEEE, MMMM dd, yyyy')
            )}
          </span>
        </div>

        {isEditing ? (
          <div className="edit-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="exercise">Exercise</label>
                <input
                  type="text"
                  id="exercise"
                  value={editForm.exercise}
                  onChange={(e) => handleInputChange('exercise', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sets">Sets</label>
                <input
                  type="number"
                  id="sets"
                  min="1"
                  max="50"
                  value={editForm.sets}
                  onChange={(e) => handleInputChange('sets', parseInt(e.target.value) || 0)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="reps">Reps per Set</label>
                <input
                  type="number"
                  id="reps"
                  min="1"
                  max="1000"
                  value={editForm.reps}
                  onChange={(e) => handleInputChange('reps', parseInt(e.target.value) || 0)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  min="0"
                  step="0.5"
                  value={editForm.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="rpe">RPE (Rate of Perceived Exertion)</label>
                <input
                  type="number"
                  id="rpe"
                  min="1"
                  max="10"
                  step="0.5"
                  value={editForm.rpe}
                  onChange={(e) => handleInputChange('rpe', parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>

              <div className="form-group highlight">
                <label>Estimated Total Volume</label>
                <div className="volume-preview">
                  {(editForm.sets * editForm.reps * editForm.weight).toFixed(1)} kg
                </div>
              </div>
            </div>
          </div>
        ) : (
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
        )}

        {!isEditing && (
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
        )}
      </div>
    </div>
  );
};

export default WorkoutDetail;