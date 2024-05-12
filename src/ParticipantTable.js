import React, { useState, useMemo } from 'react';

const ParticipantTable = ({ participants, onDelete, showDeleteButton = false }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [weightCategoryFilter, setWeightFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [kupCategoryFilter, setKupCategoryFilter] = useState('');

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      if (!sortConfig.key || a[sortConfig.key] === b[sortConfig.key]) return 0;
      return (a[sortConfig.key] < b[sortConfig.key]) === (sortConfig.direction === 'ascending') ? -1 : 1;
    });
  }, [participants, sortConfig]);

  const filteredParticipants = useMemo(() => {
    return sortedParticipants.filter(participant => {
      return (weightCategoryFilter ? participant.weightCategory === weightCategoryFilter : true) &&
             (ageFilter ? participant.ageCategory === ageFilter : true) &&
             (genderFilter ? participant.gender === genderFilter : true) &&
             (kupCategoryFilter ? participant.kupCategory === kupCategoryFilter : true);
    });
  }, [sortedParticipants, weightCategoryFilter, ageFilter, genderFilter, kupCategoryFilter]);

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

  // Generate unique category sets
  const uniqueCategories = useMemo(() => {
    const categories = {
      weightCategories: [...new Set(participants.map(p => p.weightCategory))],
      ageCategories: [...new Set(participants.map(p => p.ageCategory))],
      genders: [...new Set(participants.map(p => p.gender))],
      kupCategories: [...new Set(participants.map(p => p.kupCategory))]
    };
    return categories;
  }, [participants]);

  return (
    <div>
      <div>
        {uniqueCategories.weightCategories.map(weightCategory => (
          <button key={weightCategory} onClick={() => setWeightFilter(weightCategory)}>{weightCategory}</button>
        ))}
        <button onClick={() => setWeightFilter('')}>Clear Weight Filter</button>
      </div>
      <div>
        {uniqueCategories.ageCategories.map(age => (
          <button key={age} onClick={() => setAgeFilter(age)}>{age}</button>
        ))}
        <button onClick={() => setAgeFilter('')}>Clear Age Filter</button>
      </div>
      <div>
        {uniqueCategories.genders.map(gender => (
          <button key={gender} onClick={() => setGenderFilter(gender)}>{gender}</button>
        ))}
        <button onClick={() => setGenderFilter('')}>Clear Gender Filter</button>
      </div>
      <div>
        {uniqueCategories.kupCategories.map(kupCategory => (
          <button key={kupCategory} onClick={() => setKupCategoryFilter(kupCategory)}>{kupCategory}</button>
        ))}
        <button onClick={() => setKupCategoryFilter('')}>Clear Kup Filter</button>
      </div>
      <table className="participant-table">
        <thead>
          <tr>
            <th className={`th-sortable ${getClassNamesFor('name')}`} onClick={() => requestSort('name')}>Name</th>
            <th className={`th-sortable ${getClassNamesFor('ageCategory')}`} onClick={() => requestSort('ageCategory')}>Age Category</th>
            <th className={`th-sortable ${getClassNamesFor('weightCategory')}`} onClick={() => requestSort('weightCategory')}>Weight Category</th>
            <th className={`th-sortable ${getClassNamesFor('gender')}`} onClick={() => requestSort('gender')}>Gender</th>
            <th className={`th-sortable ${getClassNamesFor('kupCategory')}`} onClick={() => requestSort('kupCategory')}>Kup Category</th>
            {showDeleteButton && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredParticipants.map((participant, index) => (
            <tr key={index}>
              <td>{participant.name}</td>
              <td>{participant.ageCategory}</td>
              <td>{participant.weightCategory}</td>
              <td>{participant.gender}</td>
              <td>{participant.kupCategory}</td>
              {showDeleteButton && (
                <td>
                  <button onClick={() => onDelete(participant._id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantTable;
