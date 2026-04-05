import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { useLoans } from '../../context/LoanContext';
import { currency, formatDate, getLoanStatusTone } from '../../lib/crediflow';
import { getErrorMessage } from '../../../api/responseUtils';

export function AdminLoans() {
  const { loans, updateLoanStatus } = useLoans();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLoans = useMemo(
    () =>
      loans.filter((loan) => {
        const matchesQuery = [loan.id, loan.borrowerName, loan.borrowerEmail, loan.purpose]
          .some((value) => String(value || '').toLowerCase().includes(query.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || String(loan.status).toLowerCase() === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [loans, query, statusFilter]
  );

  const handleDecision = async (loanId, status) => {
    try {
      await updateLoanStatus(loanId, status, `Updated by admin to ${status}.`);
      toast.success(`Loan moved to ${status.toLowerCase()}.`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to update loan status.'));
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold text-slate-900">Loan monitoring</h1>
        <p className="mt-2 text-slate-500">Approve, reject, and review borrower applications across the platform.</p>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full input-sharp pl-11"
              placeholder="Search loans, borrower, or purpose"
            />
          </div>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="input-sharp">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
            <option value="closed">Closed</option>
            <option value="defaulted">Defaulted</option>
          </select>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
                <th>Loan</th>
                <th>Borrower</th>
                <th>Amount</th>
                <th>EMI</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No loans match the current filters.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="font-semibold text-slate-900">#{loan.id}</td>
                    <td>
                      <div>
                        <p className="font-medium text-slate-900">{loan.borrowerName}</p>
                        <p className="text-sm text-slate-500">{loan.borrowerEmail}</p>
                      </div>
                    </td>
                    <td className="font-semibold text-slate-900">{currency(loan.amount)}</td>
                    <td>{currency(loan.emiAmount)}</td>
                    <td>
                      <span className={getLoanStatusTone(loan.status)}>{loan.statusLabel}</span>
                    </td>
                    <td>{formatDate(loan.createdAt)}</td>
                    <td>
                      <div className="flex flex-wrap gap-3">
                        {loan.status === 'PENDING' ? (
                          <>
                            <button onClick={() => handleDecision(loan.id, 'APPROVED')} className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                              Approve
                            </button>
                            <button onClick={() => handleDecision(loan.id, 'REJECTED')} className="text-sm font-semibold text-rose-700 hover:text-rose-800">
                              Reject
                            </button>
                          </>
                        ) : null}
                        {loan.status === 'APPROVED' ? (
                          <button onClick={() => handleDecision(loan.id, 'ACTIVE')} className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                            Activate
                          </button>
                        ) : null}
                      </div>
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
