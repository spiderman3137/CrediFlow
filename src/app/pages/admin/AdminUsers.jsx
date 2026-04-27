import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Trash2, Upload, Download, FileSpreadsheet, Plus, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '../../../api/userService';
import { excelService } from '../../../api/excelService';
import { getErrorMessage, getPageItems } from '../../../api/responseUtils';
import { formatDate, titleCase } from '../../lib/crediflow';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination,
  Button, Select, MenuItem, Chip, Typography, CircularProgress
} from '@mui/material';

const ROLES = ['all', 'admin', 'analyst', 'borrower', 'lender'];

function ExcelImportModal({ onClose, onSuccess }) {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) { toast.error('Please select a file first.'); return; }
    setUploading(true);
    try {
      await excelService.uploadUsersExcel(file);
      toast.success('Users imported successfully from Excel!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to import users.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Import Users via Excel</h2>
            <p className="mt-1 text-sm text-slate-500">Upload a .xlsx file to bulk-create users</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => excelService.downloadUsersTemplate()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-4 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download Template First
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
            <strong>Required columns:</strong> Name, Email, Password, Role (BORROWER/LENDER/ANALYST/ADMIN), Phone, Address
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
                <><Upload className="h-4 w-4" /> Import Users</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport]   = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Try admin endpoint first, fall back to user endpoint
      let payload;
      try {
        payload = await import('../../../api/adminService').then(m => m.adminService.getAllUsers({ size: 200 }));
      } catch {
        payload = await userService.getAll({ size: 200 });
      }
      const items = Array.isArray(payload?.content) ? payload.content : Array.isArray(payload) ? payload : [];
      setUsers(items);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load users.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const q = query.toLowerCase();
        const matchesQuery = [user.name, user.email, user.phone].some((v) =>
          String(v || '').toLowerCase().includes(q)
        );
        const matchesRole = roleFilter === 'all' || String(user.role || '').toLowerCase() === roleFilter;
        return matchesQuery && matchesRole;
      }),
    [query, roleFilter, users]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await userService.remove(id);
      toast.success('User deleted.');
      loadUsers();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete user.'));
    }
  };

  const handleDownloadExcel = async () => {
    setDownloading(true);
    try {
      await excelService.downloadUsersExcel();
      toast.success('Users Excel downloaded.');
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to download Excel.'));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {showImport && (
        <ExcelImportModal onClose={() => setShowImport(false)} onSuccess={loadUsers} />
      )}

      {/* Header */}
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Users</h1>
          <p className="mt-1 text-slate-500">
            {loading ? 'Loading...' : `${users.length} total users · ${filteredUsers.length} shown`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Download template */}
          <button
            onClick={() => excelService.downloadUsersTemplate()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Template
          </button>
          {/* Import Excel */}
          <button
            onClick={() => setShowImport(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm"
          >
            <Upload className="h-4 w-4 text-blue-600" />
            Import Excel
          </button>
          {/* Export Excel */}
          <button
            onClick={handleDownloadExcel}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 shadow-sm disabled:opacity-50"
          >
            <Download className="h-4 w-4 text-violet-600" />
            {downloading ? 'Downloading…' : 'Export Excel'}
          </button>
          {/* Refresh */}
          <button
            onClick={loadUsers}
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
              placeholder="Search name, email or phone…"
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50"
            size="small"
            sx={{ borderRadius: '0.75rem' }}
          >
            {ROLES.map((r) => (
              <MenuItem key={r} value={r}>{r === 'all' ? 'All Roles' : titleCase(r)}</MenuItem>
            ))}
          </Select>
        </div>
      </section>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: '1rem', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="users table">
          <TableHead sx={{ backgroundColor: '#f8fafc' }}>
            <TableRow>
              {['ID', 'Name', 'Email', 'Role', 'Status', 'Verified', 'Phone', 'Joined', 'Actions'].map((h) => (
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
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                  {/* We remove FileSpreadsheet icon here to avoid missing import if not careful, just a simple text for now */}
                  <Typography variant="body1" color="text.secondary" fontWeight="500">No users match your filters</Typography>
                  <Typography variant="body2" color="text.secondary">Try importing users via Excel or adjust your search</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '0.75rem' }}>#{user.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#0f172a' }}>{user.name}</TableCell>
                  <TableCell sx={{ color: '#475569' }}>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={titleCase(user.role)} size="small" sx={{ backgroundColor: 'rgba(91,45,255,0.1)', color: '#5B2DFF', fontWeight: 600, borderRadius: '8px' }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={user.active ? 'Active' : 'Inactive'} size="small" sx={{ backgroundColor: user.active ? '#d1fae5' : '#f1f5f9', color: user.active ? '#047857' : '#64748b', fontWeight: 600, borderRadius: '8px' }} />
                  </TableCell>
                  <TableCell>
                    <Chip label={user.emailVerified ? 'Verified' : 'Unverified'} size="small" sx={{ backgroundColor: user.emailVerified ? '#dbeafe' : '#ffedd5', color: user.emailVerified ? '#1d4ed8' : '#ea580c', fontWeight: 600, borderRadius: '8px' }} />
                  </TableCell>
                  <TableCell sx={{ color: '#64748b' }}>{user.phone || '-'}</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(user.id)}
                      sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', '&:hover': { backgroundColor: '#fff1f2' } }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredUsers.length}
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
