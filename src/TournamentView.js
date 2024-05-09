import React, { useState, useEffect } from 'react';

const TournamentView = () => {
  const [participants, setParticipants] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [weightFilter, setWeightFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/participants')
      .then(response => response.json())
      .then(data => setParticipants(data))
      .catch(error => console.error('Error fetching participants:', error));
  }, []);

  const sortedParticipants = React.useMemo(() => {
    return [...participants].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [participants, sortConfig]);

  const filteredParticipants = React.useMemo(() => {
    return sortedParticipants.filter(participant => {
      return (weightFilter ? participant.weightCategory === weightFilter : true) &&
             (ageFilter ? participant.ageCategory === ageFilter : true);
    });
  }, [sortedParticipants, weightFilter, ageFilter]);

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

  const uniqueWeightCategories = [...new Set(participants.map(p => p.weightCategory))];
  const uniqueAgeCategories = [...new Set(participants.map(p => p.ageCategory))];

  return (
    <div>
      <h2 className="h2-heading">Tournament View</h2>
      <h3 className="h2-heading">Participants</h3>
      <div>
        {uniqueWeightCategories.map(weight => (
          <button key={weight} onClick={() => setWeightFilter(weight)}>{weight}</button>
        ))}
        <button onClick={() => setWeightFilter('')}>Clear Weight Filter</button>
      </div>
      <div>
        {uniqueAgeCategories.map(age => (
          <button key={age} onClick={() => setAgeFilter(age)}>{age}</button>
        ))}
        <button onClick={() => setAgeFilter('')}>Clear Age Filter</button>
      </div>
      <table className="participant-table">
        <thead>
          <tr>
            <th className={`th-sortable ${getClassNamesFor('name')}`} onClick={() => requestSort('name')}>Name</th>
            <th className={`th-sortable ${getClassNamesFor('ageCategory')}`} onClick={() => requestSort('ageCategory')}>Age Category</th>
            <th className={`th-sortable ${getClassNamesFor('weightCategory')}`} onClick={() => requestSort('weightCategory')}>Weight Category</th>
          </tr>
        </thead>
        <tbody>
          {filteredParticipants.map((participant, index) => (
            <tr key={index}>
              <td>{participant.name}</td>
              <td>{participant.ageCategory}</td>
              <td>{participant.weightCategory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TournamentView;
