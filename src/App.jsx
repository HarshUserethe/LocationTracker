import React, { useState } from 'react';
import LocationsList from './LocationsList';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [page, setPage] = useState('list');

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">Location Tracker</h1>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${page === 'list' ? 'active' : ''}`}
            onClick={() => setPage('list')}
          >
            Nearby Locations
          </button>
          <button
            className={`nav-tab ${page === 'dashboard' ? 'active' : ''}`}
            onClick={() => setPage('dashboard')}
          >
            Manage Locations
          </button>
        </div>
      </div>
      
      {page === 'list' ? <LocationsList /> : <Dashboard />}
    </div>
  );
}

export default App;