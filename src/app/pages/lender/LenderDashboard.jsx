<<<<<<< HEAD
import { useMemo } from 'react';
import { BadgeCheck, FileSearch, IndianRupee, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useLoans } from '../../context/LoanContext';
import { loanService } from '../../../api/loanService';
import { currency, formatDate, getLoanStatusTone } from '../../lib/crediflow';
import { getErrorMessage } from '../../../api/responseUtils';

export function LenderDashboard() {
  const { loans, fetchLoans } = useLoans();

  const pendingLoans = useMemo(() => loans.filter((loan) => loan.status === 'PENDING'), [loans]);
  const approvedLoans = useMemo(() => loans.filter((loan) => ['APPROVED', 'ACTIVE'].includes(loan.status)), [loans]);
  const approvedVolume = approvedLoans.reduce((sum, loan) => sum + loan.amount, 0);

  const stats = [
    { label: 'Pending reviews', value: pendingLoans.length, icon: FileSearch, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Approved or active', value: approvedLoans.length, icon: BadgeCheck, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Approved volume', value: currency(approvedVolume), icon: IndianRupee, tone: 'bg-blue-50 text-blue-700' },
    { label: 'Auto decision ready', value: pendingLoans.length, icon: Sparkles, tone: 'bg-violet-50 text-violet-700' },
  ];

  const handleApprove = async (loanId) => {
    try {
      await loanService.approveLoan(loanId, 'Approved by lender dashboard.');
      toast.success('Loan approved.');
      fetchLoans();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to approve loan.'));
    }
  };

  const handleReject = async (loanId) => {
    try {
      await loanService.rejectLoan(loanId, 'Rejected by lender dashboard.');
      toast.success('Loan rejected.');
      fetchLoans();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to reject loan.'));
    }
  };

  const handleAutoEvaluate = async (loanId) => {
    try {
      await loanService.evaluateAndAutoApprove(loanId);
      toast.success('Loan evaluated using platform rules.');
      fetchLoans();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to auto evaluate loan.'));
    }
=======
import { DollarSign, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLoans } from '../../context/LoanContext';
import { useNotifications } from '../../context/NotificationContext';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

// statsData will be computed inside component based on loans

const earningsData = [
  { month: 'Jan', earnings: 6200 },
  { month: 'Feb', earnings: 7100 },
  { month: 'Mar', earnings: 6800 },
  { month: 'Apr', earnings: 7600 },
  { month: 'May', earnings: 8100 },
  { month: 'Jun', earnings: 8450 },
];

export function LenderDashboard() {
  const { loans, updateLoanStatus } = useLoans();
  const { addNotification } = useNotifications();

  const activeCount = loans.filter((l) => l.status === 'approved' || l.status === 'active').length;
  const pendingCount = loans.filter((l) => l.status === 'pending').length;

  const statsData = [
    { name: 'Active Loans', value: String(activeCount), icon: CheckCircle, color: '#28C76F', change: '' },
    { name: 'Pending Applications', value: String(pendingCount), icon: Clock, color: '#FFA940', change: '' },
    { name: 'Total Interest Earned', value: '$0', icon: TrendingUp, color: '#5B2DFF', change: '' },
    { name: 'This Month', value: '$0', icon: DollarSign, color: '#8C6CFF', change: '' },
  ];

  const handleDecision = (loan, status) => {
    updateLoanStatus(loan.id, status);
    addNotification(`Your loan request has been ${status}`, 'borrower');
    toast(`Loan ${status}`);
  };

  const statusBadge = (status) => {
    const map = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
    };
    return map[status] || 'bg-gray-100 text-gray-800';
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
  };

  return (
    <div className="space-y-8">
<<<<<<< HEAD
      <section className="rounded-[2rem] bg-[linear-gradient(135deg,_#0f172a,_#14532d_48%,_#86efac)] px-8 py-10 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-100">Lender workspace</p>
        <h1 className="mt-3 text-4xl font-semibold">Review applications with live risk and repayment context.</h1>
        <p className="mt-3 max-w-3xl text-base text-slate-100/90">
          Approve, reject, or auto-evaluate from the connected loan workflow endpoints.
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

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Applications queue</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
                <th>Loan</th>
                <th>Borrower</th>
                <th>Purpose</th>
                <th>Amount</th>
                <th>Risk</th>
                <th>Status</th>
                <th>Created</th>
=======
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lender Dashboard</h1>
        <p className="text-gray-600">Manage your loan portfolio and track earnings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <span className="text-sm font-semibold text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="card-sharp p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Earnings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="month" stroke="#6B6B6B" />
              <YAxis stroke="#6B6B6B" />
              <Tooltip />
              <Bar dataKey="earnings" fill="#5B2DFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio Distribution */}
        <div className="card-sharp p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Portfolio Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50">
              <div>
                <p className="text-sm text-gray-600">Active Loans</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-xl font-bold text-green-600">$186,500</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50">
              <div>
                <p className="text-sm text-gray-600">Pending Applications</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Requested Amount</p>
                <p className="text-xl font-bold text-orange-600">$42,000</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50">
              <div>
                <p className="text-sm text-gray-600">Overdue Payments</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Amount at Risk</p>
                <p className="text-xl font-bold text-red-600">$8,200</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Loans */}
      <div className="card-sharp p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Loan Applications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Borrower</th>
                <th>Amount</th>
                <th>Interest Rate</th>
                <th>Status</th>
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr>
<<<<<<< HEAD
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    No applications available yet.
=======
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No loan applications yet.
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id}>
<<<<<<< HEAD
                    <td className="font-semibold text-slate-900">#{loan.id}</td>
                    <td>{loan.borrowerName}</td>
                    <td>{loan.purpose || 'General financing'}</td>
                    <td className="font-semibold text-slate-900">{currency(loan.amount)}</td>
                    <td>{loan.riskScore ?? 'N/A'}</td>
                    <td>
                      <span className={getLoanStatusTone(loan.status)}>{loan.statusLabel}</span>
                    </td>
                    <td>{formatDate(loan.createdAt)}</td>
                    <td>
                      {loan.status === 'PENDING' ? (
                        <div className="flex flex-wrap gap-3">
                          <button onClick={() => handleApprove(loan.id)} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                            Approve
                          </button>
                          <button onClick={() => handleReject(loan.id)} className="text-sm font-semibold text-rose-700 hover:text-rose-800">
                            Reject
                          </button>
                          <button onClick={() => handleAutoEvaluate(loan.id)} className="text-sm font-semibold text-violet-700 hover:text-violet-800">
                            Auto evaluate
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">No action</span>
=======
                    <td className="font-semibold text-gray-900">{loan.id}</td>
                    <td className="text-gray-700">{loan.borrowerName}</td>
                    <td className="font-semibold text-gray-900">${loan.amount.toLocaleString()}</td>
                    <td className="text-gray-700">{loan.interest}%</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${statusBadge(
                          loan.status
                        )}`}
                      >
                        {loan.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-gray-700">
                      {loan.status === 'pending' ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleDecision(loan, 'approved')}
                            className="text-sm text-green-600 hover:underline"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecision(loan, 'rejected')}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        '-'
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
<<<<<<< HEAD
      </section>
=======
      </div>
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
    </div>
  );
}
