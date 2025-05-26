import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VoterDashboard from './pages/VoterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Voter route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="voter">
              <VoterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
