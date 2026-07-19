import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [registerNumber, setRegisterNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate('/vote');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/student/login', {
        register_number: registerNumber,
        email
      });

      if (response.data?.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('studentData', JSON.stringify(response.data.student));
        navigate('/vote');
      } else {
        setError(response.data?.message || 'Login failed.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-8">
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Student Login
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Enter your credentials to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label
            htmlFor="register"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Register Number
          </label>

          <input
            id="register"
            type="text"
            value={registerNumber}
            onChange={(e) => setRegisterNumber(e.target.value)}
            placeholder="Enter Register Number"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email Address"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            required
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Login"}
        </button>

      </form>

    </div>
  </div>
);
};

export default LoginPage;
