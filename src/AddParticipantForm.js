import React, { useState } from 'react';

const AddParticipantForm = ({ onParticipantAdded }) => {
  const [name, setName] = useState('');
  const [weightCategory, setWeightCategory] = useState('');
  const [ageCategory, setAgeCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/participants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, weightCategory, ageCategory }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      setName(''); // Reset the input field after successful submission
      setWeightCategory('');
      setAgeCategory('');
      onParticipantAdded(); // Trigger the refresh of the participant list
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Weight Category:
        <input
          type="text"
          value={weightCategory}
          onChange={(e) => setWeightCategory(e.target.value)}
          required
        />
      </label>
      <label>
        Age Category:
        <input
          type="text"
          value={ageCategory}
          onChange={(e) => setAgeCategory(e.target.value)}
          required
        />
      </label>
      <button type="submit">Add Participant</button>
    </form>
  );
};

export default AddParticipantForm;
