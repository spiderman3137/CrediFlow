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
  ];

  return (
    <div className="space-y-8">
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
        <div className="overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
    </div>
  );
}
