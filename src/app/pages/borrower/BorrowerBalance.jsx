import { useEffect, useMemo, useState } from 'react';
import { ChartNoAxesColumn, Landmark, PiggyBank, WalletMinimal } from 'lucide-react';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../../api/paymentService';
import { getPageItems } from '../../../api/responseUtils';
import { currency, formatDate } from '../../lib/crediflow';

export function BorrowerBalance() {
  const { loans } = useLoans();
  const { user } = useAuth();
  const [paymentsByLoan, setPaymentsByLoan] = useState({});

  const borrowerLoans = useMemo(
    () => loans.filter((loan) => loan.borrowerId === user?.id),
    [loans, user?.id]
  );

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      try {
        const entries = await Promise.all(
          borrowerLoans.map(async (loan) => {
            const payload = await paymentService.getPaymentsByLoan(loan.id);
            const paid = getPageItems(payload)
              .filter((payment) => payment.status === 'COMPLETED')
              .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
            return [loan.id, paid];
          })
        );

        if (active) {
          setPaymentsByLoan(Object.fromEntries(entries));
        }
      } catch (error) {
        console.error('Failed to load balance data', error);
        if (active) {
          setPaymentsByLoan({});
        }
      }
    }

    if (borrowerLoans.length) {
      loadPayments();
    } else {
      setPaymentsByLoan({});
    }

    return () => {
      active = false;
    };
  }, [borrowerLoans]);

  const totalBorrowed = borrowerLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalPaid = Object.values(paymentsByLoan).reduce((sum, value) => sum + value, 0);
  const totalOutstanding = borrowerLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
  const interestExposure = borrowerLoans.reduce((sum, loan) => sum + loan.totalInterestPayable, 0);

  const stats = [
    { label: 'Total borrowed', value: currency(totalBorrowed), icon: Landmark, tone: 'bg-blue-50 text-blue-700' },
    { label: 'Total repaid', value: currency(totalPaid), icon: PiggyBank, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Outstanding', value: currency(totalOutstanding), icon: WalletMinimal, tone: 'bg-rose-50 text-rose-700' },
    { label: 'Interest exposure', value: currency(interestExposure), icon: ChartNoAxesColumn, tone: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-900">Balance overview</h1>
        <p className="mt-2 text-slate-500">A loan-by-loan picture of principal, paid amounts, and remaining exposure.</p>
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
        <h2 className="text-xl font-semibold text-slate-900">Loan-by-loan position</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
                <th>Loan</th>
                <th>Amount</th>
                <th>Paid</th>
                <th>Outstanding</th>
                <th>Total interest</th>
                <th>Status</th>
                <th>Issued</th>
              </tr>
            </thead>
            <tbody>
              {borrowerLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No loans found. Borrower balances will appear here once a loan is created.
                  </td>
                </tr>
              ) : (
                borrowerLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="font-semibold text-slate-900">#{loan.id}</td>
                    <td>{currency(loan.amount)}</td>
                    <td className="font-semibold text-emerald-700">{currency(paymentsByLoan[loan.id] || 0)}</td>
                    <td className="font-semibold text-rose-700">{currency(loan.remainingBalance)}</td>
                    <td>{currency(loan.totalInterestPayable)}</td>
                    <td>
                      <span className={loan.status === 'REJECTED' || loan.status === 'DEFAULTED' ? 'badge-defaulted' : loan.status === 'PENDING' ? 'badge-pending' : 'badge-active'}>
                        {loan.statusLabel}
                      </span>
                    </td>
                    <td>{formatDate(loan.createdAt)}</td>
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
