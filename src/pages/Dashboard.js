import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({ name: '', party: '', age: '' });
  const token = localStorage.getItem('token');
  const nav = useNavigate();

  useEffect(() => {
    if (!token) return nav('/login');
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const res = await fetch(`${API}/candidate`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log('Fetched candidates:', data);
    if (res.ok) setCandidates(data);
  };

  const addCandidate = async () => {
    const res = await fetch(`${API}/candidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ name: '', party: '', age: '' });
      fetchCandidates();
    } else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const updateCandidate = async (id, updated) => {
    const res = await fetch(`${API}/candidate/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(updated)
    });
    if (res.ok) fetchCandidates();
    else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    nav('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            className="text-red-500 hover:underline"
            onClick={logout}
          >
            Logout
          </button>
        </div>

        <div className="bg-white p-4 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Add Candidate</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="p-2 border rounded"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="p-2 border rounded"
              placeholder="Party"
              value={form.party}
              onChange={e => setForm({ ...form, party: e.target.value })}
            />
            <input
              className="p-2 border rounded"
              placeholder="Age"
              type="number"
              value={form.age}
              onChange={e => setForm({ ...form, age: e.target.value })}
            />
          </div>
          <button
            className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            onClick={addCandidate}
          >
            Add Candidate
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Candidate List</h2>
          <div className="space-y-4">
            {candidates.map(c => (
              <div key={c._id} className="bg-white p-4 rounded-xl shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{c.name} ({c.party})</div>
                    <div className="text-sm text-gray-600">Age: {c.age}</div>
                  </div>
                  <div className="space-x-2">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => {
                        const updated = { name: prompt('Name?', c.name), party: prompt('Party?', c.party), age: prompt('Age?', c.age) };
                        if (updated.name) updateCandidate(c._id, updated);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
