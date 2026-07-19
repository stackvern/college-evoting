import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [form, setForm] = useState({ name: '', position: '', details: '', photo: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCandidates = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/api/candidates');
      if (response.data?.success) {
        setCandidates(response.data.candidates || []);
      } else {
        setError(response.data?.message || 'Failed to load candidates.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.put(`/api/admin/candidates/${editingId}`, form);
      } else {
        await api.post('/api/admin/candidates', form);
      }
      setForm({ name: '', position: '', details: '', photo: '' });
      setEditingId(null);
      fetchCandidates();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save candidate.');
    }
  };

  const handleEdit = (candidate) => {
    setEditingId(candidate.id);
    setForm({
      name: candidate.name,
      position: candidate.position,
      details: candidate.details,
      photo: candidate.photo || ''
    });
  };

  const handleDelete = async (candidateId) => {
    setError('');
    try {
      await api.delete(`/api/admin/candidates/${candidateId}`);
      fetchCandidates();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete candidate.');
    }
  };

  const handleStudentUpload = async (event) => {
    event.preventDefault();

    if (!uploadFile) {
      setUploadError('Please select a CSV file to upload.');
      return;
    }

    setUploadLoading(true);
    setUploadError('');
    setUploadMessage('');

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const response = await api.post('/api/admin/upload-students', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.success) {
        setUploadMessage(`Uploaded ${response.data.total || 0} students successfully.`);
        setUploadFile(null);
        fetchCandidates();
      } else {
        setUploadError(response.data?.message || 'Upload failed.');
      }
    } catch (err) {
      setUploadError(err?.response?.data?.message || 'Upload failed.');
    } finally {
      setUploadLoading(false);
    }
  };

  const positionOptions = ['President', 'Secretary', 'Treasurer'];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Manage candidates and perform CRUD actions from the admin panel.</p>
        <Link className="rounded-full px-4 py-2 transition hover:bg-slate-100" to="/results">
                      Results
        </Link>
      </div>

      {error && (
        <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>
      )}
      {uploadError && (
        <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-700">{uploadError}</div>
      )}
      {uploadMessage && (
        <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 text-emerald-700">{uploadMessage}</div>
      )}

      <section className="grid gap-6 lg:grid-cols-[0.82fr_0.82fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Upload students</h2>
          <p className="mt-2 text-sm text-slate-600">Upload a CSV file with student register numbers and email addresses.</p>
          <form onSubmit={handleStudentUpload} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">CSV file</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-5 py-3 text-slate-900 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={uploadLoading}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploadLoading ? 'Uploading...' : 'Upload Students'}
            </button>
          </form>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Candidate list</h2>
          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-sm text-slate-500">Loading candidates...</p>
            ) : candidates.length === 0 ? (
              <p className="text-sm text-slate-500">No candidates available.</p>
            ) : (
              candidates.map((candidate) => (
                <div key={candidate.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{candidate.name}</p>
                      <p className="text-sm text-slate-500">{candidate.position}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(candidate)}
                        className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-slate-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(candidate.id)}
                        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit Candidate' : 'Add Candidate'}</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-5 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="Candidate name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Position</label>
              <select
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-5 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                <option value="">Select position</option>
                {positionOptions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Details</label>
              <textarea
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
                rows={4}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-5 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="Candidate details"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Photo URL</label>
              <input
                value={form.photo}
                onChange={(e) => setForm({ ...form, photo: e.target.value })}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-slate-50 px-5 py-3 text-slate-900 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                placeholder="Optional image URL"
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {editingId ? 'Update Candidate' : 'Add Candidate'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
