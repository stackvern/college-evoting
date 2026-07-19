import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const studentToken = localStorage.getItem('authToken');
  const adminToken = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('studentData');
    navigate('/login');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
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
            
            {studentToken ? (
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
            {adminToken ? (
              <>
                <Link className="rounded-full px-4 py-2 transition hover:bg-slate-100" to="/admin">
                  Admin
                </Link>
                <button className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800" onClick={handleAdminLogout}>
                  Admin Logout
                </button>
              </>
            ) : (
              <Link className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800" to="/admin/login">
                Admin Login
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-6">
  <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">

    <p>
      © {new Date().getFullYear()} <span className="font-semibold text-slate-800">Stackvern</span>. All Rights Reserved.
    </p>

    <div className="flex items-center gap-6">

      <a
        href="https://stackvern.github.io/website"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-slate-600 transition hover:text-blue-600"
      >
        🌐 Website
      </a>

      <a
        href="https://www.instagram.com/stackvern_"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-slate-600 transition hover:text-pink-600"
      >
        📷 @stackvern_
      </a>

      <a
        href="mailto:stackverntech@gmail.com"
        className="font-medium text-slate-600 transition hover:text-emerald-600"
      >
        ✉ Contact
      </a>

    </div>

  </div>
</footer>
    </div>
  );
};

export default Layout;
