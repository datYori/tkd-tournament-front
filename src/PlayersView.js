import React, { useEffect, useState } from 'react';
import PlayersTable from './PlayersTable';
import apiUrl from './config';

const PlayersView = () => {
  const [participants, setParticipants] = useState([]);
  const [filteredCount, setFilteredCount] = useState(0);

  const fetchParticipants = () => {
    fetch(`${apiUrl}/api/participants`)
      .then(response => response.json())
      .then(data => setParticipants(data))
      .catch(error => console.error('Error fetching participants:', error));
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <div>
      <h2 className="h2-heading">Tournament View</h2>
      <h3 className="h2-heading">Participants</h3>
      <h4 className="h4-heading">(Total: {participants.length})</h4>
      <h4 className="h4-heading">(Selected: {filteredCount})</h4>
      <PlayersTable
        participants={participants}
        onFilteredCountChange={setFilteredCount} // Pass the function to update the filtered count
      />
    </div>
  );
};

export default PlayersView;
