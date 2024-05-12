import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TournamentBracketView = () => {
  const { weightCategory, age } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        console.log(`Fetching matches for ${weightCategory}/${age}`); // Debugging log
        const response = await fetch(`http://localhost:3000/api/matches/${weightCategory}/${age}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched matches:', data); // Debugging log
        setMatches(data);
      } catch (err) {
        console.error('Error while fetching matches:', err); // More explicit error logging
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [weightCategory, age]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Tournament Bracket for {weightCategory} / {age} </h2>
      {matches.length > 0 ? (
        <ul>
          {matches.map(match => (
            <li key={match._id}>
              {match.participants.join(' vs ')} - Winner: {match.winner || "TBD"}
            </li>
          ))}
        </ul>
      ) : <p>No matches found for this category.</p>}
    </div>
  );
};

export default TournamentBracketView;
