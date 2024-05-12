import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TournamentBracketView = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        console.log(`Fetching tournament details for ID: ${tournamentId}`); // Debugging log
        const response = await fetch(`http://localhost:3000/api/tournaments/${tournamentId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched tournament:', data); // Debugging log
        setTournament(data);
      } catch (err) {
        console.error('Error while fetching tournament:', err); // More explicit error logging
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId]);

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
          {tournament.matches && tournament.matches.length > 0 ? (
            <ul>
              {tournament.matches.map(match => (
                <li key={match._id || match.id}>
                  {match.participant} vs {match.opponent} - Winner: {match.result && match.result.winner ? match.result.winner : "TBD"}
                </li>
              ))}
            </ul>
          ) : <p>No matches have been scheduled for this tournament.</p>}
        </>
      ) : <p>No tournament details available.</p>}
    </div>
  );
};

export default TournamentBracketView;
