import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarClock, CreditCard, Landmark, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import { paymentService } from '../../../api/paymentService';
import { getPageItems } from '../../../api/responseUtils';
import { currency, formatDate, getLoanStatusTone, normalizePayment } from '../../lib/crediflow';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,
  Typography, Chip, CircularProgress
} from '@mui/material';

export function BorrowerDashboard() {
  const { loans, loading } = useLoans();
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

        if (active) {
          setPayments(paymentPages.flat());
        }
      } catch (error) {
        console.error('Failed to load borrower payments', error);
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

  const completedPayments = payments.filter((payment) => payment.status === 'COMPLETED');
  const totalBorrowed = borrowerLoans.reduce((sum, loan) => sum + loan.amount, 0);
  const totalPaid = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const outstandingBalance = borrowerLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0);
  const activeLoans = borrowerLoans.filter((loan) => ['APPROVED', 'ACTIVE'].includes(loan.status)).length;
  const nextDueLoan = borrowerLoans.find((loan) => ['APPROVED', 'ACTIVE', 'PENDING'].includes(loan.status));

  const chartData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    const key = `${date.getMonth()}-${date.getFullYear()}`;

    const paid = completedPayments
      .filter((payment) => {
        const paymentDate = new Date(payment.paymentDate);
        return `${paymentDate.getMonth()}-${paymentDate.getFullYear()}` === key;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      month: date.toLocaleDateString('en-IN', { month: 'short' }),
      paid,
    };
  });

  const stats = [
    { label: 'Active loans', value: activeLoans, icon: CreditCard, tone: 'bg-amber-50 text-amber-700' },
    { label: 'Outstanding balance', value: currency(outstandingBalance), icon: Wallet, tone: 'bg-rose-50 text-rose-700' },
    { label: 'Total paid', value: currency(totalPaid), icon: Landmark, tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Next due', value: nextDueLoan ? formatDate(nextDueLoan.startDate || nextDueLoan.createdAt) : '-', icon: CalendarClock, tone: 'bg-sky-50 text-sky-700' },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedLoans = borrowerLoans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-[linear-gradient(135deg,_#0f172a,_#1d4ed8_55%,_#38bdf8)] px-8 py-10 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-100">Borrower workspace</p>
            <h1 className="text-4xl font-semibold">Track applications, balances, and repayment health.</h1>
            <p className="text-base text-sky-100/90">
              Your dashboard now reflects live loan and payment records from the backend.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link to="/borrower/apply" className="rounded-2xl bg-white px-5 py-4 font-semibold text-slate-900 transition hover:bg-sky-50">
              Apply for a loan
            </Link>
            <Link to="/borrower/history" className="rounded-2xl border border-white/20 px-5 py-4 font-semibold text-white transition hover:bg-white/10">
              Review repayments
            </Link>
          </div>
        </div>
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

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Payment trend</h2>
              <p className="text-sm text-slate-500">Completed payments over the last six months</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip formatter={(value) => currency(value)} />
              <Bar dataKey="paid" fill="#2563eb" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Portfolio summary</h2>
          <div className="mt-6 space-y-5">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Total sanctioned</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{currency(totalBorrowed)}</p>
            </div>
            <div className="rounded-3xl bg-emerald-50 p-5">
              <p className="text-sm text-emerald-700">Repaid so far</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-900">{currency(totalPaid)}</p>
            </div>
            <div className="rounded-3xl bg-rose-50 p-5">
              <p className="text-sm text-rose-700">Remaining obligation</p>
              <p className="mt-2 text-3xl font-semibold text-rose-900">{currency(outstandingBalance)}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Your loans</h2>
            <p className="text-sm text-slate-500">Latest applications and repayment positions</p>
          </div>
          <Link to="/borrower/balance" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
            View balance details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: '1rem', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }} aria-label="borrower loans">
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                {['Loan', 'Purpose', 'Amount', 'EMI', 'Outstanding', 'Status', 'Created'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : borrowerLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="text.secondary" fontWeight="500">No loans found yet. Submit your first application to get started.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLoans.map((loan) => (
                  <TableRow key={loan.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '0.75rem' }}>#{loan.id}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{loan.purpose || 'General financing'}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{currency(loan.amount)}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{currency(loan.emiAmount)}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#e11d48' }}>{currency(loan.remainingBalance)}</TableCell>
                    <TableCell>
                      <Chip label={loan.statusLabel} size="small" sx={{ 
                          backgroundColor: loan.status === 'APPROVED' || loan.status === 'ACTIVE' ? '#d1fae5' : loan.status === 'DEFAULTED' || loan.status === 'REJECTED' ? '#ffe4e6' : loan.status === 'PENDING' ? '#fef3c7' : '#f1f5f9', 
                          color: loan.status === 'APPROVED' || loan.status === 'ACTIVE' ? '#047857' : loan.status === 'DEFAULTED' || loan.status === 'REJECTED' ? '#e11d48' : loan.status === 'PENDING' ? '#b45309' : '#64748b', 
                          fontWeight: 600, borderRadius: '8px' 
                        }} />
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{formatDate(loan.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={borrowerLoans.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#fafafa' }}
          />
        </TableContainer>
      </section>
    </div>
  );
}
