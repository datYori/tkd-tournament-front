import React, { useState } from 'react';
import Papa from 'papaparse';

const BulkAddPlayerForm = ({ onParticipantAdded }) => {
  const [file, setFile] = useState(null);
  const [fileValid, setFileValid] = useState(false);
  const [validationInProgress, setValidationInProgress] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [manualInput, setManualInput] = useState('');
  const [manualValid, setManualValid] = useState(false);
  const [errors, setErrors] = useState([]);

  const validateData = (data) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    const weightCategoryRegex = /^[+-]\d{2}$/;
    const ageCategoryRegex = /^(Benjamins|Minims|Cadette|Junior|Senior)$/;
    const kupCategoryRegex = /^[A-B]$/;
    const genderRegex = /^[MF]$/;

    const errors = [];

    const valid = data.map((row, index) => {
      const rowErrors = [];
      if (!nameRegex.test(row.Name)) rowErrors.push("Invalid name");
      if (!weightCategoryRegex.test(row["Weight Category"])) rowErrors.push("Invalid weight category");
      if (!ageCategoryRegex.test(row["Age Category"])) rowErrors.push("Invalid age category");
      if (!kupCategoryRegex.test(row["Kup Category"])) rowErrors.push("Invalid kup category");
      if (!genderRegex.test(row.Gender)) rowErrors.push("Invalid gender");

      if (rowErrors.length > 0) {
        errors.push({ line: index + 2, errors: rowErrors }); // +2 for header and 1-based index
      }

      return rowErrors.length === 0;
    }).every(valid => valid);

    setErrors(errors);
    return valid;
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleManualInputChange = (e) => {
    const input = e.target.value;
    setManualInput(input);

    const parsedData = Papa.parse(input, { header: true }).data;
    const isValid = validateData(parsedData);
    setManualValid(isValid);
    if (isValid) {
      setParticipants(parsedData);
    } else {
      setParticipants([]);
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (file) {
      setValidationInProgress(true);
      Papa.parse(file, {
        header: true,
        complete: function (results) {
          const isValid = validateData(results.data);
          setFileValid(isValid);
          setValidationInProgress(false);
          if (isValid) {
            setParticipants(results.data);
          } else {
            setParticipants([]);
          }
        },
      });
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

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (fileValid) {
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
      <h3>Bulk Add Participants</h3>
      <p>Expected CSV Format: Name,Age Category,Weight Category,Gender,Kup Category</p>
      <p>Example: John Doe,Senior,+75,M,A</p>
      <div>
        <h4>Upload CSV File</h4>
        <form onSubmit={handleFileSubmit}>
          <input type="file" accept=".csv" onChange={handleFileChange} required />
          <button type="submit" disabled={validationInProgress}>Validate</button>
        </form>
        {validationInProgress && <p>Validating...</p>}
        {fileValid && <p>File is valid. You can now add participants.</p>}
        {!fileValid && errors.length > 0 && (
          <div>
            <p>File is invalid. Errors:</p>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>Line {error.line}: {error.errors.join(', ')}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleUploadSubmit}>
          <button type="submit" disabled={!fileValid}>Add Participants</button>
        </form>
      </div>

      <div>
        <h4>Manual CSV Input</h4>
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

export default BulkAddPlayerForm;
