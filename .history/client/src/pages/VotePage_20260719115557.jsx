import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const VotePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [presidentId, setPresidentId] = useState('');
  const [secretaryId, setSecretaryId] = useState('');
  const [treasurerId, setTreasurerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCandidates = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/candidates');
        if (response.data?.success) {
          setCandidates(response.data.candidates || []);
        } else {
          setError('Unable to load candidates.');
        }
      } catch (err) {
        setError('Unable to load candidates.');
      } finally {
        setLoading(false);
      }
    };
    loadCandidates();
  }, []);

  const groupedCandidates = useMemo(() => {
    return candidates.reduce((acc, candidate) => {
      const position = candidate.position || 'Other';
      acc[position] = acc[position] || [];
      acc[position].push(candidate);
      return acc;
    }, {});
  }, [candidates]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setSubmitLoading(true);

    try {
      const response = await api.post('/api/student/submit', {
        presidentId,
        secretaryId,
        treasurerId
      });

      if (response.data?.success) {
        setMessage(response.data.message || 'Vote submitted successfully.');
      } else {
        setError(response.data?.message || 'Unable to submit vote.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to submit vote.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-220px)] flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="inline-flex items-center gap-3 rounded-[28px] border border-slate-200 bg-white px-7 py-5 text-slate-900 shadow-sm">
          <span className="text-base font-medium">Loading candidates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_0.8fr] xl:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Vote session</p>
            <h1 className="mt-4 text-4xl font-semibold text-slate-900">Choose your representatives</h1>
            <p className="mt-3 text-base leading-7 text-slate-600">Select one candidate for each position. Once submitted, your vote is recorded and cannot be changed.</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Voting rules</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li>• You must select one candidate for President, Secretary, and Treasurer.</li>
              <li>• Voting closes when election status is not OPEN.</li>
              <li>• You can only vote once per student account.</li>
            </ul>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-700">{error}</div>
      )}
      {message && (
        <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6 text-emerald-700">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[0.95fr_0.85fr]">
        <div className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          {['President', 'Secretary', 'Treasurer'].map((position) => (
            <div key={position} className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">{position}</h2>
              <div className="grid gap-4">
                {(groupedCandidates[position] || []).map((candidate) => (
                  <label key={candidate.id} className="flex cursor-pointer items-center gap-4 rounded-3xl border border-slate-200 bg-white px-4 py-4 transition hover:border-sky-500">
                    <input
                      type="radio"
                      name={position}
                      value={candidate.id}
                      checked={
                        (position === 'President' && presidentId === String(candidate.id)) ||
                        (position === 'Secretary' && secretaryId === String(candidate.id)) ||
                        (position === 'Treasurer' && treasurerId === String(candidate.id))
                      }
                      onChange={() => {
                        if (position === 'President') setPresidentId(candidate.id);
                        if (position === 'Secretary') setSecretaryId(candidate.id);
                        if (position === 'Treasurer') setTreasurerId(candidate.id);
                      }}
                      className="h-5 w-5 text-sky-600"
                    />
                    <div>
                      <p className="text-base font-semibold text-slate-900">{candidate.name}</p>
                      <p className="text-sm text-slate-500">{candidate.details || 'No additional details'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-6 rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Selection summary</p>
            <div className="mt-5 space-y-4 rounded-[28px] border border-slate-200 bg-white p-6">
              <div className="space-y-3">
                <p className="text-sm text-slate-500">President</p>
                <p className="text-base font-semibold text-slate-900">{(groupedCandidates['President'] || []).find((candidate) => String(candidate.id) === String(presidentId))?.name || 'Not selected'}</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-slate-500">Secretary</p>
                <p className="text-base font-semibold text-slate-900">{(groupedCandidates['Secretary'] || []).find((candidate) => String(candidate.id) === String(secretaryId))?.name || 'Not selected'}</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-slate-500">Treasurer</p>
                <p className="text-base font-semibold text-slate-900">{(groupedCandidates['Treasurer'] || []).find((candidate) => String(candidate.id) === String(treasurerId))?.name || 'Not selected'}</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLoading ? 'Submitting Vote...' : 'Submit Vote'}
          </button>
        </aside>
      </form>
    </div>
  );
};

export default VotePage;
