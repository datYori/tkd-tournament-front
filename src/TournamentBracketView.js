import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TournamentBracket from 'react-svg-tournament-bracket';
import apiUrl from './config';

const TournamentBracketView = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/tournaments/${tournamentId}`);
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

  const handleSelectTeam = async (match, team) => {
    try {
      const winner = team === 'home' ? match.homeTeamName : match.awayTeamName;
      const response = await fetch(`${apiUrl}/api/tournaments/${tournamentId}/matches/${match.matchNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': authToken,
        },
        body: JSON.stringify({ winner }),
      });

      if (!response.ok) {
        throw new Error('Failed to update tournament');
      }

      const updatedTournament = await response.json();
      setTournament(updatedTournament);
    } catch (error) {
      console.error('Error updating tournament:', error);
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
          <TournamentBracket matches={tournament.matches} onSelectTeam={handleSelectTeam} />
        </>
      ) : <p>No tournament details available.</p>}
    </div>
  );
};

export default TournamentBracketView;
