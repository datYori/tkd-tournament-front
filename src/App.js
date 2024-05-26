import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import AddPlayer from './AddPlayer';
import TournamentView from './TournamentView';
import TournamentBracketView from './TournamentBracketView';
import GenerateTournament from './GenerateTournament';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/addplayer"><button>Add Participant</button></Link>
          <Link to="/view"><button>View</button></Link>
          <Link to="/generate-tournament"><button>Generate</button></Link>

          <Routes>
            <Route path="/addplayer" element={<AddPlayer />} />
            <Route path="/view" element={<TournamentView />} />
            <Route path="/generate-tournament" element={<GenerateTournament />} />
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
