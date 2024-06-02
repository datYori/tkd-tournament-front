import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ManualCSVInput from './ManualCSVInput';
import BulkUploadForm from './BulkUploadForm';

const BulkAddPlayerForm = ({ onParticipantAdded }) => {
  return (
    <Router>
      <div>
        <h3>Bulk Add Participants</h3>
        <nav>
          <ul>
            <li><Link to="upload">Upload CSV File</Link></li>
            <li><Link to="manual">Manual CSV Input</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<h4>Please select a mode</h4>} />
          <Route path="upload" element={<BulkUploadForm onParticipantAdded={onParticipantAdded} />} />
          <Route path="manual" element={<ManualCSVInput onParticipantAdded={onParticipantAdded} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default BulkAddPlayerForm;
