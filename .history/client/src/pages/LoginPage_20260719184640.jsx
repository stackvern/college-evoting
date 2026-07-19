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
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-5xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
       

        <form onSubmit={handleSubmit} className="rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="register" className="block text-sm font-medium text-slate-700">Register Number</label>
              <input
                id="register"
                type="text"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-5 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="Enter your reg.no"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-5 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="Enter your email"
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
              {loading ? 'Verifying...' : 'Login and Vote'}
            </button>
            <p className="text-sm text-slate-500">
              After login, you’ll be redirected to the voting page if your account is eligible.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
