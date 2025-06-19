import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import guestIcon from './guest-icon.png';
 // Update path as needed

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
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const candidateRes = await fetch(`${API}/candidate`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const candidateData = await candidateRes.json();
        setCandidates(candidateData);

        const profileRes = await fetch(`${API}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profileData = await profileRes.json();
        if (profileRes.ok && profileData.user?.isVoted) {
          setVoted(true);
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 to-pink-400 text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text--600">📺 Fan Voting Dashboard</h1>

      {voted ? (
        <>
          <p className="text-center text--600 font-semibold mb-4">✅ You have voted.</p>
          <h2 className="text-2xl font-bold text--600 mb-4 text-center">Live Results</h2>
          {results.length > 0 ? (
            <div className="max-w-xl mx-auto space-y-4">
              {results.map((r, i) => {
                const total = results.reduce((sum, item) => sum + item.votes, 0);
                const percent = total ? (r.votes / total) * 100 : 0;
                return (
                  <div key={i} className="bg-red-100 text-black p-4 rounded-xl shadow">
                    <p className="font-bold text-green-600 text-lg">{r.party} — {r.votes} votes</p>
                    <div className="w-full bg-blue-200 rounded h-4 mt-2">
                      <div
                        className="bg-lime-500 h-4 rounded"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{percent.toFixed(1)}%</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center">No results yet.</p>
          )}
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-purple-500 mb-4 text-center">Vote for Your Favorite</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {candidates.map((c, i) => (
              <div key={i} className="bg-white text-black rounded-2xl p-4 shadow-xl relative">
                <img
                  src={guestIcon}
                  alt="Guest Icon"
                  className="w-20 h-20 absolute top-2 right-2"
                />
                {c.image && (
                  <img src={c.image} alt={c.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                )}
                <p className="text-xl font-bold text-purple-700">{c.name}</p>
                <p className="mb-4 text-gray-600">{c.party}</p>
                <button
                  onClick={() => vote(c)}
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                >
                  Vote
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
