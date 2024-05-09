import React, { useState, useEffect } from 'react';
import TournamentBracket from './TournamentBracket';

const TournamentView = () => {
  const [participants, setParticipants] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    fetch('http://localhost:3000/api/participants')
      .then(response => response.json())
      .then(data => setParticipants(data))
      .catch(error => console.error('Error fetching participants:', error));
  }, []);

  const sortedParticipants = React.useMemo(() => {
    let sortableItems = [...participants];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [participants, sortConfig]);

  const requestSort = key => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <div>
      <h2 className="h2-heading">Tournament View</h2>
      <h3 className="h2-heading">Participants</h3>
      <table className="participant-table">
        <thead>
          <tr>
            <th className={`th-sortable ${getClassNamesFor('name')}`} onClick={() => requestSort('name')}>Name</th>
            <th className={`th-sortable ${getClassNamesFor('ageCategory')}`} onClick={() => requestSort('ageCategory')}>Age Category</th>
            <th className={`th-sortable ${getClassNamesFor('weightCategory')}`} onClick={() => requestSort('weightCategory')}>Weight Category</th>
          </tr>
        </thead>
        <tbody>
          {sortedParticipants.map((participant, index) => (
            <tr key={index}>
              <td>{participant.name}</td>
              <td>{participant.ageCategory}</td>
              <td>{participant.weightCategory}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <TournamentBracket />
    </div>
  );
};

export default TournamentView;
