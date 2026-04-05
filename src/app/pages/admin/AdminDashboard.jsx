<<<<<<< HEAD
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
=======
import { Users, FileText, CreditCard, TrendingDown, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useLoans } from '../../context/LoanContext';
import { useNotifications } from '../../context/NotificationContext';
import { useState, useEffect } from 'react';

export function AdminDashboard() {
  const { loans } = useLoans();
  const { notifications } = useNotifications();
  const [userCount, setUserCount] = useState(0);
  const [usersByRole, setUsersByRole] = useState({});

  useEffect(() => {
    const registeredUsers = JSON.parse(localStorage.getItem('crediflow_registered_users') || '{}');
    const entries = Object.entries(registeredUsers);
    setUserCount(entries.length);
    const roleMap = {};
    entries.forEach(([, data]) => {
      const role = (data.role || 'borrower').charAt(0).toUpperCase() + (data.role || 'borrower').slice(1);
      roleMap[role] = (roleMap[role] || 0) + 1;
    });
    setUsersByRole(roleMap);
  }, []);

  // Compute real stats
  const activeLoans = loans.filter((l) => l.status === 'active' || l.status === 'approved').length;
  const pendingLoans = loans.filter((l) => l.status === 'pending').length;
  const rejectedLoans = loans.filter((l) => l.status === 'rejected').length;
  const completedLoans = loans.filter((l) => l.status === 'completed').length;
  const totalLoanAmount = loans.reduce((sum, l) => sum + (l.amount || 0), 0);

  const statsData = [
    { name: 'Total Users', value: String(userCount), icon: Users, color: '#5B2DFF' },
    { name: 'Active Loans', value: String(activeLoans), icon: FileText, color: '#28C76F' },
    { name: 'Pending Loans', value: String(pendingLoans), icon: CreditCard, color: '#FFA940' },
    { name: 'Rejected', value: String(rejectedLoans), icon: TrendingDown, color: '#FF4D4F' },
    { name: 'Total Volume', value: '$' + totalLoanAmount.toLocaleString(), icon: DollarSign, color: '#8C6CFF' },
  ];

  // Loan distribution for pie chart
  const loanDistribution = [
    { name: 'Active', value: activeLoans, color: '#28C76F' },
    { name: 'Completed', value: completedLoans, color: '#5B2DFF' },
    { name: 'Pending', value: pendingLoans, color: '#FFA940' },
    { name: 'Rejected', value: rejectedLoans, color: '#FF4D4F' },
  ].filter((d) => d.value > 0);

  // Loan amounts bar chart data — group by recent loans
  const loanBarData = loans.slice(0, 6).map((loan, i) => ({
    label: loan.borrowerName || `Loan ${i + 1}`,
    amount: loan.amount || 0,
  }));

  // User role distribution for display
  const roleDistribution = Object.entries(usersByRole).map(([role, count]) => ({
    name: role,
    value: count,
    color:
      role === 'Borrower'
        ? '#5B2DFF'
        : role === 'Lender'
          ? '#28C76F'
          : role === 'Analyst'
            ? '#FFA940'
            : '#8C6CFF',
  }));

  // Recent activities from notifications
  const recentActivities = notifications.slice(0, 5).map((n, i) => ({
    id: n.id || i,
    action: n.message,
    user: n.targetRole ? `To: ${n.targetRole}` : '',
    time: n.createdAt ? timeAgo(n.createdAt) : '',
    type: n.targetRole === 'lender' ? 'loan' : n.targetRole === 'borrower' ? 'approval' : 'user',
  }));

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview — all data is live from the system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card-sharp p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 flex items-center justify-center"
                  style={{ backgroundColor: stat.color + '20' }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loan Amounts Bar Chart */}
        <div className="lg:col-span-2 card-sharp p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            {loanBarData.length > 0 ? 'Recent Loan Amounts' : 'Loan Amounts'}
          </h3>
          {loanBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={loanBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="label" stroke="#6B6B6B" />
                <YAxis stroke="#6B6B6B" />
                <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Amount']} />
                <Bar dataKey="amount" fill="#5B2DFF" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">
              No loan data yet. Charts will populate when borrowers apply for loans.
            </div>
          )}
        </div>

        {/* Loan Distribution Pie */}
        <div className="card-sharp p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Loan Status</h3>
          {loanDistribution.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={loanDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {loanDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {loanDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
              No loans yet
            </div>
          )}
        </div>
      </div>

      {/* User Role Distribution + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <div className="card-sharp p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Users by Role</h3>
          {roleDistribution.length > 0 ? (
            <div className="space-y-4">
              {roleDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 flex items-center justify-center"
                    style={{ backgroundColor: item.color + '20' }}
                  >
                    <Users className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900">{item.name}</span>
                      <span className="text-sm font-bold text-gray-700">{item.value}</span>
                    </div>
                    <div className="h-2 bg-gray-200">
                      <div
                        className="h-2"
                        style={{
                          width: `${(item.value / userCount) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
              No registered users yet
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card-sharp p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 bg-[#F8F8F8] hover:bg-[#F3F0FF] transition-colors"
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center ${activity.type === 'loan'
                        ? 'bg-blue-100'
                        : activity.type === 'payment'
                          ? 'bg-green-100'
                          : activity.type === 'user'
                            ? 'bg-purple-100'
                            : 'bg-orange-100'
                      }`}
                  >
                    {activity.type === 'loan' && <FileText className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'payment' && <DollarSign className="w-5 h-5 text-green-600" />}
                    {activity.type === 'user' && <Users className="w-5 h-5 text-purple-600" />}
                    {activity.type === 'approval' && <CreditCard className="w-5 h-5 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400 text-sm">
                No activities yet. Actions like loan applications and approvals will show here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to display time-ago strings
function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
