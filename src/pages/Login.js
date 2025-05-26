import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

export default function Login() {
  const [form, setForm] = useState({ aadharCardNumber: '', password: '' });
  const nav = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok && data.token && data.user?.role) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
      
        if (data.user.role === 'admin') {
          nav('/admin/dashboard');
        } else {
          nav('/dashboard');
        }
      } else {
        alert(data.error || 'Invalid credentials or response');
      }
      
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Check the console for details.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          required
          className="w-full p-2 border rounded mb-2"
          placeholder="Aadhar Number"
          onChange={e => setForm({ ...form, aadharCardNumber: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded mb-4"
          placeholder="Password"
          type="password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          onClick={handleLogin}
        >
          Log In
        </button>
        <button
          className="mt-2 w-full border p-2 rounded hover:bg-gray-200"
          onClick={() => nav('/')}
        >
          No account? Sign up
        </button>
      </div>
    </div>
  );
}
