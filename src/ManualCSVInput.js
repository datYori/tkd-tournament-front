import React, { useState } from 'react';
import { parseCSV } from './csvUtils';

const ManualCSVInput = ({ onParticipantAdded }) => {
  const [manualInput, setManualInput] = useState('');
  const [manualValid, setManualValid] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleManualInputChange = (e) => {
    const input = e.target.value;
    setManualInput(input);

    parseCSV(input, (result) => {
      setManualValid(result.valid);
      setErrors(result.errors);
      if (result.valid) {
        setParticipants(result.data);
      } else {
        setParticipants([]);
      }
    });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualValid) {
      fetch('http://localhost:3000/api/participants/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(participants),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Success:', data);
          onParticipantAdded(); // Trigger the refresh of the participant list
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <div>
      <h3>Manual CSV Input</h3>
      <p>Expected CSV Format: Name,Age Category,Weight Category,Gender,Kup Category</p>
      <p>Example: John Doe,Senior,+87kg,M,B</p>
      <div>
        <textarea value={manualInput} onChange={handleManualInputChange} rows="10" cols="50" />
        {manualValid ? <p>Input is valid.</p> : <p>Invalid input.</p>}
        <form onSubmit={handleManualSubmit}>
          <button type="submit" disabled={!manualValid}>Add Participants</button>
        </form>
      </div>

      {participants.length > 0 && (
        <div>
          <h4>Participants to be added</h4>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age Category</th>
                <th>Weight Category</th>
                <th>Gender</th>
                <th>Kup Category</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr key={index}>
                  <td>{participant.Name}</td>
                  <td>{participant["Age Category"]}</td>
                  <td>{participant["Weight Category"]}</td>
                  <td>{participant.Gender}</td>
                  <td>{participant["Kup Category"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManualCSVInput;
