import React, { useEffect, useState } from 'react';
import PlayersTable from './PlayersTable';
import { apiUrl, authToken } from './config';

const PlayersView = () => {
  const [participants, setParticipants] = useState([]);
  const [filteredCount, setFilteredCount] = useState(0);

  const fetchParticipants = () => {
    fetch(`${apiUrl}/api/participants`, {
      headers: {
        'X-Auth-Token': authToken,
      },
    })
      .then(response => response.json())
      .then(data => setParticipants(data))
      .catch(error => console.error('Error fetching participants:', error));
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleDelete = (id) => {
    fetch(`${apiUrl}/api/participants/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Auth-Token': authToken,
      },
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
    fetch(`${apiUrl}/api/participants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': authToken,
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
      <h4 className="h4-heading">(Total: {participants.length})</h4>
      <h4 className="h4-heading">(Selected: {filteredCount})</h4>
      <PlayersTable
        participants={participants}
        showDeleteButton={true}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onFilteredCountChange={setFilteredCount} // Pass the function to update the filtered count
      />
    </div>
  );
};

export default PlayersView;
