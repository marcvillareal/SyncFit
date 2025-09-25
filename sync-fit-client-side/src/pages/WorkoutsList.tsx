import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { workoutService } from '../services/workoutService';
import type { Workout } from '../types';
import { format, parseISO } from 'date-fns';
import Streaks from '../components/Streaks';

const WorkoutsList: React.FC = React.memo(() => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Separate input states from actual filter state
  const [exerciseInput, setExerciseInput] = useState('');
  const [weekInput, setWeekInput] = useState('');
  const [filter, setFilter] = useState<{
    week?: string;
    exercise?: string;
  }>({});

  // Exercise to image/emoji mapping
  const getExerciseImage = (exercise: string): string => {
    const exerciseLower = exercise.toLowerCase();
    
    if (exerciseLower.includes('bench press') || exerciseLower.includes('incline') && exerciseLower.includes('press')) {
      return '🏋️‍♂️'; // Weight lifter
    } else if (exerciseLower.includes('squat')) {
      return '🦵'; // Leg
    } else if (exerciseLower.includes('deadlift')) {
      return '💪'; // Flexed bicep
    } else if (exerciseLower.includes('overhead press') || exerciseLower.includes('shoulder press')) {
      return '🤸‍♂️'; // Person doing cartwheel (overhead movement)
    } else if (exerciseLower.includes('pull-up') || exerciseLower.includes('chin-up') || exerciseLower.includes('lat pulldown')) {
      return '🧗‍♂️'; // Person climbing
    } else if (exerciseLower.includes('row') || exerciseLower.includes('barbell row') || exerciseLower.includes('t-bar row')) {
      return '🚣‍♂️'; // Person rowing
    } else if (exerciseLower.includes('dip')) {
      return '🤸‍♀️'; // Person doing cartwheel
    } else if (exerciseLower.includes('lateral raise') || exerciseLower.includes('shoulder')) {
      return '🤲'; // Open hands (shoulder movement)
    } else if (exerciseLower.includes('curl') || exerciseLower.includes('bicep')) {
      return '💪'; // Flexed bicep
    } else if (exerciseLower.includes('leg press') || exerciseLower.includes('bulgarian split')) {
      return '🦵'; // Leg
    } else if (exerciseLower.includes('cardio') || exerciseLower.includes('running') || exerciseLower.includes('treadmill')) {
      return '🏃‍♂️'; // Person running
    } else {
      return '⚡'; // Default energy/fitness icon
    }
  };

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

  const handleFilterUpdate = () => {
    setFilter({
      exercise: exerciseInput || undefined,
      week: weekInput || undefined
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFilterUpdate();
    }
  };

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

      <Streaks workouts={workouts} />

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by exercise"
          value={exerciseInput}
          onChange={(e) => setExerciseInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="filter-input"
        />
        <input
          type="text"
          placeholder="Week (YYYY-WW) e.g. 2025-W34"
          value={weekInput}
          onChange={(e) => setWeekInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="filter-input"
        />
        <button
          onClick={() => {
            const currentWeek = getCurrentWeek;
            setWeekInput(currentWeek);
            setFilter({ ...filter, week: currentWeek });
          }}
          className="btn btn-secondary"
        >
          This Week
        </button>
        <button
          onClick={() => {
            setExerciseInput('');
            setWeekInput('');
            setFilter({});
          }}
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
                <div className="exercise-info">
                  <div className="exercise-image">
                    {getExerciseImage(workout.exercise)}
                  </div>
                  <h3>{workout.exercise}</h3>
                </div>
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