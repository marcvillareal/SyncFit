import React from "react";
import { Workout } from "../types";

interface StreaksProps {
  workouts: Workout[];
}

const calculateCurrentStreak = (workouts: Workout[]): number => {
  if (workouts.length === 0) {
    return 0;
  }

  const workoutDates = workouts
    .map((workout) => workout.date.split("T")[0])
    .filter((date, index, array) => array.indexOf(date) === index)
    .sort();

  const now = new Date();
  const today =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  const lastWorkoutDate = workoutDates[workoutDates.length - 1];

  const lastDate = new Date(lastWorkoutDate + "T00:00:00");
  const todayDate = new Date(today + "T00:00:00");

  const daysDiff = Math.floor(
    (lastDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff < -1 || daysDiff > 7) {
    return 0;
  }

  let streak = 1;

  for (let i = workoutDates.length - 2; i >= 0; i--) {
    const current = new Date(workoutDates[i] + "T00:00:00");
    const next = new Date(workoutDates[i + 1] + "T00:00:00");

    const diffDays = Math.floor(
      (next.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
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
