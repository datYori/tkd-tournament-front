import React, { useEffect, useState } from 'react';
import ParticipantTable from './ParticipantTable';

const TournamentView = () => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/participants')
      .then(response => response.json())
      .then(data => setParticipants(data))
      .catch(error => console.error('Error fetching participants:', error));
  }, []);

  return (
    <div>
      <h2 className="h2-heading">Tournament View</h2>
      <h3 className="h2-heading">Participants</h3>
      <ParticipantTable participants={participants} showDeleteButton={false} />
    </div>
  );
};

export default TournamentView;
