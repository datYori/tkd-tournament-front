import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

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

  const fetchParticipants = () => {
    fetch('http://localhost:3000/api/participants')
      .then(response => response.json())
      .then(data => setParticipants(data))
      .catch(error => console.error('Error fetching participants:', error));
  };

  const fetchTournaments = () => {
    fetch('http://localhost:3000/api/tournaments')
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
    fetch('http://localhost:3000/api/tournaments', {
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

  const handleGenerateAllBrackets = () => {
    const uniqueTuples = participants.reduce((acc, participant) => {
      const key = `${participant.weightCategory}/${participant.ageCategory}/${participant.gender}/${participant.kupCategory}`;
      if (!acc[key]) {
        acc[key] = {
          weightCategory: participant.weightCategory,
          ageCategory: participant.ageCategory,
          gender: participant.gender,
          kupCategory: participant.kupCategory
        };
      }
      return acc;
    }, {});

    const generatePromises = Object.values(uniqueTuples).map(tuple => {
      const combatZone = combatZones[`${tuple.weightCategory}/${tuple.ageCategory}/${tuple.gender}/${tuple.kupCategory}`];
      if (!combatZone) {
        alert(`Please select a combat zone for ${tuple.weightCategory} / ${tuple.ageCategory} / ${tuple.gender} / ${tuple.kupCategory}`);
        return Promise.reject('Combat zone not selected');
      }
      return fetch('http://localhost:3000/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tuple, combatZone })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to generate bracket');
        }
        return response.json();
      });
    });

    Promise.all(generatePromises)
      .then(results => {
        results.forEach(tournament => {
          console.log(`Generated tournament with ID: ${tournament._id}`);
        });
        fetchTournaments();  // Refresh the tournament list
      })
      .catch(error => {
        console.error('Error generating brackets:', error);
      });
  };

  const handleDeleteTournament = (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;

    fetch(`http://localhost:3000/api/tournaments/${id}`, {
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
          kupCategory: participant.kupCategory
        };
      }
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

  return (
    <div>
      <h3>Generate Brackets</h3>
      <button onClick={handleGenerateAllBrackets}>Generate All Brackets</button>

      <table className="participant-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>
              Age Category
              <div className="filter-container">
                <select
                  value={filters.ageCategory}
                  onChange={e => setFilters({ ...filters, ageCategory: e.target.value })}
                >
                  {uniqueCategories('ageCategory').map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </th>
            <th>
              Weight Category
              <div className="filter-container">
                <select
                  value={filters.weightCategory}
                  onChange={e => setFilters({ ...filters, weightCategory: e.target.value })}
                >
                  {uniqueCategories('weightCategory').map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </th>
            <th>
              Gender
              <div className="filter-container">
                <select
                  value={filters.gender}
                  onChange={e => setFilters({ ...filters, gender: e.target.value })}
                >
                  {uniqueCategories('gender').map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </th>
            <th>
              Kup Category
              <div className="filter-container">
                <select
                  value={filters.kupCategory}
                  onChange={e => setFilters({ ...filters, kupCategory: e.target.value })}
                >
                  {uniqueCategories('kupCategory').map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </th>
            <th>Combat Zone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredCombinations().map((combination, index) => {
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
