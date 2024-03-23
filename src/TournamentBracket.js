import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const TournamentBracket = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/matches')
      .then((response) => response.json())
      .then(setMatches);

    socket.on('matchUpdated', (data) => {
      setMatches((currentMatches) =>
        currentMatches.map((match) =>
          match._id === data.matchId ? { ...match, winner: data.winner } : match
        )
      );
    });

    return () => socket.off('matchUpdated');
  }, []);

  const handleWinnerSelection = (matchId, winner) => {
    fetch(`http://localhost:3000/api/matches/${matchId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ winner }),
    });
  };

  return (
    <div>
      {matches.map((match) => (
        <div key={match._id}>
          <div>{match.participants.join(' vs ')}</div>
          <button onClick={() => handleWinnerSelection(match._id, match.participants[0])}>
            {match.participants[0]}
          </button>
          <button onClick={() => handleWinnerSelection(match._id, match.participants[1])}>
            {match.participants[1]}
          </button>
          <div>Winner: {match.winner}</div>
        </div>
      ))}
    </div>
  );
};

export default TournamentBracket;
