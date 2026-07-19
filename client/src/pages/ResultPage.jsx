import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CheckCircle2, Loader2, Sparkles, Trophy, TrendingUp, Users } from 'lucide-react';
import api from '../api/axios';

const statCards = [
  { label: 'Total Students', field: 'totalStudents', icon: Users, gradient: 'from-sky-500 to-indigo-600' },
  { label: 'Total Votes', field: 'totalVotes', icon: CheckCircle2, gradient: 'from-emerald-500 to-sky-500' },
  { label: 'Voting %', field: 'votingPercentage', icon: TrendingUp, gradient: 'from-amber-500 to-orange-500' }
];

const ResultPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadResults = async () => {
      try {
        const response = await api.get('/api/results/dashboard');
        if (response.data?.success) setData(response.data);
        else setError('Unable to load results.');
      } catch (err) {
        setError('Unable to load results.');
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, []);

  const votePercentage = useMemo(() => Number(data?.statistics?.votingPercentage || 0), [data]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-220px)] flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="inline-flex items-center gap-3 rounded-[28px] border border-slate-200 bg-white px-7 py-5 text-slate-900 shadow-sm">
          <Loader2 className="animate-spin" size={22} />
          <span className="text-base font-medium">Loading election dashboard</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-220px)] flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-8 py-6 text-center text-rose-700 shadow-sm">
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-220px)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-xs uppercase tracking-[0.35em] text-sky-700">
                <Sparkles className="h-4 w-4" /> Live election insights
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Real-time results, clear outcomes, trusted governance.</h1>
              <p className="max-w-3xl text-base leading-8 text-slate-600">Stay informed with vote totals, participation metrics, and the current candidate leaders across all positions.</p>
            </div>
            <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Election pulse</p>
              <div className="mt-5 grid gap-4">
                <div className="rounded-[28px] bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Participation rate</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{votePercentage}%</p>
                </div>
                <div className="rounded-[28px] bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Positions tracked</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{data?.positions?.length ?? 0}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{card.label}</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-900">{data?.statistics?.[card.field] ?? 0}{card.field === 'votingPercentage' ? '%' : ''}</p>
                  </div>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${card.gradient} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900">
              <Trophy className="h-5 w-5 text-sky-600" />
              <h2 className="text-xl font-semibold">Current leaders</h2>
            </div>
            <div className="mt-6 space-y-4">
              {data?.positions?.map((position) => (
                <div key={position.position} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{position.position}</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{position.winner?.name || 'No winner yet'}</p>
                    </div>
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">Winner</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-slate-900">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-semibold">Position breakdown</h2>
            </div>
            <div className="mt-6 space-y-4">
              {data?.positions?.map((position) => (
                <div key={position.position} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span>{position.position}</span>
                    <span>{position.totalVotes} votes</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {position.candidates?.map((candidate) => {
                      const ratio = position.totalVotes > 0 ? (candidate.votes / position.totalVotes) * 100 : 0;
                      return (
                        <div key={candidate.id}>
                          <div className="flex items-center justify-between text-sm text-slate-700">
                            <span>{candidate.name}</span>
                            <span>{candidate.votes}</span>
                          </div>
                          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-600" style={{ width: `${Math.max(ratio, 8)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
