import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [results, setResults] = useState([]);
  const [voters, setVoters] = useState([]);
  const [error, setError] = useState('');
  const [candidate, setCandidate] = useState({ name: '', party: '', age: '' });
  const token = localStorage.getItem('token');
  const API= process.env.REACT_APP_API_URL;

  const fetchResults = async () => {
    try {
      const res = await fetch(`${API}/candidate/vote/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setResults(data);
      else setError(data.error || 'Failed to fetch results');
    } catch (err) {
      setError('Error fetching results');
      console.error(err);
    }
  };

  const fetchVoters = async () => {
    try {
      const res = await fetch(`${API}/user/users/voters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setVoters(data);
      else setError(data.error || 'Failed to fetch voters');
    } catch (err) {
      setError('Error fetching voters');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResults();
    fetchVoters();
  }, [token]);

  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/candidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(candidate),
      });

      const data = await res.json();
      if (res.ok) {
        setCandidate({ name: '', party: '', age: '' });
        fetchResults();
        alert('Candidate added successfully');
      } else {
        alert(data.message || 'Failed to add candidate');
      }
    } catch (err) {
      console.error(err);
      alert('Error adding candidate');
    }
  };

  const resetVotes = async () => {
    try {
      const res = await fetch(`${API}/user/admin/reset`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert('Voting has been reset successfully');
        fetchResults();
        fetchVoters();
      } else {
        alert(data.message || 'Failed to reset voting');
      }
    } catch (err) {
      console.error(err);
      alert('Error resetting voting');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Add Candidate Form */}
      <form onSubmit={handleCandidateSubmit} className="mb-6 space-y-2">
        <h2 className="text-xl font-semibold">Add Candidate</h2>
        <input
          type="text"
          placeholder="Name"
          value={candidate.name}
          onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Party"
          value={candidate.party}
          onChange={(e) => setCandidate({ ...candidate, party: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={candidate.age}
          onChange={(e) => setCandidate({ ...candidate, age: e.target.value })}
          className="border p-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Candidate
        </button>
      </form>

      {/* Reset Voting */}
      <div className="mb-6">
        <button
          onClick={resetVotes}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Reset Voting
        </button>
      </div>

      {/* Voting Results */}
      <h2 className="text-xl font-semibold">Results:</h2>
         {results.length > 0 ? (
             results.map((r, i) => {
               const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
               const percentage = totalVotes ? (r.votes / totalVotes) * 100 : 0;

           return (
              <div key={i} className="mb-4">
              <p className="font-semibold">{r.party}: {r.votes} votes</p>
              <div className="w-full bg-gray-200 rounded h-4">
               <div
                className="bg-blue-500 h-4 rounded"
                style={{ width: `${percentage}%` }}
               ></div>
              </div>
        <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
      </div>
    );
  })
) : (
  <p>No results yet.</p>
)}


      {/* Voter List */}
      <h2 className="text-xl font-semibold mt-6">Voters:</h2>
      {voters.length > 0 ? (
        voters.map((v, i) => (
          <p key={i}>
            {v.name} - Aadhar: {v.aadharCardNumber} - Voted: {v.isVoted ? 'Yes' : 'No'}
          </p>
        ))
      ) : (
        <p>No voter data available.</p>
      )}
    </div>
  );
}
