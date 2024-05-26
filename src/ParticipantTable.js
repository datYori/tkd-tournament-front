import React, { useState, useMemo } from 'react';

const ParticipantTable = ({ participants, onDelete, showDeleteButton = false }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filters, setFilters] = useState({
    weightCategory: '',
    ageCategory: '',
    gender: '',
    kupCategory: '',
    name: ''
  });

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      if (!sortConfig.key || a[sortConfig.key] === b[sortConfig.key]) return 0;
      return (a[sortConfig.key] < b[sortConfig.key]) === (sortConfig.direction === 'ascending') ? -1 : 1;
    });
  }, [participants, sortConfig]);

  const filteredParticipants = useMemo(() => {
    return sortedParticipants.filter(participant => {
      return (filters.weightCategory ? participant.weightCategory === filters.weightCategory : true) &&
             (filters.ageCategory ? participant.ageCategory === filters.ageCategory : true) &&
             (filters.gender ? participant.gender === filters.gender : true) &&
             (filters.kupCategory ? participant.kupCategory === filters.kupCategory : true) &&
             (filters.name ? participant.name === filters.name : true);
    });
  }, [sortedParticipants, filters]);

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

  const handleFilterChange = (e, key) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: e.target.value
    }));
  };

  // Generate unique category sets
  const uniqueCategories = useMemo(() => {
    const categories = {
      weightCategories: [...new Set(participants.map(p => p.weightCategory))],
      ageCategories: [...new Set(participants.map(p => p.ageCategory))],
      genders: [...new Set(participants.map(p => p.gender))],
      kupCategories: [...new Set(participants.map(p => p.kupCategory))],
      names: [...new Set(participants.map(p => p.name))]
    };
    return categories;
  }, [participants]);

  return (
    <div>
      <table className="participant-table">
        <thead>
          <tr>
            <th className={`th-sortable ${getClassNamesFor('name')}`} onClick={() => requestSort('name')}>
              Name
              <select value={filters.name} onChange={e => handleFilterChange(e, 'name')}>
                <option value="">All</option>
                {uniqueCategories.names.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </th>
            <th className={`th-sortable ${getClassNamesFor('ageCategory')}`} onClick={() => requestSort('ageCategory')}>
              Age Category
              <select value={filters.ageCategory} onChange={e => handleFilterChange(e, 'ageCategory')}>
                <option value="">All</option>
                {uniqueCategories.ageCategories.map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </th>
            <th className={`th-sortable ${getClassNamesFor('weightCategory')}`} onClick={() => requestSort('weightCategory')}>
              Weight Category
              <select value={filters.weightCategory} onChange={e => handleFilterChange(e, 'weightCategory')}>
                <option value="">All</option>
                {uniqueCategories.weightCategories.map(weight => (
                  <option key={weight} value={weight}>{weight}</option>
                ))}
              </select>
            </th>
            <th className={`th-sortable ${getClassNamesFor('gender')}`} onClick={() => requestSort('gender')}>
              Gender
              <select value={filters.gender} onChange={e => handleFilterChange(e, 'gender')}>
                <option value="">All</option>
                {uniqueCategories.genders.map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
            </th>
            <th className={`th-sortable ${getClassNamesFor('kupCategory')}`} onClick={() => requestSort('kupCategory')}>
              Kup Category
              <select value={filters.kupCategory} onChange={e => handleFilterChange(e, 'kupCategory')}>
                <option value="">All</option>
                {uniqueCategories.kupCategories.map(kup => (
                  <option key={kup} value={kup}>{kup}</option>
                ))}
              </select>
            </th>
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
