import { useEffect, useState } from 'react';
import {
  Activity, CircleDollarSign, ShieldCheck, Users,
  TrendingUp, AlertTriangle, FileText, Wallet,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import { adminService } from '../../../api/adminService';
import { analyticsService } from '../../../api/analyticsService';
import { currency, titleCase, formatDate } from '../../lib/crediflow';
import { excelService } from '../../../api/excelService';

const STATUS_COLORS = {
  PENDING:   '#f59e0b',
  APPROVED:  '#2563eb',
  ACTIVE:    '#16a34a',
  REJECTED:  '#ef4444',
  CLOSED:    '#64748b',
  DEFAULTED: '#7c3aed',
};

const ROLE_COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#7c3aed', '#ef4444'];

function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
      </div>
    </article>
  );
}

function LoadingCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-12 w-12 rounded-2xl bg-slate-200" />
      <div className="mt-3 h-3 w-24 rounded bg-slate-200" />
      <div className="mt-2 h-6 w-16 rounded bg-slate-200" />
    </div>
  );
}

export function AdminDashboard() {
  const [overview, setOverview]       = useState(null);
  const [dashboard, setDashboard]     = useState(null);
  const [loansByStatus, setLBStatus]  = useState(null);
  const [loansByPurpose, setLBPurpose] = useState(null);
  const [userSummary, setUserSummary] = useState(null);
  const [auditLogs, setAuditLogs]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [
          overviewPayload,
          dashboardPayload,
          lbsPayload,
          lbpPayload,
          uSummaryPayload,
          auditPayload,
        ] = await Promise.allSettled([
          adminService.getOverview(),
          analyticsService.getDashboard(),
          analyticsService.getLoansByStatus(),
          analyticsService.getLoansByPurpose(),
          analyticsService.getUserSummary(),
          analyticsService.getRecentAuditLogs(),
        ]);

        if (!active) return;

        if (overviewPayload.status === 'fulfilled')  setOverview(overviewPayload.value);
        if (dashboardPayload.status === 'fulfilled') setDashboard(dashboardPayload.value);
        if (lbsPayload.status === 'fulfilled')       setLBStatus(lbsPayload.value);
        if (lbpPayload.status === 'fulfilled')       setLBPurpose(lbpPayload.value);
        if (uSummaryPayload.status === 'fulfilled')  setUserSummary(uSummaryPayload.value);
        if (auditPayload.status === 'fulfilled')     setAuditLogs(Array.isArray(auditPayload.value) ? auditPayload.value.slice(0, 8) : []);

        const anyFailed = [overviewPayload, dashboardPayload].some(r => r.status === 'rejected');
        if (anyFailed) setError('Some dashboard data failed to load. Data shown may be partial.');
      } catch (err) {
        if (active) setError('Dashboard data could not be loaded. Check your connection.');
        console.error('Failed to load admin dashboard', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  // ─── Derived chart data ───────────────────────────────────────────────────
  const loanStatusChartData = Object.entries(loansByStatus || overview?.loanDistributionByStatus || {})
    .map(([name, value]) => ({ name: titleCase(name), value: Number(value), color: STATUS_COLORS[name] || '#94a3b8' }))
    .filter(d => d.value > 0);

  const loanPurposeChartData = Object.entries(loansByPurpose || {})
    .map(([name, value]) => ({ name: titleCase(name), value: Number(value) }))
    .filter(d => d.value > 0);

  const userRoleChartData = Object.entries(
    userSummary ? {
      BORROWER: userSummary.totalBorrowers,
      LENDER:   userSummary.totalLenders,
      ANALYST:  userSummary.totalAnalysts,
      ADMIN:    userSummary.totalAdmins,
    } : overview?.userDistributionByRole || {}
  ).map(([name, value], i) => ({
    name: titleCase(name),
    value: Number(value),
    color: ROLE_COLORS[i % ROLE_COLORS.length],
  })).filter(d => d.value > 0);

  const paymentDistData = Object.entries(overview?.paymentDistributionByStatus || {})
    .map(([name, value]) => ({ name: titleCase(name), value: Number(value) }))
    .filter(d => d.value > 0);

  const totalUsers   = userSummary?.totalUsers ?? overview?.totalActiveUsers ?? 0;
  const totalLoans   = dashboard?.totalLoansAppiled ?? 0;
  const outstanding  = dashboard?.totalOutstandingBalance ?? 0;
  const disbursed    = dashboard?.totalDisbursedAmount ?? 0;
  const auditEvents  = overview?.totalAuditEvents ?? 0;
  const efficiency   = Number(dashboard?.collectionEfficiency ?? 0).toFixed(1);

  const stats = [
    { label: 'Total Users',          value: totalUsers,          icon: Users,           color: 'bg-blue-50 text-blue-700',    sub: `${overview?.totalActiveUsers ?? 0} active` },
    { label: 'Loans Applied',         value: totalLoans,          icon: Activity,        color: 'bg-amber-50 text-amber-700',  sub: `${dashboard?.activeLoans ?? 0} active` },
    { label: 'Outstanding Balance',   value: currency(outstanding), icon: CircleDollarSign, color: 'bg-rose-50 text-rose-700',    sub: `${currency(disbursed)} disbursed` },
    { label: 'Collection Efficiency', value: `${efficiency}%`,   icon: TrendingUp,      color: 'bg-emerald-50 text-emerald-700', sub: 'payments collected' },
    { label: 'Audit Events',          value: auditEvents,         icon: ShieldCheck,     color: 'bg-violet-50 text-violet-700', sub: 'total logged' },
    { label: 'Rejected Loans',        value: dashboard?.rejectedLoans ?? 0, icon: AlertTriangle, color: 'bg-orange-50 text-orange-700', sub: 'denied' },
    { label: 'Payments Collected',    value: currency(dashboard?.totalCollectedPayments), icon: Wallet,    color: 'bg-teal-50 text-teal-700', sub: 'total repaid' },
    { label: 'Active Loans',          value: dashboard?.activeLoans ?? 0, icon: FileText, color: 'bg-indigo-50 text-indigo-700', sub: 'currently running' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="rounded-[2rem] bg-gradient-to-r from-[#0f172a] via-[#1d4ed8] to-[#059669] px-8 py-10 text-white shadow-[0_24px_60px_rgba(17,24,39,0.2)]">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-200">Admin Command Center</p>
        <h1 className="mt-3 text-4xl font-bold">Platform Analytics Dashboard</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-100/80">
          Live data from the backend — users, loans, payments, and audit trail in one view.
        </p>
        {error && (
          <div className="mt-4 rounded-xl bg-amber-500/20 border border-amber-400/40 px-4 py-2 text-sm text-amber-100">
            ⚠ {error}
          </div>
        )}
      </section>

      {/* Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <LoadingCard key={i} />)
          : stats.map((s) => <StatCard key={s.label} {...s} />)
        }
      </section>

      {/* Charts Row 1 */}
      <section className="grid gap-6 xl:grid-cols-3">
        {/* Loan Status Pie */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Loan Status Distribution</h2>
          <p className="mt-1 text-sm text-slate-500">Breakdown by current status</p>
          <div className="mt-4">
            {loanStatusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={loanStatusChartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {loanStatusChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v, 'Loans']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[240px] items-center justify-center text-slate-400 text-sm">No loan data yet</div>
            )}
          </div>
        </article>

        {/* Loan Purpose Bar */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Loans by Purpose</h2>
          <p className="mt-1 text-sm text-slate-500">Count per loan category</p>
          <div className="mt-4">
            {loanPurposeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={loanPurposeChartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} name="Loans" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[240px] items-center justify-center text-slate-400 text-sm">No purpose data yet</div>
            )}
          </div>
        </article>

        {/* User Role Pie */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">User Role Mix</h2>
          <p className="mt-1 text-sm text-slate-500">Platform users by role</p>
          <div className="mt-4">
            {userRoleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={userRoleChartData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                    {userRoleChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v, 'Users']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[240px] items-center justify-center text-slate-400 text-sm">No user data yet</div>
            )}
          </div>
        </article>
      </section>

      {/* Charts Row 2 */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Payment Status Bar */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Payment Status Counts</h2>
          <p className="mt-1 text-sm text-slate-500">All payment records by status</p>
          <div className="mt-4">
            {paymentDistData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={paymentDistData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Payments" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[240px] items-center justify-center text-slate-400 text-sm">No payment data yet</div>
            )}
          </div>
        </article>

        {/* Key Metrics Summary */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Portfolio Summary</h2>
          <p className="mt-1 text-sm text-slate-500">Key lending metrics at a glance</p>
          <div className="mt-5 space-y-3">
            {[
              { label: 'Total Disbursed',        value: currency(disbursed),                         bar: 100,                           color: 'bg-blue-500' },
              { label: 'Outstanding Balance',    value: currency(outstanding),                        bar: disbursed > 0 ? (outstanding / disbursed) * 100 : 0, color: 'bg-rose-500' },
              { label: 'Collected Payments',     value: currency(dashboard?.totalCollectedPayments), bar: disbursed > 0 ? ((disbursed - outstanding) / disbursed) * 100 : 0, color: 'bg-emerald-500' },
              { label: 'Total Borrowers',        value: userSummary?.totalBorrowers ?? 0,            bar: totalUsers > 0 ? ((userSummary?.totalBorrowers ?? 0) / totalUsers) * 100 : 0, color: 'bg-amber-500' },
              { label: 'Total Lenders',          value: userSummary?.totalLenders ?? 0,              bar: totalUsers > 0 ? ((userSummary?.totalLenders ?? 0) / totalUsers) * 100 : 0, color: 'bg-violet-500' },
            ].map(({ label, value, bar, color }) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-slate-900">{value}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100">
                  <div className={`h-2 rounded-full ${color} transition-all duration-700`} style={{ width: `${Math.min(bar, 100).toFixed(1)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Recent Audit Logs */}
      {auditLogs.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent Audit Trail</h2>
          <p className="mt-1 text-sm text-slate-500">Last 8 system events</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-3 font-semibold text-slate-500">Action</th>
                  <th className="pb-3 font-semibold text-slate-500">Entity</th>
                  <th className="pb-3 font-semibold text-slate-500">User</th>
                  <th className="pb-3 font-semibold text-slate-500">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log, i) => (
                  <tr key={log.id ?? i} className="hover:bg-slate-50">
                    <td className="py-2 font-medium text-slate-900">{titleCase(log.action || 'Unknown')}</td>
                    <td className="py-2 text-slate-600">{titleCase(log.entityType || '-')} {log.entityId ? `#${log.entityId}` : ''}</td>
                    <td className="py-2 text-slate-600">{log.performedBy || log.userId || '-'}</td>
                    <td className="py-2 text-slate-400">{formatDate(log.createdAt || log.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Admin Export & Import Center */}
      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Admin Actions: Bulk Excel Import / Export</h2>
        <p className="mt-1 text-sm text-slate-500 mb-6">Download your system data or bulk upload via templates.</p>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Export Panel */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Export Records</h3>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => excelService.downloadUsersExcel()} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                Users Report (XLSX)
              </button>
              <button onClick={() => excelService.downloadLoansExcel()} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
                Loans Report (XLSX)
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap gap-3">
              <button onClick={() => excelService.downloadUsersTemplate()} className="text-sm text-blue-600 hover:underline">
                Download Users Template
              </button>
              <button onClick={() => excelService.downloadLoansTemplate()} className="text-sm text-blue-600 hover:underline">
                Download Loans Template
              </button>
            </div>
          </div>

          {/* Import Panel */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Bulk Import</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Upload Users</label>
                <input 
                  type="file" 
                  accept=".xlsx, .xls"
                  onChange={async (e) => {
                    if(e.target.files[0]) {
                      await excelService.uploadUsersExcel(e.target.files[0]);
                      alert("Users uploaded successfully!");
                    }
                  }}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Upload Loans</label>
                <input 
                  type="file" 
                  accept=".xlsx, .xls"
                  onChange={async (e) => {
                    if(e.target.files[0]) {
                      await excelService.uploadLoansExcel(e.target.files[0]);
                      alert("Loans uploaded successfully!");
                    }
                  }}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
