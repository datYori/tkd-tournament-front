import React, { useState, useMemo } from 'react';

const ParticipantTable = ({ participants }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [weightFilter, setWeightFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');

  const sortedParticipants = useMemo(() => {
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

  const filteredParticipants = useMemo(() => {
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
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const uniqueWeightCategories = [...new Set(participants.map(p => p.weightCategory))];
  const uniqueAgeCategories = [...new Set(participants.map(p => p.ageCategory))];

  return (
    <div>
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

export default ParticipantTable;
