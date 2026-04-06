import { useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw, Download } from 'lucide-react';
import { toast } from 'sonner';
import { paymentService } from '../../../api/paymentService';
import { adminService } from '../../../api/adminService';
import { currency, formatDate, titleCase } from '../../lib/crediflow';
import { getErrorMessage, getPageItems } from '../../../api/responseUtils';

const STATUS_CLASSES = {
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  PENDING:   'bg-amber-100 text-amber-700',
  FAILED:    'bg-rose-100 text-rose-700',
  REFUNDED:  'bg-blue-100 text-blue-700',
};

export function AdminTransactions() {
  const [payments, setPayments]     = useState([]);
  const [query, setQuery]           = useState('');
  const [statusFilter, setStatus]   = useState('all');
  const [loading, setLoading]       = useState(true);

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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['ID', 'Transaction Ref', 'User', 'Amount', 'Status', 'Payment Method', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 rounded bg-slate-200" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-slate-400">
                    <p className="font-medium">No payment audit events found</p>
                    <p className="text-xs mt-1">Make payments to populate this view</p>
                  </td>
                </tr>
              ) : (
                filtered.map((log, i) => (
                  <tr key={log.id ?? i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-400">#{log.id}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{log.transactionReference || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-600">{log.userName || '—'}</td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">{currency(log.amount)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASSES[log.status] || 'bg-slate-100 text-slate-700'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{titleCase(log.paymentMethod || '—')}</td>
                    <td className="px-5 py-3.5 text-slate-400">{formatDate(log.paymentDate)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
