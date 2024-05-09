import React, { useEffect, useState } from 'react';
import AddParticipantForm from './AddParticipantForm';
import ParticipantTable from './ParticipantTable';  // Import the reusable table component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const AdminInterface = () => {
  const [participants, setParticipants] = useState([]);
  const navigate = useNavigate(); // Hook for programmatically navigating

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

  // Extract unique pairs of weight and age categories
  const uniquePairs = participants.reduce((acc, participant) => {
    const key = `${participant.weightCategory}/${participant.ageCategory}`;
    if (!acc[key]) {
      acc[key] = { weight: participant.weightCategory, age: participant.ageCategory };
    }
    return acc;
  }, {});

  // Function to handle bracket generation and navigation
  const handleGenerateBracket = (weight, age) => {
    // Trigger bracket generation on the server
    fetch(`http://localhost:3000/api/generate-bracket/${weight}/${age}`, { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to generate bracket');
        }
        return response.json();
      })
      .then(matches => {
        // Navigate to the bracket view page
        navigate(`/tournament-bracket/${weight}/${age}`);
      })
      .catch(error => {
        console.error('Error generating bracket:', error);
      });
  };

  return (
    <div>
      <h2>Admin Interface</h2>
      <AddParticipantForm onParticipantAdded={fetchParticipants} />
      <ParticipantTable participants={participants} />
      <div>
        <h3>Generate Brackets</h3>
        {Object.values(uniquePairs).map((pair, index) => (
          <button key={index} onClick={() => handleGenerateBracket(pair.weight, pair.age)}>
            Generate bracket for {pair.weight} / {pair.age}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminInterface;
