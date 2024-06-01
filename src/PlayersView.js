import React, { useEffect, useState } from 'react';
import PlayersTable from './PlayersTable';

const PlayersView = () => {
  const [participants, setParticipants] = useState([]);

  const fetchParticipants = () => {
    fetch('http://localhost:3000/api/participants')
      .then(response => response.json())
      .then(data => setParticipants(data))
      .catch(error => console.error('Error fetching participants:', error));
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/api/participants/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(() => {
      fetchParticipants(); // Refresh the list after deleting
    })
    .catch(error => {
      console.error('Error deleting participant:', error);
    });
  };

  const handleUpdate = (id, updatedData) => {
    fetch(`http://localhost:3000/api/participants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })
    .then(response => response.json())
    .then(() => {
      fetchParticipants(); // Refresh the list after updating
    })
    .catch(error => {
      console.error('Error updating participant:', error);
    });
  };

  return (
    <div>
      <h2 className="h2-heading">Tournament View</h2>
      <h3 className="h2-heading">Participants</h3>
      <PlayersTable
        participants={participants}
        showDeleteButton={true}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default PlayersView;
