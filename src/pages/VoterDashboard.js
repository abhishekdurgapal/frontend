import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VoterDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!token) {
      navigate('/login'); // redirect if no token
      return;
    }

    console.log('Token found:', token);

    fetch(`${API}/candidate`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Failed to load candidates');
        }
        return res.json();
      })
      .then(data => {
        console.log('Candidates:', data);
        setCandidates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching candidates:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [token, navigate]);

  const vote = async (candidate) => {
    try {
      const res = await fetch(`${API}/candidate/vote/${candidate._id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Vote cast successfully!');
        setVoted(true);
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
        <p className="text-green-600 font-semibold">✅ You have already voted.</p>
      ) : (
        candidates.length > 0 ? candidates.map((c, i) => (
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
        )) : <p>No candidates available.</p>
      )}
    </div>
  );
}
