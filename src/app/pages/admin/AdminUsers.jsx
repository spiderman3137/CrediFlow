import { useEffect, useMemo, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '../../../api/userService';
import { getErrorMessage, getPageItems } from '../../../api/responseUtils';
import { formatDate, titleCase } from '../../lib/crediflow';

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const loadUsers = async () => {
    try {
      const payload = await userService.getAll({ size: 100 });
      setUsers(getPageItems(payload));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load users.'));
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const matchesQuery = [user.name, user.email].some((value) =>
          String(value || '').toLowerCase().includes(query.toLowerCase())
        );
        const matchesRole = roleFilter === 'all' || String(user.role).toLowerCase() === roleFilter;
        return matchesQuery && matchesRole;
      }),
    [query, roleFilter, users]
  );

  const handleDelete = async (id) => {
    try {
      await userService.remove(id);
      toast.success('User deleted successfully.');
      loadUsers();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete user.'));
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold text-slate-900">Users</h1>
        <p className="mt-2 text-slate-500">Manage registered platform users from the live backend.</p>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full input-sharp pl-11"
              placeholder="Search by name or email"
            />
          </div>

          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="input-sharp">
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="analyst">Analyst</option>
            <option value="borrower">Borrower</option>
            <option value="lender">Lender</option>
          </select>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No users match the current filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="font-semibold text-slate-900">{user.name}</td>
                    <td>{user.email}</td>
                    <td>{titleCase(user.role)}</td>
                    <td>
                      <span className={user.active ? 'badge-active' : 'badge-defaulted'}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{user.emailVerified ? 'Yes' : 'No'}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <button onClick={() => handleDelete(user.id)} className="inline-flex items-center gap-2 text-sm font-semibold text-rose-700 hover:text-rose-800">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </td>
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
