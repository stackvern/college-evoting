import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import LoginPage from './pages/LoginPage';
import VotePage from './pages/VotePage';
import ResultPage from './pages/ResultPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="vote" element={<ProtectedRoute><VotePage /></ProtectedRoute>} />
        <Route path="results" element={<ResultPage />} />
        <Route path="admin/login" element={<AdminLoginPage />} />
        <Route path="admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
