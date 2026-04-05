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
}
