import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TournamentBracket from 'react-svg-tournament-bracket';

const TournamentBracketView = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWinners, setSelectedWinners] = useState({});

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tournaments/${tournamentId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTournament(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId]);

  const handleCheckboxChange = (matchId, team) => {
    setSelectedWinners(prevState => ({
      ...prevState,
      [matchId]: team,
    }));
  };

  const handleValidate = async () => {
    try {
      const updatedMatches = tournament.matches.map(match => {
        if (selectedWinners[match.id]) {
          return { ...match, result: { winner: selectedWinners[match.id] } };
        }
        return match;
      });

      // Propagate winners to next matches
      updatedMatches.forEach(match => {
        const nextMatch = updatedMatches.find(m => m.id === match.nextMatch);
        if (nextMatch && match.result?.winner) {
          if (nextMatch.participant === match.participant) {
            nextMatch.participant = match.result.winner;
          } else if (nextMatch.opponent === match.opponent) {
            nextMatch.opponent = match.result.winner;
          }
        }
      });

      // Send update to the backend
      const response = await fetch(`http://localhost:3000/api/tournaments/${tournamentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matches: updatedMatches }),
      });

      if (!response.ok) {
        throw new Error('Failed to update tournament');
      }

      const updatedTournament = await response.json();
      setTournament(updatedTournament); // Update state with new tournament data
    } catch (error) {
      console.error('Error updating tournament:', error);
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const matches = tournament.matches.map(match => ({
    homeTeamName: match.participant,
    awayTeamName: match.opponent,
    round: match.round,
    matchNumber: match.id,
    homeTeamScore: selectedWinners[match.id] === match.participant ? 1 : 0,
    awayTeamScore: selectedWinners[match.id] === match.opponent ? 1 : 0,
    matchComplete: !!selectedWinners[match.id],
    matchAccepted: !!selectedWinners[match.id],
  }));

  return (
    <div>
      {tournament ? (
        <>
          <h2>Tournament Details</h2>
          <div>
            <strong>Category: </strong>{tournament.weightCategory} / {tournament.ageCategory} / {tournament.gender} / {tournament.kupCategory}
            <br />
            <strong>Status: </strong>{tournament.status}
            <br />
            <strong>Start Date: </strong>{new Date(tournament.startDate).toLocaleDateString()}
          </div>
          <h3>Matches</h3>
          <TournamentBracket matches={matches} />
          <div>
            {tournament.matches.map(match => (
              <div key={match.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedWinners[match.id] === match.participant}
                    onChange={() => handleCheckboxChange(match.id, match.participant)}
                  />
                  {match.participant}
                </label>
                {' vs '}
                <label>
                  <input
                    type="checkbox"
                    checked={selectedWinners[match.id] === match.opponent}
                    onChange={() => handleCheckboxChange(match.id, match.opponent)}
                  />
                  {match.opponent}
                </label>
              </div>
            ))}
          </div>
          <button onClick={handleValidate}>Validate</button>
        </>
      ) : <p>No tournament details available.</p>}
    </div>
  );
};

export default TournamentBracketView;
