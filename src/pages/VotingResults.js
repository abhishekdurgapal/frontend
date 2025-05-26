import React, { useEffect, useState } from 'react';

export default function VotingResults() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch('http://localhost:4000/candidate/vote/count', {
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

    fetchResults();
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Live Voting Results</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {results.length > 0 ? (
        results.map((r, i) => (
          <p key={i}>{r.party}: {r.votes} votes</p>
        ))
      ) : (
        <p>No results available yet.</p>
      )}
    </div>
  );
}
