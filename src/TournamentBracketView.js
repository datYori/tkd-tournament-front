import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bracket, RoundProps } from '@pawix/react-brackets';
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
        console.log(data); // Log the fetched tournament data
        setTournament(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Ensure rounds property exists
  if (!tournament || !tournament.rounds) return <div>No rounds available</div>;

  const rounds: RoundProps[] = tournament.rounds;

  return (
    <div>
      <h2>Tournament Details</h2>
      <div>
        <strong>Category: </strong>{tournament.weightCategory} / {tournament.ageCategory} / {tournament.gender} / {tournament.kupCategory}
        <br />
        <strong>Status: </strong>{tournament.status}
        <br />
        <strong>Start Date: </strong>{new Date(tournament.startDate).toLocaleDateString()}
      </div>
      <h3>Matches</h3>
      <div className="bracket-container">
        <Bracket rounds={rounds} />
      </div>
    </div>
  );
};

export default TournamentBracketView;
