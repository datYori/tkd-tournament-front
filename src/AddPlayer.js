import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Ensure you import the CSS file
import { apiUrl, authToken } from './config';

const AddPlayer = () => {
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState('');
  const [weightCategory, setWeightCategory] = useState('');
  const [ageCategory, setAgeCategory] = useState('');
  const [kupCategory, setKupCategory] = useState('');
  const [gender, setGender] = useState('');
  const [team, setTeam] = useState('');

  const navigate = useNavigate();

  const fetchParticipants = () => {
    console.log(`Fetching participants from ${apiUrl}/api/participants with token ${authToken}`);
    fetch(`${apiUrl}/api/participants`, {
      headers: {
        'X-Auth-Token': authToken,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
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

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${apiUrl}/api/participants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': authToken,
      },
      body: JSON.stringify({ name, ageCategory, weightCategory, gender, kupCategory, team }), // Added team field
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
        setTeam('');
        fetchParticipants(); // Trigger the refresh of the participant list
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const weightCategories = [
    '-20kg', '-22kg', '-24kg', '-26kg', '-28kg', '-29kg', '-30kg', '-32kg', '-33kg', '-35kg', '-37kg', '-38kg', '-41kg',
    '-42kg', '-44kg', '-45kg', '-46kg', '-47kg', '-48kg', '-49kg', '-51kg', '-52kg', '-53kg', '-54kg', '-55kg', '-57kg',
    '-58kg', '-59kg', '-61kg', '-62kg', '-63kg', '-65kg', '-67kg', '-68kg', '-73kg', '-74kg', '-78kg', '-80kg', '-87kg',
    '+41kg', '+53kg', '+59kg', '+65kg', '+67kg', '+68kg', '+73kg', '+78kg', '+80kg', '+87kg'
  ];

  const ageCategories = ['Benjamins', 'Minims', 'Cadette', 'Junior', 'Senior'];
  const kupCategories = ['A', 'B'];
  const genders = ['M', 'F'];

  return (
    <div className="add-participant-container">
      <h2 className="h2-heading">Add Participant</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="add-participant-form">
          <div className="form-group">
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Age Category:
              <select value={ageCategory} onChange={(e) => setAgeCategory(e.target.value)} required>
                <option value="" disabled>Select Age Category</option>
                {ageCategories.map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              Weight Category:
              <select value={weightCategory} onChange={(e) => setWeightCategory(e.target.value)} required>
                <option value="" disabled>Select Weight Category</option>
                {weightCategories.map(weight => (
                  <option key={weight} value={weight}>{weight}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              Gender:
              <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="" disabled>Select Gender</option>
                {genders.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              Kup Category:
              <select value={kupCategory} onChange={(e) => setKupCategory(e.target.value)} required>
                <option value="" disabled>Select Kup Category</option>
                {kupCategories.map(kup => (
                  <option key={kup} value={kup}>{kup}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              Team:
              <input
                type="text"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit" className="submit-button">Add Participant</button>
        </form>
      </div>
    </div>
  );
};

export default AddPlayer;
