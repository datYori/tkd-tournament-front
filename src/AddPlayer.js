import React, { useEffect, useState } from 'react';
import AddPlayerForm from './AddPlayerForm';
import { useNavigate } from 'react-router-dom';

const AddPlayer = () => {
  const [participants, setParticipants] = useState([]);
  const navigate = useNavigate();

  const fetchParticipants = () => {
    fetch('http://localhost:3000/api/participants')
      .then(response => response.json())
      .then(data => {
        setParticipants(data);
      })
      .catch(error => {
        console.error('Error fetching participants:', error);
      });
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

  return (
    <div>
      <h2>Add Participant</h2>
      <AddPlayerForm onParticipantAdded={fetchParticipants} />
    </div>
  );
};

export default AddPlayer;
