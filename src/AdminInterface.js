import React, { useEffect, useState } from 'react';
import AddParticipantForm from './AddParticipantForm';
import ParticipantTable from './ParticipantTable';
import { useNavigate } from 'react-router-dom';

const AdminInterface = () => {
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

  // Function to generate unique tuples based on multiple categories
  const uniqueTuples = participants.reduce((acc, participant) => {
    const key = `${participant.weightCategory}/${participant.ageCategory}/${participant.gender}/${participant.kupCategory}`;
    if (!acc[key]) {
      acc[key] = {
        weightCategory: participant.weightCategory,
        ageCategory: participant.ageCategory,
        gender: participant.gender,
        kupCategory: participant.kupCategory
      };
    }
    return acc;
  }, {});

  const handleGenerateBracket = (weightCategory, ageCategory, gender, kupCategory) => {
    // Using the adjusted API endpoint and sending data as JSON in the request body
    fetch(`http://localhost:3000/api/tournaments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ weightCategory, ageCategory, gender, kupCategory })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to generate bracket');
      }
      return response.json();
    })
    .then(tournament => {
      // Navigate to the bracket view page with the new tournament details
      navigate(`/tournament-bracket/${tournament._id}`); // Use the generated tournament ID for navigation
    })
    .catch(error => {
      console.error('Error generating bracket:', error);
    });
  };


  return (
    <div>
      <h2>Admin Interface</h2>
      <AddParticipantForm onParticipantAdded={fetchParticipants} />
      <ParticipantTable participants={participants} onDelete={handleDelete} showDeleteButton={true} />
      <div>
        <h3>Generate Brackets</h3>
        {Object.values(uniqueTuples).map((tuple, index) => (
          <button
            key={index}
            onClick={() => handleGenerateBracket(tuple.weightCategory, tuple.ageCategory, tuple.gender, tuple.kupCategory)}>
            Generate bracket for {tuple.weightCategory} / {tuple.ageCategory} / {tuple.gender} / {tuple.kupCategory}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminInterface;
