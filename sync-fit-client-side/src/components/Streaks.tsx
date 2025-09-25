import React from "react";
import { Workout } from "../types";

interface StreaksProps {
  workouts: Workout[];
}

const calculateCurrentStreak = (workouts: Workout[]): number => {
  if (workouts.length === 0) {
    return 0;
  }

  // Get unique workout dates and sort them in descending order (most recent first)
  const workoutDates = workouts
    .map((workout) => {
      // Handle both date-only and datetime formats
      const dateStr = workout.date.includes('T') ? workout.date.split("T")[0] : workout.date;
      return dateStr;
    })
    .filter((date, index, array) => array.indexOf(date) === index)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const mostRecentWorkout = workoutDates[0];
  
  // Calculate days between most recent workout and today
  const mostRecentDate = new Date(mostRecentWorkout);
  const todayDate = new Date(todayStr);
  const daysSinceLastWorkout = Math.floor(
    (todayDate.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If last workout was more than 1 day ago, streak is broken
  // Allow for today (0) or yesterday (1) to maintain streak
  if (daysSinceLastWorkout > 1) {
    return 0;
  }

  let streak = 1;

  // Count consecutive days working backwards from most recent
  for (let i = 1; i < workoutDates.length; i++) {
    const currentDate = new Date(workoutDates[i]);
    const previousDate = new Date(workoutDates[i - 1]);
    
    const daysDiff = Math.floor(
      (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If exactly 1 day apart, continue streak
    // Allow for up to 2 days gap (rest days) but could be made stricter
    if (daysDiff === 1) {
      streak++;
    } else if (daysDiff === 2) {
      // Optional: Allow one rest day between workouts
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

const Streaks: React.FC<StreaksProps> = ({ workouts }) => {
  const currentStreak = calculateCurrentStreak(workouts);

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return "💤";
    if (streak < 3) return "🔥";
    if (streak < 7) return "🔥🔥";
    if (streak < 14) return "🔥🔥🔥";
    if (streak < 30) return "🚀";
    return "👑";
  };

  const getMotivationalMessage = (streak: number) => {
    if (streak === 0) return "Start your streak today!";
    if (streak === 1) return "Great start! Keep it going!";
    if (streak < 7) return `${streak} days strong! 💪`;
    if (streak < 14) return `Amazing! ${streak} days of dedication!`;
    if (streak < 30) return `Incredible! ${streak} days streak!`;
    return `LEGENDARY! ${streak} days of pure dedication!`;
  };

  const totalActiveDays = new Set(
    workouts.map((workout) => workout.date.split("T")[0])
  ).size;

  return (
    <div className="streaks-card">
      <h3 className="streaks-header">🔥 Workout Streaks</h3>
      <div className="streak-number">
        {getStreakEmoji(currentStreak)} {currentStreak} days
      </div>
      <div className="streak-message">
        {getMotivationalMessage(currentStreak)}
      </div>
      <div className="streak-stats">Total active days: {totalActiveDays}</div>
    </div>
  );
};

export default Streaks;
