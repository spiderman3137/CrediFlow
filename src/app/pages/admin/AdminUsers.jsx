import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Trash2, Upload, Download, FileSpreadsheet, Plus, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '../../../api/userService';
import { excelService } from '../../../api/excelService';
import { getErrorMessage, getPageItems } from '../../../api/responseUtils';
import { formatDate, titleCase } from '../../lib/crediflow';

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
  const [users, setUsers]             = useState([]);
  const [query, setQuery]             = useState('');
  const [roleFilter, setRoleFilter]   = useState('all');
  const [loading, setLoading]         = useState(true);
  const [showImport, setShowImport]   = useState(false);
  const [downloading, setDownloading] = useState(false);

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
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-[#5B2DFF] focus:outline-none focus:ring-2 focus:ring-[#5B2DFF]/20"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r === 'all' ? 'All Roles' : titleCase(r)}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Table */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['ID', 'Name', 'Email', 'Role', 'Status', 'Verified', 'Phone', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 rounded bg-slate-200" /></td>
                    ))}
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center text-slate-400">
                    <FileSpreadsheet className="mx-auto mb-3 h-10 w-10 opacity-30" />
                    <p className="font-medium">No users match your filters</p>
                    <p className="text-xs mt-1">Try importing users via Excel or adjust your search</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">#{user.id}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{user.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{user.email}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block rounded-lg bg-[#5B2DFF]/10 px-2.5 py-1 text-xs font-semibold text-[#5B2DFF]">
                        {titleCase(user.role)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${user.emailVerified ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-600'}`}>
                        {user.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{user.phone || '-'}</td>
                    <td className="px-5 py-3.5 text-slate-500">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filteredUsers.length > 0 && (
          <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-400">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </section>
    </div>
  );
}
