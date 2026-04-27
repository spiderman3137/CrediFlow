import { useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';
import { paymentService } from '../../../api/paymentService';
import { adminService } from '../../../api/adminService';
import { currency, formatDate, titleCase } from '../../lib/crediflow';
import { getErrorMessage, getPageItems } from '../../../api/responseUtils';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,
  Typography, Chip
} from '@mui/material';

const STATUS_CLASSES = {
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  PENDING: 'bg-amber-100 text-amber-700',
  FAILED: 'bg-rose-100 text-rose-700',
  REFUNDED: 'bg-blue-100 text-blue-700',
};

export function AdminTransactions() {
  const [payments, setPayments] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllTransactions();
      const items = getPageItems(data);
      setPayments(items);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to load transactions.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(
    () =>
      payments.filter((p) => {
        const q = query.toLowerCase();
        const matchQ = [p.transactionReference, p.userName, String(p.id), String(p.amount)].some(v =>
          String(v || '').toLowerCase().includes(q)
        );
        const matchS = statusFilter === 'all' || String(p.status || '').toLowerCase() === statusFilter;
        return matchQ && matchS;
      }),
    [payments, query, statusFilter]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTransactions = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
          <p className="mt-1 text-slate-500">
            {loading ? 'Loading...' : `${payments.length} payment events · ${filtered.length} shown`}
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl bg-[#5B2DFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4a22d4] shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </section>

      {/* Note Banner */}
      <div className="rounded-xl bg-blue-50 border border-blue-200 px-5 py-4 text-sm text-blue-700">
        <strong>Note:</strong> Showing the global payment ledger across all loans.
      </div>

      {/* Filter */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm focus:border-[#5B2DFF] focus:outline-none focus:ring-2 focus:ring-[#5B2DFF]/20"
            placeholder="Search by action, entity, or user…"
          />
        </div>
      </section>

      {/* Table */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: '1rem', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }} aria-label="transactions table">
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                {['ID', 'Transaction Ref', 'User', 'Amount', 'Status', 'Payment Method', 'Date'].map((h) => (
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
                    <Typography variant="body1" color="text.secondary">Loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="text.secondary" fontWeight="500">No payment audit events found</Typography>
                    <Typography variant="body2" color="text.secondary">Make payments to populate this view</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((log, i) => (
                  <TableRow key={log.id ?? i} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '0.75rem' }}>#{log.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{log.transactionReference || '—'}</TableCell>
                    <TableCell sx={{ color: '#475569' }}>{log.userName || '—'}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{currency(log.amount)}</TableCell>
                    <TableCell>
                      <Chip label={log.status} size="small" sx={{ 
                          backgroundColor: log.status === 'COMPLETED' ? '#d1fae5' : log.status === 'FAILED' ? '#ffe4e6' : log.status === 'PENDING' ? '#fef3c7' : '#dbeafe', 
                          color: log.status === 'COMPLETED' ? '#047857' : log.status === 'FAILED' ? '#e11d48' : log.status === 'PENDING' ? '#b45309' : '#1d4ed8', 
                          fontWeight: 600, borderRadius: '8px' 
                        }} />
                    </TableCell>
                    <TableCell sx={{ color: '#475569' }}>{titleCase(log.paymentMethod || '—')}</TableCell>
                    <TableCell sx={{ color: '#64748b' }}>{formatDate(log.paymentDate)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filtered.length}
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
