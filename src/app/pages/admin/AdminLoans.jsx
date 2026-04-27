import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Upload, Download, FileSpreadsheet, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { loanService } from '../../../api/loanService';
import { adminService } from '../../../api/adminService';
import { excelService } from '../../../api/excelService';
import { currency, formatDate, getLoanStatusTone, normalizeLoan, titleCase } from '../../lib/crediflow';
import { getErrorMessage, getPageItems } from '../../../api/responseUtils';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,
  Button, Select, MenuItem, Chip, Typography, CircularProgress, Stack
} from '@mui/material';

const STATUSES = ['all', 'pending', 'approved', 'active', 'rejected', 'closed', 'defaulted'];

function ExcelImportModal({ onClose, onSuccess }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) { toast.error('Please select a file first.'); return; }
    setUploading(true);
    try {
      await excelService.uploadLoansExcel(file);
      toast.success('Loans imported successfully from Excel!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to import loans.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Import Loans via Excel</h2>
            <p className="mt-1 text-sm text-slate-500">Upload a .xlsx file to bulk-create loans</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => excelService.downloadLoansTemplate()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-4 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Loans Template First
          </button>

          <div
            className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 cursor-pointer hover:bg-slate-100 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <FileSpreadsheet className="h-8 w-8 text-emerald-600" />
            <p className="text-sm font-medium text-slate-700">
              {file ? file.name : 'Click to select your .xlsx file'}
            </p>
            {file && <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>}
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
            <strong>Required columns:</strong> User ID, Principal Amount, Interest Rate, Duration Months, Status (PENDING/APPROVED/ACTIVE), Purpose (PERSONAL/HOME/BUSINESS/EDUCATION/AUTO)
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="flex-1 rounded-xl bg-[#5B2DFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4a22d4] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <><RefreshCw className="h-4 w-4 animate-spin" /> Importing...</>
              ) : (
                <><Upload className="h-4 w-4" /> Import Loans</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminLoans() {
  const [loans, setLoans] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadLoans = async () => {
    setLoading(true);
    try {
      // Try admin endpoint first, fallback to loan endpoint
      let payload;
      try {
        payload = await adminService.getAllLoans({ size: 200 });
      } catch {
        payload = await loanService.getAllLoans({ size: 200 });
      }
      const items = getPageItems(payload).map(normalizeLoan);
      setLoans(items);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to load loans.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLoans(); }, []);

  const filteredLoans = useMemo(
    () =>
      loans.filter((loan) => {
        const q = query.toLowerCase();
        const matchesQuery = [loan.id, loan.borrowerName, loan.borrowerEmail, loan.purpose]
          .some((v) => String(v || '').toLowerCase().includes(q));
        const matchesStatus = statusFilter === 'all' || String(loan.status || '').toLowerCase() === statusFilter;
        return matchesQuery && matchesStatus;
      }),
    [loans, query, statusFilter]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedLoans = filteredLoans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleDecision = async (loanId, status) => {
    try {
      await loanService.updateLoanStatus(loanId, status, `Admin action: ${status}`);
      toast.success(`Loan #${loanId} moved to ${titleCase(status)}.`);
      loadLoans();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to update loan status.'));
    }
  };

  const handleDownloadExcel = async () => {
    setDownloading(true);
    try {
      await excelService.downloadLoansExcel();
      toast.success('Loans Excel downloaded.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to download Excel.'));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {showImport && (
        <ExcelImportModal onClose={() => setShowImport(false)} onSuccess={loadLoans} />
      )}

      {/* Header */}
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Loan Monitoring</h1>
          <p className="mt-1 text-slate-500">
            {loading ? 'Loading...' : `${loans.length} total loans · ${filteredLoans.length} shown`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => excelService.downloadLoansTemplate()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Template
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm"
          >
            <Upload className="h-4 w-4 text-blue-600" />
            Import Excel
          </button>
          <button
            onClick={handleDownloadExcel}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-violet-600" />
            {downloading ? 'Downloading…' : 'Export Excel'}
          </button>
          <button
            onClick={loadLoans}
            className="inline-flex items-center gap-2 rounded-xl bg-[#5B2DFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#4a22d4] shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_200px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm focus:border-[#5B2DFF] focus:outline-none focus:ring-2 focus:ring-[#5B2DFF]/20"
              placeholder="Search by ID, borrower, email or purpose…"
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-50"
            size="small"
            sx={{ borderRadius: '0.75rem' }}
          >
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s === 'all' ? 'All Statuses' : titleCase(s)}</MenuItem>
            ))}
          </Select>
        </div>
      </section>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: '1rem', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="loans table">
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              {['Loan #', 'Borrower', 'Amount', 'EMI', 'Rate', 'Duration', 'Status', 'Created', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : filteredLoans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                  <Typography variant="body1" color="text.secondary" fontWeight="500">No loans match your filters</Typography>
                  <Typography variant="body2" color="text.secondary">Try importing loans via Excel or adjust search</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedLoans.map((loan) => (
                <TableRow key={loan.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '0.75rem' }}>#{loan.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600" color="#0f172a">{loan.borrowerName || '—'}</Typography>
                    <Typography variant="caption" color="text.secondary">{loan.borrowerEmail || '—'}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{currency(loan.amount)}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{currency(loan.emiAmount)}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{loan.interest}%</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{loan.term} mo</TableCell>
                  <TableCell>
                    <Chip label={loan.statusLabel} size="small" sx={{ 
                        backgroundColor: loan.status === 'APPROVED' || loan.status === 'ACTIVE' ? '#d1fae5' : loan.status === 'DEFAULTED' || loan.status === 'REJECTED' ? '#ffe4e6' : loan.status === 'PENDING' ? '#fef3c7' : '#f1f5f9', 
                        color: loan.status === 'APPROVED' || loan.status === 'ACTIVE' ? '#047857' : loan.status === 'DEFAULTED' || loan.status === 'REJECTED' ? '#e11d48' : loan.status === 'PENDING' ? '#b45309' : '#64748b', 
                        fontWeight: 600, borderRadius: '8px' 
                      }} />
                  </TableCell>
                  <TableCell sx={{ color: '#64748b' }}>{formatDate(loan.createdAt)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {loan.status === 'PENDING' && (
                        <>
                          <Button size="small" color="success" onClick={() => handleDecision(loan.id, 'APPROVED')} sx={{ textTransform: 'none', fontWeight: 600 }}>Approve</Button>
                          <Button size="small" color="error" onClick={() => handleDecision(loan.id, 'REJECTED')} sx={{ textTransform: 'none', fontWeight: 600 }}>Reject</Button>
                        </>
                      )}
                      {loan.status === 'APPROVED' && (
                        <Button size="small" color="primary" onClick={() => handleDecision(loan.id, 'ACTIVE')} sx={{ textTransform: 'none', fontWeight: 600 }}>Activate</Button>
                      )}
                      {['ACTIVE', 'CLOSED', 'REJECTED', 'DEFAULTED'].includes(loan.status) && (
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>No action</Typography>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredLoans.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#fafafa' }}
        />
      </TableContainer>
    </div>
  );
}
