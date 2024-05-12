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
    // API endpoint adjusted for new parameters
    fetch(`http://localhost:3000/api/generate-bracket/${weightCategory}/${ageCategory}/${gender}/${kupCategory}`, { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to generate bracket');
        }
        return response.json();
      })
      .then(matches => {
        // Navigate to the bracket view page with the new URL structure
        navigate(`/tournament-bracket/${weightCategory}/${ageCategory}/${gender}/${kupCategory}`);
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
