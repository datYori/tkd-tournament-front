import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.css';
import PlayersView from './PlayersView';
import TournamentBracketView from './TournamentBracketView';
import GenerateTournament from './GenerateTournament';

function App() {
  return (
    <Router>
      <Helmet>
        <title>Open Malley 2024</title>
      </Helmet>
      <div className="App">
        <header className="App-header">
          <nav className="navigation">
            <Link to="/participants"><button>Participants</button></Link>
            <Link to="/generate-tournament"><button>Tournament Brackets</button></Link>
          </nav>
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/participants" element={<PlayersView />} />
            <Route path="/generate-tournament" element={<GenerateTournament />} />
            <Route path="/tournament-bracket/:tournamentId" element={<TournamentBracketView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
