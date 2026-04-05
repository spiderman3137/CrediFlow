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
        const [dashboardPayload, overviewPayload] = await Promise.all([
          analyticsService.getDashboard(),
          adminService.getOverview(),
        ]);

        if (active) {
          setDashboard(dashboardPayload);
          setOverview(overviewPayload);
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
        </div>
      </section>
    </div>
  );
}
