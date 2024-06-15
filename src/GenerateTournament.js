import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import apiUrl from './config';

const GenerateTournament = () => {
  const [participants, setParticipants] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [filters, setFilters] = useState({
    weightCategory: 'All',
    ageCategory: 'All',
    gender: 'All',
    kupCategory: 'All'
  });
  const [combatZones, setCombatZones] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const fetchParticipants = () => {
    fetch(`${apiUrl}/api/participants`)
      .then(response => response.json())
      .then(data => setParticipants(data))
      .catch(error => console.error('Error fetching participants:', error));
  };

  const fetchTournaments = () => {
    fetch(`${apiUrl}/api/tournaments`)
      .then(response => response.json())
      .then(data => setTournaments(data))
      .catch(error => console.error('Error fetching tournaments:', error));
  };

  useEffect(() => {
    fetchParticipants();
    fetchTournaments();
  }, []);

  const handleGenerateBracket = (weightCategory, ageCategory, gender, kupCategory, combatZone) => {
    if (!combatZone) {
      alert('Please select a combat zone');
      return;
    }
    fetch(`${apiUrl}/api/tournaments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weightCategory, ageCategory, gender, kupCategory, combatZone })
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to generate bracket');
      return response.json();
    })
    .then(tournament => {
      fetchTournaments();  // Refresh the tournament list
    })
    .catch(error => console.error('Error generating bracket:', error));
  };

  const handleDeleteTournament = (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;

    fetch(`${apiUrl}/api/tournaments/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) throw new Error('Failed to delete tournament');
      fetchTournaments();  // Refresh the tournament list
    })
    .catch(error => console.error('Error deleting tournament:', error));
  };

  const getUniqueCombinations = () => {
    const uniqueCombinations = participants.reduce((acc, participant) => {
      const key = `${participant.weightCategory}/${participant.ageCategory}/${participant.gender}/${participant.kupCategory}`;
      if (!acc[key]) {
        acc[key] = {
          weightCategory: participant.weightCategory,
          ageCategory: participant.ageCategory,
          gender: participant.gender,
          kupCategory: participant.kupCategory,
          count: 0
        };
      }
      acc[key].count += 1;
      return acc;
    }, {});

    return Object.values(uniqueCombinations);
  };

  const getFilteredCombinations = () => {
    const combinations = getUniqueCombinations();
    return combinations.filter(combination =>
      (filters.weightCategory === 'All' || combination.weightCategory === filters.weightCategory) &&
      (filters.ageCategory === 'All' || combination.ageCategory === filters.ageCategory) &&
      (filters.gender === 'All' || combination.gender === filters.gender) &&
      (filters.kupCategory === 'All' || combination.kupCategory === filters.kupCategory)
    );
  };

  const uniqueCategories = (key) => {
    const categories = new Set(participants.map(participant => participant[key]));
    return ['All', ...categories];
  };

  const isTournamentGenerated = (combination) => {
    return tournaments.some(tournament =>
      tournament.weightCategory === combination.weightCategory &&
      tournament.ageCategory === combination.ageCategory &&
      tournament.gender === combination.gender &&
      tournament.kupCategory === combination.kupCategory
    );
  };

  const getTournamentId = (combination) => {
    const tournament = tournaments.find(tournament =>
      tournament.weightCategory === combination.weightCategory &&
      tournament.ageCategory === combination.ageCategory &&
      tournament.gender === combination.gender &&
      tournament.kupCategory === combination.kupCategory
    );
    return tournament ? tournament._id : null;
  };

  const getCombatZone = (combination) => {
    const tournament = tournaments.find(tournament =>
      tournament.weightCategory === combination.weightCategory &&
      tournament.ageCategory === combination.ageCategory &&
      tournament.gender === combination.gender &&
      tournament.kupCategory === combination.kupCategory
    );
    return tournament ? tournament.combatZone : null;
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const ageCategoryOrder = {
    Poussin: 1,
    Benjamin: 2,
    Minime: 3,
    Cadet: 4,
    Junior: 5,
    Senior: 6
  };

  const sortedCombinations = useMemo(() => {
    const sorted = [...getFilteredCombinations()];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (sortConfig.key === 'ageCategory') {
          return sortConfig.direction === 'ascending'
            ? ageCategoryOrder[a.ageCategory] - ageCategoryOrder[b.ageCategory]
            : ageCategoryOrder[b.ageCategory] - ageCategoryOrder[a.ageCategory];
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        }
      });
    }
    return sorted;
  }, [sortConfig, participants, filters]);

  return (
    <div>
      <h3>Generate Brackets</h3>

      <table className="participant-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('tournamentId')}>ID</th>
            <th onClick={() => requestSort('ageCategory')}>Age Category</th>
            <th onClick={() => requestSort('weightCategory')}>Weight Category</th>
            <th onClick={() => requestSort('gender')}>Gender</th>
            <th onClick={() => requestSort('kupCategory')}>Kup Category</th>
            <th onClick={() => requestSort('count')}>Number of Participants</th>
            <th>Combat Zone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedCombinations.map((combination, index) => {
            const tournamentId = getTournamentId(combination);
            const combatZone = getCombatZone(combination);
            const key = `${combination.weightCategory}/${combination.ageCategory}/${combination.gender}/${combination.kupCategory}`;
            return (
              <tr key={index} style={{ backgroundColor: tournamentId ? 'green' : 'red' }}>
                <td>
                  {tournamentId ? (
                    <Link to={`/tournament-bracket/${tournamentId}`}>{tournamentId}</Link>
                  ) : ''}
                </td>
                <td>{combination.ageCategory}</td>
                <td>{combination.weightCategory}</td>
                <td>{combination.gender}</td>
                <td>{combination.kupCategory}</td>
                <td>{combination.count}</td>
                <td>
                  {tournamentId ? (
                    combatZone
                  ) : (
                    <select
                      value={combatZones[key] || ''}
                      onChange={e => setCombatZones({ ...combatZones, [key]: e.target.value })}
                    >
                      <option value="" disabled>Select Combat Zone</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  )}
                </td>
                <td>
                  {tournamentId ? (
                    <>
                      <button onClick={() => handleGenerateBracket(combination.weightCategory, combination.ageCategory, combination.gender, combination.kupCategory, combatZone)}>Generate</button>
                      <button onClick={() => handleDeleteTournament(tournamentId)}>Delete</button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleGenerateBracket(
                        combination.weightCategory,
                        combination.ageCategory,
                        combination.gender,
                        combination.kupCategory,
                        combatZones[key]
                      )}
                      disabled={!combatZones[key]}
                      style={{ backgroundColor: !combatZones[key] ? 'grey' : '', color: !combatZones[key] ? 'white' : '', cursor: !combatZones[key] ? 'not-allowed' : '' }}
                    >
                      Generate
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GenerateTournament;
