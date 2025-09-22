import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          💪 SyncFit
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Workouts
          </Link>
          <Link 
            to="/add" 
            className={location.pathname === '/add' ? 'nav-link active' : 'nav-link'}
          >
            Add Workout
          </Link>
          <Link 
            to="/progress" 
            className={location.pathname === '/progress' ? 'nav-link active' : 'nav-link'}
          >
            Progress
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;