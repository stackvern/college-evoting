import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('studentData');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
              College E-Voting
            </Link>
            <p className="text-sm text-slate-500">Student voting system</p>
          </div>
          <nav className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <Link className="rounded-full px-4 py-2 transition hover:bg-slate-100" to="/results">
              Results
            </Link>
            {token ? (
              <>
                <Link className="rounded-full px-4 py-2 transition hover:bg-slate-100" to="/vote">
                  Vote
                </Link>
                <button className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800" to="/login">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 text-xs text-slate-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()}Developed by Stackvern College E-Voting System.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
