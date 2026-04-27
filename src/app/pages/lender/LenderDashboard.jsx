import { useMemo, useState } from 'react';
import { BadgeCheck, FileSearch, IndianRupee, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useLoans } from '../../context/LoanContext';
import { loanService } from '../../../api/loanService';
import { currency, formatDate, getLoanStatusTone } from '../../lib/crediflow';
import { getErrorMessage } from '../../../api/responseUtils';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,
  Button, Typography, Chip, Stack
} from '@mui/material';

export function LenderDashboard() {
  const { loans, fetchLoans } = useLoans();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedLoans = loans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>Applications queue</Typography>
        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: '1rem', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }} aria-label="lender applications queue">
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                {['Loan', 'Borrower', 'Purpose', 'Amount', 'Risk', 'Status', 'Created', 'Action'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="text.secondary">No applications available yet.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLoans.map((loan) => (
                  <TableRow key={loan.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '0.75rem' }}>#{loan.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#0f172a' }}>{loan.borrowerName}</TableCell>
                    <TableCell>{loan.purpose || 'General financing'}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{currency(loan.amount)}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{loan.riskScore ?? 'N/A'}</TableCell>
                    <TableCell>
                      <Chip label={loan.statusLabel} size="small" sx={{ 
                          backgroundColor: loan.status === 'APPROVED' || loan.status === 'ACTIVE' ? '#d1fae5' : loan.status === 'DEFAULTED' || loan.status === 'REJECTED' ? '#ffe4e6' : loan.status === 'PENDING' ? '#fef3c7' : '#f1f5f9', 
                          color: loan.status === 'APPROVED' || loan.status === 'ACTIVE' ? '#047857' : loan.status === 'DEFAULTED' || loan.status === 'REJECTED' ? '#e11d48' : loan.status === 'PENDING' ? '#b45309' : '#64748b', 
                          fontWeight: 600, borderRadius: '8px' 
                        }} />
                    </TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{formatDate(loan.createdAt)}</TableCell>
                    <TableCell>
                      {loan.status === 'PENDING' ? (
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Button size="small" color="success" onClick={() => handleApprove(loan.id)} sx={{ textTransform: 'none', fontWeight: 600 }}>Approve</Button>
                          <Button size="small" color="error" onClick={() => handleReject(loan.id)} sx={{ textTransform: 'none', fontWeight: 600 }}>Reject</Button>
                          <Button size="small" color="secondary" onClick={() => handleAutoEvaluate(loan.id)} sx={{ textTransform: 'none', fontWeight: 600 }}>Auto evaluate</Button>
                        </Stack>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>No action</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={loans.length}
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
