import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import AdminInterface from './AdminInterface';
import TournamentView from './TournamentView';
import TournamentBracketView from './TournamentBracketView'; // Import the new component

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
            // Updated to use tournament ID for bracket navigation
            <Route path="/tournament-bracket/:tournamentId" element={<TournamentBracketView />} />
            {/* Add more routes as needed */}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
