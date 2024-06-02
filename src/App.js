import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import AddPlayer from './AddPlayer';
import PlayersView from './PlayersView';
import TournamentBracketView from './TournamentBracketView';
import GenerateTournament from './GenerateTournament';
import BulkUploadForm from './BulkUploadForm';
import ManualCSVInput from './ManualCSVInput';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav className="navigation">
            <Link to="/addplayer"><button>Add Participant</button></Link>
            <Link to="/participants"><button>Participants</button></Link>
            <Link to="/generate-tournament"><button>Generate</button></Link>
          </nav>
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/addplayer" element={<AddPlayer />} />
            <Route path="/participants" element={<PlayersView />} />
            <Route path="/generate-tournament" element={<GenerateTournament />} />
            <Route path="/tournament-bracket/:tournamentId" element={<TournamentBracketView />} />
            <Route path="/bulk-upload" element={<BulkUploadForm />} />
            <Route path="/manual-csv-input" element={<ManualCSVInput />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
