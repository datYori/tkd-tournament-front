import React, { useEffect, useState, useMemo } from 'react';
import apiUrl from './config';

const PlayersView = () => {
  const [participants, setParticipants] = useState([]);
  const [filteredCount, setFilteredCount] = useState(0);

  const fetchParticipants = () => {
    fetch(`${apiUrl}/api/participants`)
      .then(response => response.json())
      .then(data => setParticipants(data))
      .catch(error => console.error('Error fetching participants:', error));
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filters, setFilters] = useState({
    weightCategory: '',
    ageCategory: '',
    gender: '',
    kupCategory: '',
    name: '',
    team: ''
  });

  const ageCategoryOrder = {
    Poussin: 1,
    Benjamin: 2,
    Minime: 3,
    Cadet: 4,
    Junior: 5,
    Senior: 6
  };

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      if (!sortConfig.key || a[sortConfig.key] === b[sortConfig.key]) return 0;
      if (sortConfig.key === 'ageCategory') {
        return sortConfig.direction === 'ascending'
          ? ageCategoryOrder[a.ageCategory] - ageCategoryOrder[b.ageCategory]
          : ageCategoryOrder[b.ageCategory] - ageCategoryOrder[a.ageCategory];
      } else {
        return (a[sortConfig.key] < b[sortConfig.key]) === (sortConfig.direction === 'ascending') ? -1 : 1;
      }
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

    setFilteredCount(filtered.length); // Update filtered count
    return filtered;
  }, [sortedParticipants, filters]);

  useEffect(() => {
    setFilteredCount(filteredParticipants.length);
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
      <h2 className="h2-heading">Tournament View</h2>
      <h3 className="h2-heading">Participants</h3>
      <h4 className="h4-heading">(Total: {participants.length})</h4>
      <h4 className="h4-heading">(Selected: {filteredCount})</h4>
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
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.map((participant) => (
              <tr key={participant._id}>
                <td>{participant.name}</td>
                <td>{participant.ageCategory}</td>
                <td>{participant.weightCategory}</td>
                <td>{participant.gender}</td>
                <td>{participant.kupCategory}</td>
                <td>{participant.team}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayersView;
