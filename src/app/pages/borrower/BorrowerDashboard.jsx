<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarClock, CreditCard, Landmark, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../../api/paymentService';
import { getPageItems } from '../../../api/responseUtils';
import { currency, formatDate, getLoanStatusTone, normalizePayment } from '../../lib/crediflow';

export function BorrowerDashboard() {
  const { loans, loading } = useLoans();
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);

  const borrowerLoans = useMemo(
    () => loans.filter((loan) => loan.borrowerId === user?.id),
    [loans, user?.id]
  );

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      try {
        const paymentPages = await Promise.all(
          borrowerLoans.map(async (loan) => {
            const payload = await paymentService.getPaymentsByLoan(loan.id);
            return getPageItems(payload).map(normalizePayment);
          })
        );

        if (active) {
          setPayments(paymentPages.flat());
        }
      } catch (error) {
        console.error('Failed to load borrower payments', error);
        if (active) {
          setPayments([]);
        }
      }
    }

    if (borrowerLoans.length) {
      loadPayments();
    } else {
      setPayments([]);
    }

    return () => {
      active = false;
    };
  }, [borrowerLoans]);

  const completedPayments = payments.filter((payment) => payment.status === 'COMPLETED');
  const totalBorrowed = borrowerLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalPaid = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const outstandingBalance = borrowerLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
  const activeLoans = borrowerLoans.filter((loan) => ['APPROVED', 'ACTIVE'].includes(loan.status)).length;
  const nextDueLoan = borrowerLoans.find((loan) => ['APPROVED', 'ACTIVE', 'PENDING'].includes(loan.status));

  const chartData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const key = `${date.getMonth()}-${date.getFullYear()}`;

    const paid = completedPayments
      .filter((payment) => {
        const paymentDate = new Date(payment.paymentDate);
        return `${paymentDate.getMonth()}-${paymentDate.getFullYear()}` === key;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      month: date.toLocaleDateString('en-IN', { month: 'short' }),
      paid,
    };
  });

  const stats = [
    { label: 'Active loans', value: activeLoans, icon: CreditCard, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Outstanding balance', value: currency(outstandingBalance), icon: Wallet, tone: 'bg-rose-50 text-rose-700' },
    { label: 'Total paid', value: currency(totalPaid), icon: Landmark, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Next due', value: nextDueLoan ? formatDate(nextDueLoan.startDate || nextDueLoan.createdAt) : '-', icon: CalendarClock, tone: 'bg-sky-50 text-sky-700' },
=======
import { DollarSign, CreditCard, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';

// statsData will be computed inside component

const initialPaymentHistory = [
  { month: 'Jan', paid: 1125 },
  { month: 'Feb', paid: 1125 },
  { month: 'Mar', paid: 0 },
  { month: 'Apr', paid: 0 },
  { month: 'May', paid: 0 },
  { month: 'Jun', paid: 0 },
];

// activeLoans will be derived from loan context inside component

export function BorrowerDashboard() {
  const { loans } = useLoans();
  const { user } = useAuth();

  const userLoans = loans.filter((l) => user && l.borrowerId === user.id);

  const totalBorrowed = userLoans.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const totalPaid = userLoans.length > 0 ? 6750 : 0; // Mock paid amount if loans exist
  const remainingBalance = totalBorrowed - totalPaid;
  const interestAccrued = userLoans.reduce((s, l) => s + ((Number(l.amount) || 0) * (Number(l.interest) || 0) / 100), 0);

  const paymentHistory = initialPaymentHistory.map(p => ({
    ...p,
    paid: userLoans.length > 0 ? p.paid : 0
  }));

  const statsData = [
    { name: 'Active Loans', value: String(userLoans.length), icon: CreditCard, color: '#5B2DFF' },
    { name: 'Remaining Balance', value: '$' + Math.max(0, remainingBalance).toLocaleString(), icon: DollarSign, color: '#FF4D4F' },
    { name: 'Next EMI Due', value: userLoans.length > 0 && userLoans[0]?.createdAt ? new Date(new Date(userLoans[0].createdAt).setMonth(new Date(userLoans[0].createdAt).getMonth() + 1)).toLocaleDateString() : '-', icon: Calendar, color: '#FFA940' },
    { name: 'Total Paid', value: '$' + totalPaid.toLocaleString(), icon: TrendingUp, color: '#28C76F' },
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
  ];

  return (
    <div className="space-y-8">
<<<<<<< HEAD
      <section className="rounded-[2rem] bg-[linear-gradient(135deg,_#0f172a,_#1d4ed8_55%,_#38bdf8)] px-8 py-10 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-100">Borrower workspace</p>
            <h1 className="text-4xl font-semibold">Track applications, balances, and repayment health.</h1>
            <p className="text-base text-sky-100/90">
              Your dashboard now reflects live loan and payment records from the backend.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/borrower/apply" className="rounded-2xl bg-white px-5 py-4 font-semibold text-slate-900 transition hover:bg-sky-50">
              Apply for a loan
            </Link>
            <Link to="/borrower/history" className="rounded-2xl border border-white/20 px-5 py-4 font-semibold text-white transition hover:bg-white/10">
              Review repayments
            </Link>
          </div>
        </div>
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

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Payment trend</h2>
              <p className="text-sm text-slate-500">Completed payments over the last six months</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip formatter={(value) => currency(value)} />
              <Bar dataKey="paid" fill="#2563eb" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Portfolio summary</h2>
          <div className="mt-6 space-y-5">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Total sanctioned</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{currency(totalBorrowed)}</p>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-5">
              <p className="text-sm text-emerald-700">Repaid so far</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-900">{currency(totalPaid)}</p>
            </div>
            <div className="rounded-3xl bg-rose-50 p-5">
              <p className="text-sm text-rose-700">Remaining obligation</p>
              <p className="mt-2 text-3xl font-semibold text-rose-900">{currency(outstandingBalance)}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Your loans</h2>
            <p className="text-sm text-slate-500">Latest applications and repayment positions</p>
          </div>
          <Link to="/borrower/balance" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
            View balance details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

=======
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Borrower Dashboard</h1>
        <p className="text-gray-600">Manage your loans and track payments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card-sharp p-6">
              <div
                className="w-12 h-12 flex items-center justify-center mb-4"
                style={{ backgroundColor: stat.color + '20' }}
              >
                <Icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Alert */}
      {userLoans.length > 0 && (
        <div className="card-sharp p-6 bg-orange-50 border-2 border-orange-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">Upcoming Payment Due</h3>
              <p className="text-sm text-orange-700 mb-3">
                Your next EMI of <strong>${((totalBorrowed * 1.1) / 12).toFixed(2)}</strong> is due on <strong>{statsData[2].value}</strong>
              </p>
              <button className="btn-primary text-sm px-6 py-2">Pay Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Charts & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment History */}
        <div className="card-sharp p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Payment History (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={paymentHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="month" stroke="#6B6B6B" />
              <YAxis stroke="#6B6B6B" />
              <Tooltip />
              <Bar dataKey="paid" fill="#28C76F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Loan Breakdown */}
        <div className="card-sharp p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Loan Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Borrowed</span>
                <span className="font-bold text-gray-900">${totalBorrowed.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-200">
                <div className="h-2 bg-[#5B2DFF]" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Amount Paid</span>
                <span className="font-bold text-green-600">${totalPaid.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-200">
                <div className="h-2 bg-green-600" style={{ width: totalBorrowed > 0 ? `${(totalPaid / totalBorrowed) * 100}%` : '0%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Remaining Balance</span>
                <span className="font-bold text-red-600">${Math.max(0, remainingBalance).toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-200">
                <div className="h-2 bg-red-600" style={{ width: totalBorrowed > 0 ? `${(Math.max(0, remainingBalance) / totalBorrowed) * 100}%` : '0%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Interest Accrued</span>
                <span className="font-bold text-orange-600">${interestAccrued.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Loans */}
      <div className="card-sharp p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Your Active Loans</h3>
          <button className="text-[#5B2DFF] hover:text-[#3A1FBF] font-semibold text-sm">
            View All →
          </button>
        </div>
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
        <div className="overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
<<<<<<< HEAD
                <th>Loan</th>
                <th>Purpose</th>
                <th>Amount</th>
                <th>EMI</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {!loading && borrowerLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No loans found yet. Submit your first application to get started.
                  </td>
                </tr>
              ) : (
                borrowerLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="font-semibold text-slate-900">#{loan.id}</td>
                    <td className="text-slate-700">{loan.purpose || 'General financing'}</td>
                    <td className="font-semibold text-slate-900">{currency(loan.amount)}</td>
                    <td>{currency(loan.emiAmount)}</td>
                    <td className="font-semibold text-rose-700">{currency(loan.remainingBalance)}</td>
                    <td>
                      <span className={getLoanStatusTone(loan.status)}>{loan.statusLabel}</span>
                    </td>
                    <td>{formatDate(loan.createdAt)}</td>
=======
                <th>Loan ID</th>
                <th>Lender</th>
                <th>Amount</th>
                <th>Balance</th>
                <th>Interest Rate</th>
                <th>EMI Amount</th>
                <th>Next Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userLoans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    No active loans
                  </td>
                </tr>
              ) : (
                userLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="font-semibold text-gray-900">{loan.id}</td>
                    <td className="text-gray-700">N/A</td>
                    <td className="font-semibold text-gray-900">
                      ${Number(loan.amount).toLocaleString()}
                    </td>
                    <td className="font-semibold text-red-600">${(Number(loan.amount) - (totalPaid / userLoans.length)).toLocaleString()}</td>
                    <td className="text-gray-700">{loan.interest || 0}%</td>
                    <td className="font-semibold text-gray-900">${((Number(loan.amount) * (1 + (Number(loan.interest) || 0) / 100)) / (loan.term || 12)).toFixed(2)}</td>
                    <td className="text-gray-700">{loan.createdAt ? new Date(new Date(loan.createdAt).setMonth(new Date(loan.createdAt).getMonth() + 1)).toLocaleDateString() : '-'}</td>
                    <td>
                      <span className="badge-active">
                        {loan.status.toUpperCase()}
                      </span>
                    </td>
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="card-sharp p-6 hover:bg-[#F3F0FF] transition-colors text-left">
          <div className="w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6 text-[#5B2DFF]" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Make Payment</h3>
          <p className="text-sm text-gray-600">Pay your upcoming EMI</p>
        </button>

        <button className="card-sharp p-6 hover:bg-[#F3F0FF] transition-colors text-left">
          <div className="w-12 h-12 bg-green-100 flex items-center justify-center mb-4">
            <CreditCard className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Apply for New Loan</h3>
          <p className="text-sm text-gray-600">Submit a new loan request</p>
        </button>

        <button className="card-sharp p-6 hover:bg-[#F3F0FF] transition-colors text-left">
          <div className="w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">View EMI Schedule</h3>
          <p className="text-sm text-gray-600">Check your payment calendar</p>
        </button>
      </div>
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
    </div>
  );
}
