<<<<<<< HEAD
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
=======
import { DollarSign, TrendingUp, Wallet, AlertTriangle } from 'lucide-react';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';

export function BorrowerBalance() {
    const { loans } = useLoans();
    const { user } = useAuth();

    const userLoans = loans.filter((l) => user && l.borrowerId === user.id);

    const totalBorrowed = userLoans.reduce((s, l) => s + (Number(l.amount) || 0), 0);
    const totalPaid = userLoans.length > 0 ? 6750 : 0; // Mock paid amount matching dashboard
    const outstandingBalance = Math.max(0, totalBorrowed - totalPaid);
    const interestAccrued = userLoans.reduce(
        (s, l) => s + ((Number(l.amount) || 0) * (Number(l.interest) || 0) / 100),
        0
    );

    const statsData = [
        { name: 'Total Borrowed', value: '$' + totalBorrowed.toLocaleString(), icon: DollarSign, color: '#5B2DFF' },
        { name: 'Total Paid', value: '$' + totalPaid.toLocaleString(), icon: TrendingUp, color: '#28C76F' },
        { name: 'Outstanding Balance', value: '$' + outstandingBalance.toLocaleString(), icon: Wallet, color: '#FF4D4F' },
        { name: 'Interest Accrued', value: '$' + interestAccrued.toLocaleString(), icon: AlertTriangle, color: '#FFA940' },
    ];

    // Per-loan breakdown
    const loanDetails = userLoans.map((loan) => {
        const amount = Number(loan.amount) || 0;
        const paidPerLoan = userLoans.length > 0 ? totalPaid / userLoans.length : 0;
        const remaining = Math.max(0, amount - paidPerLoan);
        const interest = amount * ((Number(loan.interest) || 0) / 100);
        const progressPercent = amount > 0 ? Math.min(100, (paidPerLoan / amount) * 100) : 0;

        return {
            id: loan.id,
            amount,
            paid: paidPerLoan,
            remaining,
            interest,
            progressPercent,
            status: loan.status,
            term: loan.term || 12,
            rate: loan.interest || 0,
        };
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Balance Overview</h1>
                <p className="text-gray-600">Summary of your outstanding balances across all loans</p>
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

            {/* Overall Progress */}
            <div className="card-sharp p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Repayment Progress</h3>
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
                            <div
                                className="h-2 bg-green-600"
                                style={{ width: totalBorrowed > 0 ? `${(totalPaid / totalBorrowed) * 100}%` : '0%' }}
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Outstanding Balance</span>
                            <span className="font-bold text-red-600">${outstandingBalance.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-gray-200">
                            <div
                                className="h-2 bg-red-600"
                                style={{ width: totalBorrowed > 0 ? `${(outstandingBalance / totalBorrowed) * 100}%` : '0%' }}
                            ></div>
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

            {/* Per-Loan Breakdown Table */}
            <div className="card-sharp p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Loan-wise Breakdown</h3>
                <div className="overflow-x-auto">
                    <table className="table-sharp">
                        <thead>
                            <tr>
                                <th>Loan ID</th>
                                <th>Original Amount</th>
                                <th>Interest Rate</th>
                                <th>Term</th>
                                <th>Paid</th>
                                <th>Remaining</th>
                                <th>Progress</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loanDetails.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-6 text-gray-500">
                                        No active loans. Your balance details will appear here.
                                    </td>
                                </tr>
                            ) : (
                                loanDetails.map((loan) => (
                                    <tr key={loan.id}>
                                        <td className="font-semibold text-gray-900">{loan.id}</td>
                                        <td className="font-semibold text-gray-900">${loan.amount.toLocaleString()}</td>
                                        <td className="text-gray-700">{loan.rate}%</td>
                                        <td className="text-gray-700">{loan.term} mo</td>
                                        <td className="font-semibold text-green-600">${Math.round(loan.paid).toLocaleString()}</td>
                                        <td className="font-semibold text-red-600">${Math.round(loan.remaining).toLocaleString()}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-gray-200">
                                                    <div
                                                        className="h-2 bg-[#5B2DFF]"
                                                        style={{ width: `${loan.progressPercent}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-600">{Math.round(loan.progressPercent)}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge-active">{loan.status?.toUpperCase()}</span>
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
