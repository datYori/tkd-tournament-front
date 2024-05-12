import React, { useState } from 'react';

const AddParticipantForm = ({ onParticipantAdded }) => {
  const [name, setName] = useState('');
  const [weightCategory, setWeightCategory] = useState('');
  const [ageCategory, setAgeCategory] = useState('');
  const [kupCategory, setkupCategory] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/participants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, weightCategory, ageCategory, kupCategory, gender}),
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
        Name ({'First name Last name'}):
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Weight Category ({'-/+ kg'}):
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
      <label>
        Kup Category ({'>=3rd kup = A / 8-4th kup = B'}):
        <input
          type="text"
          value={kupCategory}
          onChange={(e) => setkupCategory(e.target.value)}
          required
        />
      </label>
      <label>
        Gender ({'M / F'}):
        <input
          type="text"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        />
      </label>
      <button type="submit">Add Participant</button>
    </form>
  );
};

export default AddParticipantForm;
