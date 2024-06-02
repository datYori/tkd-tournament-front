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

  return (
    <div>
      <h2>Add Participant</h2>
      <button onClick={() => navigate('/bulk-upload')}>Bulk Upload</button>
      <button onClick={() => navigate('/manual-csv-input')}>Manual CSV Input</button>
      <AddPlayerForm onParticipantAdded={fetchParticipants} />
    </div>
  );
};

export default AddPlayer;
