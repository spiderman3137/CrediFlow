import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CircleCheckBig, CircleDashed, WalletCards } from 'lucide-react';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../../api/paymentService';
import { getPageItems } from '../../../api/responseUtils';
import { buildSchedule } from '../../lib/loanMetrics';
import { currency, formatDate } from '../../lib/crediflow';

export function BorrowerEMI() {
  const { loans } = useLoans();
  const { user } = useAuth();
  const [paymentsByLoan, setPaymentsByLoan] = useState({});

  const borrowerLoans = useMemo(
    () => loans.filter((loan) => loan.borrowerId === user?.id && ['APPROVED', 'ACTIVE'].includes(loan.status)),
    [loans, user?.id]
  );

  useEffect(() => {
    let active = true;

    async function loadPayments() {
      try {
        const entries = await Promise.all(
          borrowerLoans.map(async (loan) => {
            const payload = await paymentService.getPaymentsByLoan(loan.id);
            const completed = getPageItems(payload).filter((payment) => payment.status === 'COMPLETED');
            return [loan.id, completed.length];
          })
        );

        if (active) {
          setPaymentsByLoan(Object.fromEntries(entries));
        }
      } catch (error) {
        console.error('Failed to load EMI data', error);
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

  const scheduleGroups = borrowerLoans.map((loan) => ({
    loan,
    schedule: buildSchedule(loan, paymentsByLoan[loan.id] || 0),
  }));

  const allSchedules = scheduleGroups.flatMap((group) => group.schedule);
  const paid = allSchedules.filter((row) => row.status === 'PAID').length;
  const due = allSchedules.filter((row) => row.status === 'DUE').length;
  const upcoming = allSchedules.filter((row) => row.status === 'UPCOMING').length;
  const nextDue = allSchedules.find((row) => row.status === 'DUE');

  const stats = [
    { label: 'Paid installments', value: paid, icon: CircleCheckBig, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Due now', value: due, icon: WalletCards, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Upcoming', value: upcoming, icon: CircleDashed, tone: 'bg-slate-100 text-slate-700' },
    { label: 'Next due date', value: nextDue ? formatDate(nextDue.dueDate) : '-', icon: CalendarDays, tone: 'bg-sky-50 text-sky-700' },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-900">EMI schedule</h1>
        <p className="mt-2 text-slate-500">Monthly repayment plan derived from your live approved and active loans.</p>
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

      {scheduleGroups.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No approved loans yet. EMI schedules appear after a lender or admin approves a loan.
        </div>
      ) : (
        scheduleGroups.map(({ loan, schedule }) => (
          <section key={loan.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Loan #{loan.id}</h2>
                <p className="text-sm text-slate-500">
                  {currency(loan.amount)} at {loan.interest}% for {loan.term} months
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                EMI amount: <span className="font-semibold text-slate-900">{currency(loan.emiAmount)}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table-sharp">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Due date</th>
                    <th>EMI</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row) => (
                    <tr key={`${loan.id}-${row.installment}`}>
                      <td className="font-semibold text-slate-900">{row.installment}</td>
                      <td>{formatDate(row.dueDate)}</td>
                      <td className="font-semibold text-slate-900">{currency(row.emi)}</td>
                      <td>{currency(row.principal)}</td>
                      <td>{currency(row.interest)}</td>
                      <td>{currency(row.balance)}</td>
                      <td>
                        <span
                          className={
                            row.status === 'PAID'
                              ? 'badge-active'
                              : row.status === 'DUE'
                                ? 'badge-pending'
                                : 'px-3 py-1 text-xs font-semibold text-slate-600 bg-slate-100 rounded-full'
                          }
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}
    </div>
  );
}
