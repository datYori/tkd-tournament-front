import React, { useState } from 'react';
import BulkAddPlayerForm from './BulkAddPlayerForm';

const AddPlayerForm = ({ onParticipantAdded }) => {
  const [name, setName] = useState('');
  const [weightCategory, setWeightCategory] = useState('');
  const [ageCategory, setAgeCategory] = useState('');
  const [kupCategory, setKupCategory] = useState('');
  const [gender, setGender] = useState('');
  const [bulkAdd, setBulkAdd] = useState(false);

  const weightCategories = [
    '-20kg', '-22kg', '-24kg', '-26kg', '-28kg', '-29kg', '-30kg', '-32kg', '-33kg', '-35kg', '-37kg', '-38kg', '-41kg',
    '-42kg', '-44kg', '-45kg', '-46kg', '-47kg', '-48kg', '-49kg', '-51kg', '-52kg', '-53kg', '-54kg', '-55kg', '-57kg',
    '-58kg', '-59kg', '-61kg', '-62kg', '-63kg', '-65kg', '-67kg', '-68kg', '-73kg', '-74kg', '-78kg', '-80kg', '-87kg',
    '+41kg', '+53kg', '+59kg', '+65kg', '+67kg', '+68kg', '+73kg', '+78kg', '+80kg', '+87kg'
  ];

  const ageCategories = ['Benjamins', 'Minims', 'Cadette', 'Junior', 'Senior'];
  const kupCategories = ['A', 'B'];
  const genders = ['M', 'F'];

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/api/participants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, ageCategory, weightCategory, gender, kupCategory }),
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
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Age Category:
            <select value={ageCategory} onChange={(e) => setAgeCategory(e.target.value)} required>
              <option value="" disabled>Select Age Category</option>
              {ageCategories.map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </label>
          <label>
            Weight Category:
            <select value={weightCategory} onChange={(e) => setWeightCategory(e.target.value)} required>
              <option value="" disabled>Select Weight Category</option>
              {weightCategories.map(weight => (
                <option key={weight} value={weight}>{weight}</option>
              ))}
            </select>
          </label>
          <label>
            Gender:
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="" disabled>Select Gender</option>
              {genders.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>
          <label>
            Kup Category:
            <select value={kupCategory} onChange={(e) => setKupCategory(e.target.value)} required>
              <option value="" disabled>Select Kup Category</option>
              {kupCategories.map(kup => (
                <option key={kup} value={kup}>{kup}</option>
              ))}
            </select>
          </label>
          <button type="submit">Add Participant</button>
        </form>
      )}
    </div>
  );
};

export default AddPlayerForm;
