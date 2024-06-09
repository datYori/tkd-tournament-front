import React, { useState } from 'react';
import { parseCSV } from './csvUtils';
import apiUrl from './config';

const BulkUploadForm = ({ onParticipantAdded }) => {
  const [file, setFile] = useState(null);
  const [fileValid, setFileValid] = useState(false);
  const [validationInProgress, setValidationInProgress] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (file) {
      setValidationInProgress(true);
      parseCSV(file, (result) => {
        setValidationInProgress(false);
        setFileValid(result.valid);
        setErrors(result.errors);
        if (result.valid) {
          setParticipants(result.data);
        } else {
          setParticipants([]);
        }
      });
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (fileValid) {
      fetch(`${apiUrl}/api/participants/bulk`, {
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
          if (typeof onParticipantAdded === 'function') {
            onParticipantAdded(); // Trigger the refresh of the participant list
          }
          setParticipants([]); // Clear participants after successful upload
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  return (
    <div>
      <h3>Bulk Add Participants</h3>
      <p>Expected CSV Format: Name,Age Category,Weight Category,Gender,Kup Category,Team</p>
      <p>Example: John Doe,Senior,+87kg,M,B,Team A</p>
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
                <th>Team</th> {/* Added team column */}
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
                  <td>{participant.Team}</td> {/* Added team field */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BulkUploadForm;
