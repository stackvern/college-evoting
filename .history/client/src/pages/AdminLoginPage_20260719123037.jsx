import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('adminToken')) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/admin/login', {
        username,
        password
      });

      if (response.data?.success) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminData', JSON.stringify({ username }));
        navigate('/admin');
      } else {
        setError(response.data?.message || 'Login failed.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-220px)] max-w-5xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Admin login</p>
            <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">Admin portal access</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">Sign in with your admin credentials to manage candidates and monitor election status.</p>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-5 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-5 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
