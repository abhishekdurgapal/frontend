import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VoterDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch all candidates
        const candidateRes = await fetch(`${API}/candidate`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!candidateRes.ok) {
          const error = await candidateRes.json();
          throw new Error(error.message || 'Failed to load candidates');
        }

        const candidateData = await candidateRes.json();
        setCandidates(candidateData);

        // Check if user has voted
        const profileRes = await fetch(`${API}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profileData = await profileRes.json();
        if (profileRes.ok && profileData.user?.isVoted) {
          setVoted(true);

          // Fetch vote count results
          const resultRes = await fetch(`${API}/candidate/vote/count`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const resultData = await resultRes.json();
          if (resultRes.ok) setResults(resultData);
        }

        setLoading(false);
      } catch (err) {
        console.error('Dashboard Error:', err);
        setError(err.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate, API]);

  const vote = async (candidate) => {
    try {
      const res = await fetch(`${API}/candidate/vote/${candidate._id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Vote cast successfully!');
        setVoted(true);

        // Fetch updated results
        const resultRes = await fetch(`${API}/candidate/vote/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const resultData = await resultRes.json();
        if (resultRes.ok) setResults(resultData);
      } else {
        alert(data.message || 'Vote failed');
      }
    } catch (err) {
      console.error(err);
      alert('Vote failed');
    }
  };

  if (loading) return <div className="p-6">Loading candidates...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Voter Dashboard</h1>

      {voted ? (
        <>
          <p className="text-green-600 font-semibold mb-4">✅ You have voted.</p>
          <h2 className="text-xl font-semibold mb-2">Live Results:</h2>
          {results.length > 0 ? (
            results.map((r, i) => {
              const total = results.reduce((sum, item) => sum + item.votes, 0);
              const percent = total ? (r.votes / total) * 100 : 0;
              return (
                <div key={i} className="mb-4">
                  <p className="font-semibold">{r.party}: {r.votes} votes</p>
                  <div className="w-full bg-gray-200 rounded h-4">
                    <div
                      className="bg-blue-500 h-4 rounded"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">{percent.toFixed(1)}%</p>
                </div>
              );
            })
          ) : (
            <p>No results yet.</p>
          )}
        </>
      ) : (
        <>
          {candidates.length > 0 ? (
            candidates.map((c, i) => (
              <div key={i} className="border p-4 rounded mb-2 shadow">
                <p><strong>Name:</strong> {c.name}</p>
                <p><strong>Party:</strong> {c.party}</p>
                <button
                  onClick={() => vote(c)}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Vote
                </button>
              </div>
            ))
          ) : (
            <p>No candidates available.</p>
          )}
        </>
      )}
    </div>
  );
}
