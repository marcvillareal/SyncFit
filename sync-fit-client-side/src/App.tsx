import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import "./App.css";

// Lazy load pages for better performance
const WorkoutsList = React.lazy(() => import("./pages/WorkoutsList"));
const AddWorkout = React.lazy(() => import("./pages/AddWorkout"));
const Progress = React.lazy(() => import("./pages/Progress"));
const WorkoutDetail = React.lazy(() => import("./pages/WorkoutDetail"));

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <main className="main-content">
          <Suspense fallback={
            <div className="loading-page">
              <div className="loading-spinner"></div>
              <p>Loading...</p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<WorkoutsList />} />
              <Route path="/workouts" element={<WorkoutsList />} />
              <Route path="/workout/:id" element={<WorkoutDetail />} />
              <Route path="/add" element={<AddWorkout />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
