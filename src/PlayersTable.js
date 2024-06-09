import React, { useState, useMemo, useEffect } from 'react';

const PlayersTable = ({ participants, onDelete, showDeleteButton = false, onUpdate, onFilteredCountChange }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filters, setFilters] = useState({
    weightCategory: '',
    ageCategory: '',
    gender: '',
    kupCategory: '',
    name: '',
    team: ''
  });
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    weightCategory: '',
    ageCategory: '',
    kupCategory: '',
    gender: '',
    team: ''
  });

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      if (!sortConfig.key || a[sortConfig.key] === b[sortConfig.key]) return 0;
      return (a[sortConfig.key] < b[sortConfig.key]) === (sortConfig.direction === 'ascending') ? -1 : 1;
    });
  }, [participants, sortConfig]);

  const filteredParticipants = useMemo(() => {
    const filtered = sortedParticipants.filter(participant => {
      return (filters.weightCategory ? participant.weightCategory === filters.weightCategory : true) &&
             (filters.ageCategory ? participant.ageCategory === filters.ageCategory : true) &&
             (filters.gender ? participant.gender === filters.gender : true) &&
             (filters.kupCategory ? participant.kupCategory === filters.kupCategory : true) &&
             (filters.name ? participant.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
             (filters.team ? participant.team === filters.team : true);
    });

    onFilteredCountChange(filtered.length); // Update filtered count
    return filtered;
  }, [sortedParticipants, filters]);

  useEffect(() => {
    onFilteredCountChange(filteredParticipants.length);
  }, [filteredParticipants]);

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

  const startEditing = (participant) => {
    setEditingParticipant(participant._id);
    setEditFormData(participant);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    onUpdate(editingParticipant, editFormData);
    setEditingParticipant(null);
  };

  const handleCancelEdit = () => {
    setEditingParticipant(null);
  };

  const uniqueCategories = useMemo(() => {
    const categories = {
      weightCategories: [...new Set(participants.map(p => p.weightCategory))],
      ageCategories: [...new Set(participants.map(p => p.ageCategory))],
      genders: [...new Set(participants.map(p => p.gender))],
      kupCategories: [...new Set(participants.map(p => p.kupCategory))],
      teams: [...new Set(participants.map(p => p.team))]
    };
    return categories;
  }, [participants]);

  return (
    <div>
      <table className="participant-table">
        <thead>
          <tr>
            <th>
              <div className={`th-sortable ${getClassNamesFor('name')}`}>
                <span className="column-title">Name</span>
                <input
                  type="text"
                  value={filters.name}
                  onChange={e => handleFilterChange(e, 'name')}
                  placeholder="Filter by name"
                  className="filter-input"
                />
                <span
                  className="sort-arrow"
                  onClick={() => requestSort('name')}
                >
                  {getClassNamesFor('name') === 'ascending' ? '▲' : '▼'}
                </span>
              </div>
            </th>
            <th>
              <div className={`th-sortable ${getClassNamesFor('ageCategory')}`}>
                <span className="column-title">Age Category</span>
                <select
                  value={filters.ageCategory}
                  onChange={e => handleFilterChange(e, 'ageCategory')}
                  className="filter-select"
                >
                  <option value="">All</option>
                  {uniqueCategories.ageCategories.map(age => (
                    <option key={age} value={age}>{age}</option>
                  ))}
                </select>
                <span
                  className="sort-arrow"
                  onClick={() => requestSort('ageCategory')}
                >
                  {getClassNamesFor('ageCategory') === 'ascending' ? '▲' : '▼'}
                </span>
              </div>
            </th>
            <th>
              <div className={`th-sortable ${getClassNamesFor('weightCategory')}`}>
                <span className="column-title">Weight Category</span>
                <select
                  value={filters.weightCategory}
                  onChange={e => handleFilterChange(e, 'weightCategory')}
                  className="filter-select"
                >
                  <option value="">All</option>
                  {uniqueCategories.weightCategories.map(weight => (
                    <option key={weight} value={weight}>{weight}</option>
                  ))}
                </select>
                <span
                  className="sort-arrow"
                  onClick={() => requestSort('weightCategory')}
                >
                  {getClassNamesFor('weightCategory') === 'ascending' ? '▲' : '▼'}
                </span>
              </div>
            </th>
            <th>
              <div className={`th-sortable ${getClassNamesFor('gender')}`}>
                <span className="column-title">Gender</span>
                <select
                  value={filters.gender}
                  onChange={e => handleFilterChange(e, 'gender')}
                  className="filter-select"
                >
                  <option value="">All</option>
                  {uniqueCategories.genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
                <span
                  className="sort-arrow"
                  onClick={() => requestSort('gender')}
                >
                  {getClassNamesFor('gender') === 'ascending' ? '▲' : '▼'}
                </span>
              </div>
            </th>
            <th>
              <div className={`th-sortable ${getClassNamesFor('kupCategory')}`}>
                <span className="column-title">Kup Category</span>
                <select
                  value={filters.kupCategory}
                  onChange={e => handleFilterChange(e, 'kupCategory')}
                  className="filter-select"
                >
                  <option value="">All</option>
                  {uniqueCategories.kupCategories.map(kup => (
                    <option key={kup} value={kup}>{kup}</option>
                  ))}
                </select>
                <span
                  className="sort-arrow"
                  onClick={() => requestSort('kupCategory')}
                >
                  {getClassNamesFor('kupCategory') === 'ascending' ? '▲' : '▼'}
                </span>
              </div>
            </th>
            <th>
              <div className={`th-sortable ${getClassNamesFor('team')}`}>
                <span className="column-title">Team</span>
                <select
                  value={filters.team}
                  onChange={e => handleFilterChange(e, 'team')}
                  className="filter-select"
                >
                  <option value="">All</option>
                  {uniqueCategories.teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
                <span
                  className="sort-arrow"
                  onClick={() => requestSort('team')}
                >
                  {getClassNamesFor('team') === 'ascending' ? '▲' : '▼'}
                </span>
              </div>
            </th>
            {showDeleteButton && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredParticipants.map((participant) => (
            <tr key={participant._id}>
              {editingParticipant === participant._id ? (
                <>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="ageCategory"
                      value={editFormData.ageCategory}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="weightCategory"
                      value={editFormData.weightCategory}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="gender"
                      value={editFormData.gender}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="kupCategory"
                      value={editFormData.kupCategory}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="team"
                      value={editFormData.team}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td>
                    <button onClick={handleEditFormSubmit}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{participant.name}</td>
                  <td>{participant.ageCategory}</td>
                  <td>{participant.weightCategory}</td>
                  <td>{participant.gender}</td>
                  <td>{participant.kupCategory}</td>
                  <td>{participant.team}</td>
                  {showDeleteButton && (
                    <td>
                      <button onClick={() => startEditing(participant)}>Edit</button>
                      <button onClick={() => onDelete(participant._id)}>Delete</button>
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayersTable;
