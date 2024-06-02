import React, { useState } from 'react';
import BulkAddPlayerForm from './BulkAddPlayerForm';

const AddPlayerForm = ({ onParticipantAdded }) => {
  const [name, setName] = useState('');
  const [weightCategory, setWeightCategory] = useState('');
  const [ageCategory, setAgeCategory] = useState('');
  const [kupCategory, setKupCategory] = useState('');
  const [gender, setGender] = useState('');
  const [bulkAdd, setBulkAdd] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:3000/api/participants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, weightCategory, ageCategory, kupCategory, gender }),
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
        setKupCategory('');
        setGender('');
        onParticipantAdded(); // Trigger the refresh of the participant list
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <button onClick={() => setBulkAdd(!bulkAdd)}>
        {bulkAdd ? 'Switch to Single Add' : 'Switch to Bulk Add'}
      </button>
      {bulkAdd ? (
        <BulkAddPlayerForm onParticipantAdded={onParticipantAdded} />
      ) : (
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
              onChange={(e) => setKupCategory(e.target.value)}
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
      )}
    </div>
  );
};

export default AddPlayerForm;
