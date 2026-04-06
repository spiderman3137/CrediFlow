import { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';
import { TrendingUp, FileText, Download, FileSpreadsheet, AlertTriangle, ShieldAlert, DollarSign, RefreshCw } from 'lucide-react';
import { analyticsService } from '../../../api/analyticsService';
import { adminService } from '../../../api/adminService';
import { excelService } from '../../../api/excelService';
import { reportService } from '../../../api/reportService';
import { currency, titleCase } from '../../lib/crediflow';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../api/responseUtils';

const STATUS_COLORS = {
  PENDING: '#f59e0b', APPROVED: '#2563eb', ACTIVE: '#16a34a',
  REJECTED: '#ef4444', CLOSED: '#64748b', DEFAULTED: '#7c3aed',
};

const PIE_COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#7c3aed', '#64748b'];

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <article className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`}>
      <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </article>
  );
}

export function AdminAnalytics() {
  const [dashboard, setDashboard]       = useState(null);
  const [overview, setOverview]         = useState(null);
  const [loansByStatus, setLBS]         = useState({});
  const [loansByPurpose, setLBP]        = useState({});
  const [userSummary, setUserSummary]   = useState(null);
  const [loading, setLoading]           = useState(true);
  const [exporting, setExporting]       = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [dash, ov, lbs, lbp, us] = await Promise.allSettled([
        analyticsService.getDashboard(),
        adminService.getOverview(),
        analyticsService.getLoansByStatus(),
        analyticsService.getLoansByPurpose(),
        analyticsService.getUserSummary(),
      ]);
      if (dash.status === 'fulfilled')  setDashboard(dash.value);
      if (ov.status === 'fulfilled')    setOverview(ov.value);
      if (lbs.status === 'fulfilled')   setLBS(lbs.value || {});
      if (lbp.status === 'fulfilled')   setLBP(lbp.value || {});
      if (us.status === 'fulfilled')    setUserSummary(us.value);
    } catch (err) {
      console.error('Analytics load error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const loanStatusData = Object.entries(loansByStatus).map(([k, v]) => ({
    name: titleCase(k), value: Number(v), color: STATUS_COLORS[k] || '#94a3b8',
  })).filter(d => d.value > 0);

  const loanPurposeData = Object.entries(loansByPurpose).map(([k, v]) => ({
    name: titleCase(k), value: Number(v),
  })).filter(d => d.value > 0);

  const paymentData = Object.entries(overview?.paymentDistributionByStatus || {}).map(([k, v]) => ({
    name: titleCase(k), value: Number(v),
  })).filter(d => d.value > 0);

  const roleData = Object.entries(overview?.userDistributionByRole || {}).map(([k, v], i) => ({
    name: titleCase(k), value: Number(v), color: PIE_COLORS[i % PIE_COLORS.length],
  })).filter(d => d.value > 0);

  const totalLoans    = dashboard?.totalLoansAppiled ?? 0;
  const activeLoans   = dashboard?.activeLoans ?? 0;
  const rejectedLoans = dashboard?.rejectedLoans ?? 0;
  const disbursed     = dashboard?.totalDisbursedAmount ?? 0;
  const outstanding   = dashboard?.totalOutstandingBalance ?? 0;
  const collected     = dashboard?.totalCollectedPayments ?? 0;
  const efficiency    = Number(dashboard?.collectionEfficiency ?? 0).toFixed(1);

  const handleExport = async (type, label) => {
    setExporting(type);
    try {
      if (type === 'loans-excel')  await excelService.downloadLoansExcel();
      if (type === 'users-excel')  await excelService.downloadUsersExcel();
      if (type === 'summary-pdf')  await reportService.downloadFinancialSummaryPdf();
      if (type === 'summary-csv')  await reportService.downloadFinancialSummaryCsv();
      toast.success(`${label} downloaded!`);
    } catch (err) {
      toast.error(getErrorMessage(err, `Failed to download ${label}.`));
    } finally {
      setExporting('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-[2rem] bg-gradient-to-r from-[#0f172a] via-[#7c3aed] to-[#f59e0b] px-8 py-10 text-white shadow-xl">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-200">Analyst Studio</p>
        <h1 className="mt-2 text-4xl font-bold">Advanced Analytics</h1>
        <p className="mt-2 max-w-3xl text-slate-100/80">
          Deep-dive into loan performance, user composition, payment health, and portfolio trends — all live from the backend.
        </p>
        <button
          onClick={load}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/30 backdrop-blur-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading…' : 'Refresh Data'}
        </button>
      </section>

      {/* KPI Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Loans Applied"    value={totalLoans}           sub={`${activeLoans} active`}             icon={FileText}      color="bg-blue-50 text-blue-700" />
        <StatCard label="Collection Efficiency" value={`${efficiency}%`}     sub="collected vs expected"               icon={TrendingUp}    color="bg-emerald-50 text-emerald-700" />
        <StatCard label="Total Disbursed"        value={currency(disbursed)}  sub={`₹${Number(outstanding).toLocaleString('en-IN')} outstanding`} icon={DollarSign}    color="bg-amber-50 text-amber-700" />
        <StatCard label="Rejected Loans"         value={rejectedLoans}        sub="denied applications"                icon={ShieldAlert}   color="bg-rose-50 text-rose-700" />
      </section>

      {/* Chart Row 1 */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Loan Status Donut */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Loan Status Breakdown</h2>
          <p className="text-sm text-slate-400 mt-0.5">Count of loans per status (live from DB)</p>
          {loanStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={loanStatusData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {loanStatusData.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v,n) => [v, n]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-slate-400">No loan data</div>
          )}
        </article>

        {/* Loan Purpose Bar */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Loans by Purpose</h2>
          <p className="text-sm text-slate-400 mt-0.5">How borrowers are using their loans</p>
          {loanPurposeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={loanPurposeData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[6,6,0,0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-slate-400">No purpose data</div>
          )}
        </article>
      </section>

      {/* Chart Row 2 */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Payment Status Bar */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Payment Status Distribution</h2>
          <p className="text-sm text-slate-400 mt-0.5">All payment records by current state</p>
          {paymentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={paymentData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="value" fill="#7c3aed" radius={[6,6,0,0]} name="Payments" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-slate-400">No payment data</div>
          )}
        </article>

        {/* User Role Pie */}
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">User Role Distribution</h2>
          <p className="text-sm text-slate-400 mt-0.5">Platform composition by role</p>
          {roleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={roleData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {roleData.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v,n) => [v, n]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[280px] items-center justify-center text-slate-400">No user data</div>
          )}
        </article>
      </section>

      {/* Financial Metrics */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Financial Health Overview</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Total Disbursed',      value: currency(disbursed),   pct: 100,                                                    color: 'bg-blue-500' },
            { label: 'Outstanding Balance',  value: currency(outstanding),  pct: disbursed > 0 ? (outstanding / disbursed) * 100 : 0,   color: 'bg-rose-500' },
            { label: 'Payments Collected',   value: currency(collected),    pct: disbursed > 0 ? (collected / disbursed) * 100 : 0,     color: 'bg-emerald-500' },
          ].map(({ label, value, pct, color }) => (
            <div key={label} className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
              <div className="mt-3 h-2 rounded-full bg-slate-200">
                <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(pct, 100).toFixed(1)}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-400">{Math.min(pct, 100).toFixed(1)}% of disbursed</p>
            </div>
          ))}
        </div>
      </section>

      {/* Export Center */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Export Center</h2>
        <p className="mt-1 text-sm text-slate-500">Download reports and data exports</p>
        <div className="mt-5 flex flex-wrap gap-4">
          {[
            { type: 'summary-pdf',  label: 'Financial Summary PDF',  icon: FileText,       color: 'bg-rose-600 hover:bg-rose-700' },
            { type: 'summary-csv',  label: 'Financial Summary CSV',  icon: Download,       color: 'bg-blue-600 hover:bg-blue-700' },
            { type: 'loans-excel',  label: 'Loans Excel Export',     icon: FileSpreadsheet, color: 'bg-emerald-600 hover:bg-emerald-700' },
            { type: 'users-excel',  label: 'Users Excel Export',     icon: FileSpreadsheet, color: 'bg-violet-600 hover:bg-violet-700' },
          ].map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => handleExport(type, label)}
              disabled={!!exporting}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors disabled:opacity-50 ${color}`}
            >
              {exporting === type ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              {exporting === type ? 'Downloading…' : label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
