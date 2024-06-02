import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SingleEliminationBracket, Match, SVGViewer } from '@g-loot/react-tournament-brackets';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3000');

const TournamentBracketView = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    fetchTournament();
    socket.on('tournamentUpdate', (data) => {
      if (data.tournamentId === tournamentId) {
        fetchTournament();
      }
    });

    return () => {
      socket.off('tournamentUpdate');
    };
  }, [tournamentId]);

  const fetchTournament = () => {
    fetch(`http://localhost:3000/api/tournaments/${tournamentId}`)
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data.matches)) {
          setTournament(data);
        } else {
          console.error('Tournament data is not valid:', data);
        }
      })
      .catch(error => console.error('Error fetching tournament:', error));
  };

  const handleWinnerSelection = (matchId, winner) => {
    fetch(`http://localhost:3000/api/tournaments/${tournamentId}/matches/${matchId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winner })
    })
    .then(response => response.json())
    .then(data => setTournament(data))
    .catch(error => console.error('Error updating match result:', error));
  };

  if (!tournament) {
    return <div>Loading...</div>;
  }

  const matches = tournament.matches.map(match => ({
    id: match.id,
    name: `Match ${match.id}`,
    nextMatchId: match.nextMatch,
    tournamentRoundText: `Round ${match.round}`,
    startTime: match.startTime || new Date().toISOString(), // Providing a default start time if not present
    state: match.result?.winner ? 'DONE' : 'PENDING', // Example of setting the state
    participants: [
      {
        id: match.participant || 'TBD',
        name: match.participant || 'TBD',
        resultText: match.result?.winner === match.participant ? 'WON' : '',
        isWinner: match.result?.winner === match.participant,
        status: match.result?.winner === match.participant ? 'PLAYED' : 'NO_SHOW'
      },
      {
        id: match.opponent || 'TBD',
        name: match.opponent || 'TBD',
        resultText: match.result?.winner === match.opponent ? 'WON' : '',
        isWinner: match.result?.winner === match.opponent,
        status: match.result?.winner === match.opponent ? 'PLAYED' : 'NO_SHOW'
      }
    ]
  }));

  return (
    <div>
      <h2>Tournament Bracket</h2>
      {matches.length > 0 ? (
        <SingleEliminationBracket
          matches={matches}
          matchComponent={Match}
          svgWrapper={({ children, ...props }) => (
            <SVGViewer width={800} height={600} {...props}>
              {children}
            </SVGViewer>
          )}
          onMatchClick={(match) => {
            const winner = window.prompt('Enter winner name:', '');
            if (winner) {
              handleWinnerSelection(match.id, winner);
            }
          }}
        />
      ) : (
        <p>No matches available</p>
      )}
    </div>
  );
};

export default TournamentBracketView;
