import React, { useState } from 'react';
import Papa from 'papaparse';

const ManualCSVInput = ({ onParticipantAdded }) => {
  const [manualInput, setManualInput] = useState('');
  const [manualValid, setManualValid] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [errors, setErrors] = useState([]);

  const expectedHeaders = ['Name', 'Age Category', 'Weight Category', 'Gender', 'Kup Category'];

  const trimAndNormalize = (data) => {
    return data.map(row => ({
      Name: row.Name ? row.Name.trim() : '',
      "Age Category": row["Age Category"] ? row["Age Category"].trim() : '',
      "Weight Category": row["Weight Category"] ? row["Weight Category"].trim() : '',
      Gender: row.Gender ? row.Gender.trim() : '',
      "Kup Category": row["Kup Category"] ? row["Kup Category"].trim() : '',
    }));
  };

  const formatData = (data) => {
    return data.map(row => ({
      Name: row.Name,
      "Age Category": row["Age Category"].charAt(0).toUpperCase() + row["Age Category"].slice(1).toLowerCase(),
      "Weight Category": row["Weight Category"],
      Gender: row.Gender.toUpperCase(),
      "Kup Category": row["Kup Category"].toUpperCase(),
    }));
  };

  const validateData = (data) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const weightCategoryRegex = /^[+-]\d{2}kg$/i;
    const ageCategoryRegex = /^(Benjamins|Minims|Cadette|Junior|Senior)$/i;
    const kupCategoryRegex = /^[A-B]$/i;
    const genderRegex = /^[MF]$/i;

    const errors = [];

    const valid = data.map((row, index) => {
      const rowErrors = [];
      if (!nameRegex.test(row.Name)) rowErrors.push("The name should contain only letters and spaces.");
      if (!weightCategoryRegex.test(row["Weight Category"])) rowErrors.push("The weight category should be in the form '+/-XXkg' (e.g., -20kg, +87kg).");
      if (!ageCategoryRegex.test(row["Age Category"])) rowErrors.push("The age category should be one of: Benjamins, Minims, Cadette, Junior, Senior.");
      if (!kupCategoryRegex.test(row["Kup Category"])) rowErrors.push("The kup category should be either 'A' or 'B'.");
      if (!genderRegex.test(row.Gender)) rowErrors.push("The gender should be 'M' for male or 'F' for female.");

      if (rowErrors.length > 0) {
        errors.push({ line: index + 2, errors: rowErrors }); // +2 for header and 1-based index
      }

      return rowErrors.length === 0;
    }).every(valid => valid);

    setErrors(errors);
    return valid;
  };

  const handleManualInputChange = (e) => {
    const input = e.target.value;
    setManualInput(input);

    const parsedData = Papa.parse(input, { header: true }).data;
    const normalizedData = trimAndNormalize(parsedData).filter(row => Object.values(row).some(val => val));
    const isValid = validateData(normalizedData);
    setManualValid(isValid);
    if (isValid) {
      setParticipants(formatData(normalizedData));
    } else {
      setParticipants([]);
    }
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
