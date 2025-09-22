import React, { useState, useEffect } from "react";
import { workoutService } from "../services/workoutService";
import type { WeeklyStats } from "../types";

const Progress: React.FC = () => {
  const [stats, setStats] = useState<WeeklyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState("last4w");

  useEffect(() => {
    loadStats();
  }, [range]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await workoutService.getWeeklyStats(range);
      setStats(data);
      setError(null);
    } catch (err) {
      setError("Failed to load progress data");
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading progress data...</div>;
  }

  return (
    <div className="progress-page">
      <div className="page-header">
        <h1>Your Progress</h1>

        <label htmlFor="range-selector" className="visually-hidden">
          Select time range
        </label>
        <select
          id="range-selector"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="range-selector"
        >
          <option value="last4w">Last 4 weeks</option>
          <option value="last8w">Last 8 weeks</option>
          <option value="last12w">Last 12 weeks</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {stats.length === 0 ? (
        <div className="empty-state">
          <p>No workout data found for the selected period.</p>
        </div>
      ) : (
        <div className="stats-container">
          <div className="stats-summary">
            <div className="summary-card">
              <h3>Total Weeks</h3>
              <div className="summary-value">{stats.length}</div>
            </div>

            <div className="summary-card">
              <h3>Total Workouts</h3>
              <div className="summary-value">
                {stats.reduce((sum, week) => sum + week.totalWorkouts, 0)}
              </div>
            </div>

            <div className="summary-card">
              <h3>Total Volume</h3>
              <div className="summary-value">
                {stats.reduce((sum, week) => sum + week.volume, 0).toFixed(1)}{" "}
                kg
              </div>
            </div>

            <div className="summary-card">
              <h3>Avg Volume/Week</h3>
              <div className="summary-value">
                {(
                  stats.reduce((sum, week) => sum + week.volume, 0) /
                  stats.length
                ).toFixed(1)}{" "}
                kg
              </div>
            </div>
          </div>

          <div className="weekly-breakdown">
            <h2>Weekly Breakdown</h2>

            <div className="stats-grid">
              {stats.map((week) => (
                <div key={week.week} className="week-card">
                  <div className="week-header">
                    <h4>{week.week}</h4>
                  </div>

                  <div className="week-stats">
                    <div className="stat-item">
                      <span className="label">Workouts:</span>
                      <span className="value">{week.totalWorkouts}</span>
                    </div>

                    <div className="stat-item">
                      <span className="label">Volume:</span>
                      <span className="value">{week.volume.toFixed(1)} kg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-placeholder">
            <h2>Volume Chart</h2>
            <div className="simple-chart">
              {stats.map((week, index) => (
                <div key={week.week} className="chart-bar">
                  <div
                    className="bar"
                    style={{
                      height: `${Math.max(
                        10,
                        (week.volume /
                          Math.max(...stats.map((s) => s.volume))) *
                          100
                      )}px`,
                    }}
                  ></div>
                  <div className="bar-label">{week.week.split("-W")[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
