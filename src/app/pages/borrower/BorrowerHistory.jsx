<<<<<<< HEAD
import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CircleDollarSign, History, ReceiptText, Wallet } from 'lucide-react';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../../api/paymentService';
import { getPageItems } from '../../../api/responseUtils';
import { currency, formatDate, normalizePayment } from '../../lib/crediflow';

export function BorrowerHistory() {
  const { loans } = useLoans();
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

        const merged = paymentPages.flat().sort(
          (left, right) => new Date(right.paymentDate) - new Date(left.paymentDate)
        );

        if (active) {
          setPayments(merged);
        }
      } catch (error) {
        console.error('Failed to load payment history', error);
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

  const totalPaid = payments.filter((payment) => payment.status === 'COMPLETED').reduce((sum, payment) => sum + payment.amount, 0);
  const successfulPayments = payments.filter((payment) => payment.status === 'COMPLETED').length;
  const failedPayments = payments.filter((payment) => payment.status === 'FAILED').length;
  const averagePayment = successfulPayments ? totalPaid / successfulPayments : 0;

  const chartData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));

    const paid = payments
      .filter((payment) => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate.getMonth() === date.getMonth() && paymentDate.getFullYear() === date.getFullYear() && payment.status === 'COMPLETED';
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      month: date.toLocaleDateString('en-IN', { month: 'short' }),
      paid,
    };
  });

  const stats = [
    { label: 'Total collected', value: currency(totalPaid), icon: Wallet, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Successful payments', value: successfulPayments, icon: ReceiptText, tone: 'bg-blue-50 text-blue-700' },
    { label: 'Failed payments', value: failedPayments, icon: History, tone: 'bg-rose-50 text-rose-700' },
    { label: 'Average payment', value: currency(averagePayment), icon: CircleDollarSign, tone: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-900">Payment history</h1>
        <p className="mt-2 text-slate-500">A complete backend-backed ledger of your repayments across every loan.</p>
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
        <h2 className="text-xl font-semibold text-slate-900">Six-month collection view</h2>
        <p className="mt-1 text-sm text-slate-500">Only completed transactions are included in this chart.</p>
        <div className="mt-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip formatter={(value) => currency(value)} />
              <Bar dataKey="paid" fill="#16a34a" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Transaction ledger</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
                <th>Date</th>
                <th>Loan</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No payment records yet. Transactions will appear here after repayments begin.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{formatDate(payment.paymentDate)}</td>
                    <td className="font-semibold text-slate-900">#{payment.loanId}</td>
                    <td className="font-semibold text-slate-900">{currency(payment.amount)}</td>
                    <td>{payment.methodLabel}</td>
                    <td>
                      <span className={payment.status === 'COMPLETED' ? 'badge-active' : payment.status === 'FAILED' ? 'badge-defaulted' : 'badge-pending'}>
                        {payment.statusLabel}
                      </span>
                    </td>
                    <td className="text-slate-500">{payment.transactionReference || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
=======
import { History, DollarSign, CheckCircle, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';

function generatePaymentHistory(userLoans) {
    if (userLoans.length === 0) return [];

    const payments = [];
    const methods = ['Auto-debit', 'UPI', 'Net Banking', 'Card'];

    userLoans.forEach((loan) => {
        const principal = Number(loan.amount) || 0;
        const annualRate = Number(loan.interest) || 0;
        const termMonths = Number(loan.term) || 12;
        const monthlyRate = annualRate / 100 / 12;

        let emi;
        if (monthlyRate === 0) {
            emi = principal / termMonths;
        } else {
            emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
                (Math.pow(1 + monthlyRate, termMonths) - 1);
        }

        const startDate = loan.createdAt ? new Date(loan.createdAt) : new Date();

        // Mock: first 2 EMIs have been paid
        for (let i = 1; i <= 2; i++) {
            const payDate = new Date(startDate);
            payDate.setMonth(payDate.getMonth() + i);

            payments.push({
                id: `${loan.id}-${i}`,
                date: payDate,
                loanId: loan.id,
                amount: emi,
                method: methods[i % methods.length],
                status: 'completed',
            });
        }
    });

    // Sort by date descending
    payments.sort((a, b) => b.date - a.date);
    return payments;
}

function getMonthlyChartData(payments) {
    const monthMap = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    payments.forEach((p) => {
        const key = `${monthNames[p.date.getMonth()]} ${p.date.getFullYear()}`;
        monthMap[key] = (monthMap[key] || 0) + p.amount;
    });

    // Pad with 6 months including empty ones
    const now = new Date();
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        chartData.push({ month: monthNames[d.getMonth()], paid: Math.round(monthMap[key] || 0) });
    }

    return chartData;
}

export function BorrowerHistory() {
    const { loans } = useLoans();
    const { user } = useAuth();

    const userLoans = loans.filter((l) => user && l.borrowerId === user.id);
    const payments = generatePaymentHistory(userLoans);
    const chartData = getMonthlyChartData(payments);

    const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
    const paymentCount = payments.length;
    const avgPayment = paymentCount > 0 ? totalPaid / paymentCount : 0;
    const lastPayment = payments.length > 0 ? payments[0].date : null;

    const statsData = [
        { name: 'Total Paid', value: '$' + Math.round(totalPaid).toLocaleString(), icon: DollarSign, color: '#28C76F' },
        { name: 'Payments Made', value: String(paymentCount), icon: CheckCircle, color: '#5B2DFF' },
        { name: 'Average Payment', value: '$' + Math.round(avgPayment).toLocaleString(), icon: History, color: '#FFA940' },
        { name: 'Last Payment', value: lastPayment ? lastPayment.toLocaleDateString() : '-', icon: Calendar, color: '#2563EB' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
                <p className="text-gray-600">Track all your past loan payments</p>
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

            {/* Payment Chart */}
            <div className="card-sharp p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Monthly Payments (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                        <XAxis dataKey="month" stroke="#6B6B6B" />
                        <YAxis stroke="#6B6B6B" />
                        <Tooltip />
                        <Bar dataKey="paid" fill="#28C76F" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Payment Table */}
            <div className="card-sharp p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">All Payments</h3>
                <div className="overflow-x-auto">
                    <table className="table-sharp">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Loan ID</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 text-gray-500">
                                        No payment history yet. Payments will appear here once you have active loans.
                                    </td>
                                </tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.id}>
                                        <td className="text-gray-700">{payment.date.toLocaleDateString()}</td>
                                        <td className="font-semibold text-gray-900">{payment.loanId}</td>
                                        <td className="font-semibold text-gray-900">${payment.amount.toFixed(2)}</td>
                                        <td className="text-gray-700">{payment.method}</td>
                                        <td>
                                            <span className="badge-active">
                                                {payment.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
}
