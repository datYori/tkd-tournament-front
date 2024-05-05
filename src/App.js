import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import AdminInterface from './AdminInterface';
import TournamentView from './TournamentView';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/admin"><button>Admin</button></Link>
          <Link to="/view"><button>View</button></Link>

          <Routes>
            <Route path="/admin" element={<AdminInterface />} />
            <Route path="/view" element={<TournamentView />} />
            {/* Add more routes as needed */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;