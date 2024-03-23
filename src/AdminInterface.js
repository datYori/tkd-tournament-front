import React, { useEffect, useState } from 'react';
import AddParticipantForm from './AddParticipantForm';

const AdminInterface = () => {
  const [participants, setParticipants] = useState([]);

  const fetchParticipants = () => {
    fetch('http://localhost:3000/api/participants')
      .then((response) => response.json())
      .then((data) => {
        setParticipants(data);
      })
      .catch((error) => {
        console.error('Error fetching participants:', error);
      });
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <div>
      <h2>Admin Interface</h2>
      <AddParticipantForm onParticipantAdded={fetchParticipants} />
      <ul>
        {participants.map((participant) => (
          <li key={participant._id}>{participant.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminInterface;
