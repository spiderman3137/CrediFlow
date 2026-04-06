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
  };

  return (
    <div className="space-y-8">
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    No applications available yet.
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan.id}>
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
                      )}
                    </td>
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
