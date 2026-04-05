import { useEffect, useMemo, useState } from 'react';
import { Activity, CircleDollarSign, ShieldCheck, Users } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { adminService } from '../../../api/adminService';
import { analyticsService } from '../../../api/analyticsService';
import { loanService } from '../../../api/loanService';
import { getPageItems } from '../../../api/responseUtils';
import { currency, normalizeLoan, titleCase } from '../../lib/crediflow';

export function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [overviewPayload, dashboardPayload, loansPayload] = await Promise.all([
          adminService.getOverview(),
          analyticsService.getDashboard(),
          loanService.getAllLoans({ size: 50 }),
        ]);

        if (!active) {
          return;
        }

        setOverview(overviewPayload);
        setDashboard(dashboardPayload);
        setLoans(getPageItems(loansPayload).map(normalizeLoan));
      } catch (error) {
        console.error('Failed to load admin dashboard', error);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const stats = [
    { label: 'Active users', value: overview?.totalActiveUsers ?? 0, icon: Users, tone: 'bg-blue-50 text-blue-700' },
    { label: 'Loans applied', value: dashboard?.totalLoansAppiled ?? 0, icon: Activity, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Outstanding balance', value: currency(dashboard?.totalOutstandingBalance), icon: CircleDollarSign, tone: 'bg-rose-50 text-rose-700' },
    { label: 'Audit events', value: overview?.totalAuditEvents ?? 0, icon: ShieldCheck, tone: 'bg-emerald-50 text-emerald-700' },
  ];

  const loanDistribution = Object.entries(overview?.loanDistributionByStatus || {}).map(([name, value], index) => ({
    name: titleCase(name),
    value,
    color: ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#7c3aed', '#334155'][index % 6],
  }));

  const recentLoans = useMemo(
    () => loans.slice(0, 6).map((loan) => ({ name: loan.borrowerName || `Loan ${loan.id}`, value: loan.amount })),
    [loans]
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[linear-gradient(135deg,_#111827,_#1d4ed8_50%,_#22c55e)] px-8 py-10 text-white shadow-[0_24px_60px_rgba(17,24,39,0.16)]">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-100">Admin command center</p>
        <h1 className="mt-3 text-4xl font-semibold">Platform-wide lending, users, and audit visibility.</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-100/90">
          This overview now pulls from live admin and analytics endpoints instead of browser storage.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <article key={label} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-500">{label}</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">{value}</h2>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Recent loan volume</h2>
          <p className="mt-1 text-sm text-slate-500">Newest loans by borrower amount</p>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={recentLoans}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip formatter={(value) => currency(value)} />
                <Bar dataKey="value" fill="#2563eb" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Loan status mix</h2>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={loanDistribution} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100}>
                  {loanDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-3">
            {loanDistribution.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm font-medium text-slate-700">{entry.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
