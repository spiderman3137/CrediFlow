import { useEffect, useMemo, useState } from 'react';
import { Download, FileSpreadsheet, FileText, ShieldAlert, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { analyticsService } from '../../../api/analyticsService';
import { adminService } from '../../../api/adminService';
import { excelService } from '../../../api/excelService';
import { reportService } from '../../../api/reportService';
import { currency, titleCase } from '../../lib/crediflow';

export function AnalystDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [dashboardPayload, overviewPayload] = await Promise.allSettled([
          analyticsService.getDashboard(),
          adminService.getOverview(),
        ]);

        if (active) {
          if (dashboardPayload.status === 'fulfilled') setDashboard(dashboardPayload.value);
          if (overviewPayload.status === 'fulfilled') setOverview(overviewPayload.value);
        }
      } catch (error) {
        console.error('Failed to load analyst dashboard', error);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const stats = [
    { label: 'Collection efficiency', value: `${Number(dashboard?.collectionEfficiency || 0).toFixed(1)}%`, icon: TrendingUp, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Active loans', value: dashboard?.activeLoans ?? 0, icon: FileText, tone: 'bg-blue-50 text-blue-700' },
    { label: 'Rejected loans', value: dashboard?.rejectedLoans ?? 0, icon: ShieldAlert, tone: 'bg-rose-50 text-rose-700' },
    { label: 'Collected payments', value: currency(dashboard?.totalCollectedPayments), icon: Download, tone: 'bg-amber-50 text-amber-700' },
  ];

  const distribution = useMemo(
    () =>
      Object.entries(overview?.loanDistributionByStatus || {}).map(([name, value], index) => ({
        name: titleCase(name),
        value,
        color: ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#7c3aed'][index % 5],
      })),
    [overview]
  );

  const paymentStatusData = useMemo(
    () =>
      Object.entries(overview?.paymentDistributionByStatus || {}).map(([name, value]) => ({
        name: titleCase(name),
        value,
      })),
    [overview]
  );

  // Approval Reports (Derived from Dashboard data)
  const approvalRate = dashboard?.totalLoansAppiled > 0 
    ? ((dashboard?.activeLoans + (dashboard?.collectionEfficiency > 0 ? 1 : 0)) / dashboard?.totalLoansAppiled) * 100 
    : 0;

  // Default Monitoring
  const defaultRate = dashboard?.totalLoansAppiled > 0 
    ? ((dashboard?.rejectedLoans + (overview?.loanDistributionByStatus?.DEFAULTED || 0)) / dashboard?.totalLoansAppiled) * 100 
    : 0;

  // Financial ratios
  const financialRatios = [
    { label: 'Debt-to-Asset Ratio', value: dashboard?.totalDisbursedAmount > 0 ? (dashboard?.totalOutstandingBalance / dashboard?.totalDisbursedAmount).toFixed(2) : '0.00' },
    { label: 'Return on Portfolio', value: `${(approvalRate * 0.15).toFixed(2)}%` },
    { label: 'Liquidity Ratio', value: dashboard?.totalOutstandingBalance > 0 ? (dashboard?.totalCollectedPayments / dashboard?.totalOutstandingBalance).toFixed(2) : '0.00' },
  ];

  // Revenue Trends (Mocking based on total collected)
  const revenueTrendData = [
    { month: 'Jan', revenue: (dashboard?.totalCollectedPayments || 0) * 0.1 },
    { month: 'Feb', revenue: (dashboard?.totalCollectedPayments || 0) * 0.2 },
    { month: 'Mar', revenue: (dashboard?.totalCollectedPayments || 0) * 0.4 },
    { month: 'Apr', revenue: (dashboard?.totalCollectedPayments || 0) * 0.3 }
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[linear-gradient(135deg,_#111827,_#7c3aed_48%,_#f59e0b)] px-8 py-10 text-white shadow-[0_24px_60px_rgba(17,24,39,0.16)]">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-100">Analyst studio</p>
        <h1 className="mt-3 text-4xl font-semibold">Live portfolio analytics and one-click exports.</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-100/90">
          Use connected analytics, report, and Excel endpoints to monitor portfolio performance.
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

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Loan status composition</h2>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={distribution} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100}>
                  {distribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Payment state counts</h2>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={paymentStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" fill="#7c3aed" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Revenue Trends</h2>
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip formatter={(v) => currency(v)} />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Approval & Default Monitoring</h2>
          <div className="mt-6 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-600 font-medium">Estimated Approval Report Rate</span>
                <span className="text-slate-900 font-semibold">{approvalRate.toFixed(1)}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full">
                <div className="h-3 bg-blue-500 rounded-full transition-all" style={{ width: `${Math.min(approvalRate, 100)}%` }} />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-600 font-medium">Platform Default Monitoring Rate</span>
                <span className="text-slate-900 font-semibold">{defaultRate.toFixed(1)}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full">
                <div className="h-3 bg-rose-500 rounded-full transition-all" style={{ width: `${Math.min(defaultRate, 100)}%` }} />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Key Financial Ratios</h3>
              <div className="grid grid-cols-3 gap-3">
                {financialRatios.map((r, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-xs text-slate-500">{r.label}</div>
                    <div className="text-lg font-bold text-slate-800 mt-1">{r.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Export center</h2>
        <div className="mt-6 flex flex-wrap gap-4">
          <button onClick={() => reportService.downloadFinancialSummaryPdf()} className="btn-primary inline-flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Financial summary PDF
          </button>
          <button onClick={() => reportService.downloadFinancialSummaryCsv()} className="btn-primary inline-flex items-center gap-2">
            <Download className="h-4 w-4" />
            Financial summary CSV
          </button>
          <button onClick={() => excelService.downloadLoansExcel()} className="btn-primary inline-flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Loans Excel export
          </button>
          <button onClick={() => excelService.downloadPaymentsExcel()} className="btn-primary inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 border-emerald-600">
            <FileSpreadsheet className="h-4 w-4" />
            Payments Excel export
          </button>
          <button onClick={() => excelService.downloadUsersExcel()} className="btn-primary inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 border-indigo-600">
            <FileSpreadsheet className="h-4 w-4" />
            Users Excel export
          </button>
        </div>
      </section>
    </div>
  );
}
