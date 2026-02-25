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
}
