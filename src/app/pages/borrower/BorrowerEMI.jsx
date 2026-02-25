import { Clock, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';

function generateEMISchedule(loan) {
    const principal = Number(loan.amount) || 0;
    const annualRate = Number(loan.interest) || 0;
    const termMonths = Number(loan.term) || 12;
    const monthlyRate = annualRate / 100 / 12;

    // EMI formula
    let emi;
    if (monthlyRate === 0) {
        emi = principal / termMonths;
    } else {
        emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
            (Math.pow(1 + monthlyRate, termMonths) - 1);
    }

    const startDate = loan.createdAt ? new Date(loan.createdAt) : new Date();
    let balance = principal;
    const schedule = [];

    for (let i = 1; i <= termMonths; i++) {
        const interestPortion = balance * monthlyRate;
        const principalPortion = emi - interestPortion;
        balance = Math.max(0, balance - principalPortion);

        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        // Mock: first 2 installments are paid
        const isPaid = i <= 2;

        schedule.push({
            installment: i,
            dueDate,
            emi: emi,
            principal: principalPortion,
            interest: interestPortion,
            balance,
            status: isPaid ? 'paid' : i === 3 ? 'due' : 'upcoming',
        });
    }

    return schedule;
}

export function BorrowerEMI() {
    const { loans } = useLoans();
    const { user } = useAuth();

    const userLoans = loans.filter((l) => user && l.borrowerId === user.id);

    // Aggregate all schedules
    const allSchedules = userLoans.map((loan) => ({
        loan,
        schedule: generateEMISchedule(loan),
    }));

    const totalEMIs = allSchedules.reduce((s, ls) => s + ls.schedule.length, 0);
    const paidEMIs = allSchedules.reduce((s, ls) => s + ls.schedule.filter((e) => e.status === 'paid').length, 0);
    const remainingEMIs = totalEMIs - paidEMIs;
    const nextDue = allSchedules.flatMap((ls) => ls.schedule).find((e) => e.status === 'due');

    const statsData = [
        { name: 'Total EMIs', value: String(totalEMIs), icon: Calendar, color: '#5B2DFF' },
        { name: 'Paid', value: String(paidEMIs), icon: CheckCircle, color: '#28C76F' },
        { name: 'Remaining', value: String(remainingEMIs), icon: Clock, color: '#FFA940' },
        { name: 'Next Due', value: nextDue ? nextDue.dueDate.toLocaleDateString() : '-', icon: DollarSign, color: '#FF4D4F' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">EMI Schedule</h1>
                <p className="text-gray-600">View your upcoming EMI installments</p>
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

            {/* EMI Tables per Loan */}
            {allSchedules.length === 0 ? (
                <div className="card-sharp p-6 text-center text-gray-500">
                    No active loans. Accept a loan offer to see your EMI schedule.
                </div>
            ) : (
                allSchedules.map(({ loan, schedule }) => (
                    <div key={loan.id} className="card-sharp p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Loan #{loan.id}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    ${Number(loan.amount).toLocaleString()} at {loan.interest || 0}% for {loan.term || 12} months
                                </p>
                            </div>
                            <span className="badge-active">{loan.status?.toUpperCase()}</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table-sharp">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Due Date</th>
                                        <th>EMI Amount</th>
                                        <th>Principal</th>
                                        <th>Interest</th>
                                        <th>Balance</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedule.map((row) => (
                                        <tr key={row.installment}>
                                            <td className="font-semibold text-gray-900">{row.installment}</td>
                                            <td className="text-gray-700">{row.dueDate.toLocaleDateString()}</td>
                                            <td className="font-semibold text-gray-900">${row.emi.toFixed(2)}</td>
                                            <td className="text-gray-700">${row.principal.toFixed(2)}</td>
                                            <td className="text-gray-700">${row.interest.toFixed(2)}</td>
                                            <td className="font-semibold text-gray-900">${row.balance.toFixed(2)}</td>
                                            <td>
                                                <span
                                                    className={
                                                        row.status === 'paid'
                                                            ? 'badge-active'
                                                            : row.status === 'due'
                                                                ? 'badge-pending'
                                                                : 'px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold'
                                                    }
                                                >
                                                    {row.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
