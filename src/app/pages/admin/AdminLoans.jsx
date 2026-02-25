import { Search, Filter, Eye, XCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useLoans } from '../../context/LoanContext';
import { useNotifications } from '../../context/NotificationContext';
import { toast } from 'sonner';

export function AdminLoans() {
  const { loans, updateLoanStatus } = useLoans();
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      (loan.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loan.borrowerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loan.purpose || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    active: loans.filter((l) => l.status === 'active' || l.status === 'approved').length,
    completed: loans.filter((l) => l.status === 'completed').length,
    defaulted: loans.filter((l) => l.status === 'defaulted').length,
    pending: loans.filter((l) => l.status === 'pending').length,
    rejected: loans.filter((l) => l.status === 'rejected').length,
  };

  const handleViewLoan = (loan) => {
    alert(
      `📄 Loan Details\n\n` +
      `Loan ID: ${loan.id}\n` +
      `Borrower: ${loan.borrowerName || 'N/A'}\n` +
      `Amount: $${(loan.amount || 0).toLocaleString()}\n` +
      `Interest Rate: ${loan.interest || 'N/A'}%\n` +
      `Status: ${(loan.status || '').toUpperCase()}\n` +
      `Applied: ${loan.createdAt ? new Date(loan.createdAt).toLocaleDateString() : 'N/A'}`
    );
  };

  const handleApproveLoan = (loan) => {
    updateLoanStatus(loan.id, 'approved');
    addNotification(`Your loan of $${loan.amount.toLocaleString()} has been approved by admin`, 'borrower');
    toast.success(`Loan ${loan.id} approved`);
  };

  const handleRejectLoan = (loan) => {
    const confirmed = window.confirm(
      `⚠️ Reject loan ${loan.id} from ${loan.borrowerName || 'Unknown'}?\n\nAmount: $${(loan.amount || 0).toLocaleString()}`
    );
    if (!confirmed) return;
    updateLoanStatus(loan.id, 'rejected');
    addNotification(`Your loan of $${loan.amount.toLocaleString()} has been rejected by admin`, 'borrower');
    toast(`Loan ${loan.id} rejected`);
  };

  const statusBadge = (status) => {
    const map = {
      pending: 'badge-pending',
      approved: 'badge-active',
      active: 'badge-active',
      completed: 'badge-active',
      rejected: 'badge-defaulted',
      defaulted: 'badge-defaulted',
    };
    return map[status] || 'badge-pending';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loans Monitoring</h1>
        <p className="text-gray-600">
          {loans.length} total loan{loans.length !== 1 ? 's' : ''} on the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card-sharp p-4 bg-green-50 border-2 border-green-200">
          <p className="text-sm text-gray-600 mb-1">Active / Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="card-sharp p-4 bg-blue-50 border-2 border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
        </div>
        <div className="card-sharp p-4 bg-orange-50 border-2 border-orange-200">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </div>
        <div className="card-sharp p-4 bg-red-50 border-2 border-red-200">
          <p className="text-sm text-gray-600 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        <div className="card-sharp p-4 bg-gray-50 border-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Defaulted</p>
          <p className="text-2xl font-bold text-gray-600">{stats.defaulted}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card-sharp p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by loan ID, borrower, or purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full input-sharp pl-11"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full input-sharp pl-11"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="defaulted">Defaulted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loans Table */}
      <div className="card-sharp overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Borrower</th>
                <th>Amount</th>
                <th>Interest Rate</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    {loans.length === 0
                      ? 'No loan applications yet. Loans will appear here when borrowers apply.'
                      : 'No loans match your filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="font-semibold text-gray-900">{loan.id}</td>
                    <td className="text-gray-700">{loan.borrowerName || 'N/A'}</td>
                    <td className="font-semibold text-gray-900">
                      ${(loan.amount || 0).toLocaleString()}
                    </td>
                    <td className="text-gray-700">{loan.interest || 'N/A'}%</td>
                    <td>
                      <span className={statusBadge(loan.status)}>
                        {(loan.status || '').toUpperCase()}
                      </span>
                    </td>
                    <td className="text-gray-700">
                      {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 hover:bg-blue-50 text-blue-600"
                          title="View Details"
                          onClick={() => handleViewLoan(loan)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {loan.status === 'pending' && (
                          <>
                            <button
                              className="p-2 hover:bg-green-50 text-green-600"
                              title="Approve"
                              onClick={() => handleApproveLoan(loan)}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-red-50 text-red-600"
                              title="Reject"
                              onClick={() => handleRejectLoan(loan)}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
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
}
