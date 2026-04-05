<<<<<<< HEAD
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
=======
import { Search, Filter, Eye, Ban, Trash2, UserPlus, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState([]);

  // Load real users from localStorage
  const loadUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('crediflow_registered_users') || '{}');
    const userList = Object.entries(registeredUsers).map(([email, data]) => ({
      id: email,
      name: data.name || email.split('@')[0],
      email,
      role: (data.role || 'borrower').charAt(0).toUpperCase() + (data.role || 'borrower').slice(1),
      status: data.status || 'active',
      joinDate: data.joinDate || new Date().toISOString().split('T')[0],
    }));
    setUsers(userList);
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
  };

  useEffect(() => {
    loadUsers();
<<<<<<< HEAD
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
=======
    // Listen for storage changes from other tabs
    const handleStorage = (e) => {
      if (e.key === 'crediflow_registered_users') loadUsers();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleViewUser = (user) => {
    alert(
      `👤 User Details\n\n` +
      `Name: ${user.name}\n` +
      `Email: ${user.email}\n` +
      `Role: ${user.role}\n` +
      `Status: ${user.status.toUpperCase()}\n` +
      `Joined: ${user.joinDate}`
    );
  };

  const handleSuspendUser = (user) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    const registeredUsers = JSON.parse(localStorage.getItem('crediflow_registered_users') || '{}');
    if (registeredUsers[user.email]) {
      registeredUsers[user.email].status = newStatus;
      localStorage.setItem('crediflow_registered_users', JSON.stringify(registeredUsers));
      loadUsers();
      toast(`${user.name} has been ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}`);
    }
  };

  const handleDeleteUser = (user) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete "${user.name}" (${user.email})?\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    const registeredUsers = JSON.parse(localStorage.getItem('crediflow_registered_users') || '{}');
    delete registeredUsers[user.email];
    localStorage.setItem('crediflow_registered_users', JSON.stringify(registeredUsers));
    loadUsers();
    toast(`${user.name} has been deleted`);
  };

  const handleAddUser = () => {
    alert('ℹ️ New users are added when they register through the Registration page.\n\nGo to /register to create a new account.');
  };

  const handleExportData = () => {
    if (filteredUsers.length === 0) {
      toast('No users to export');
      return;
    }
    const headers = ['Name', 'Email', 'Role', 'Status', 'Join Date'];
    const rows = filteredUsers.map((u) => [u.name, u.email, u.role, u.status, u.joinDate]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crediflow_users.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('Users exported as CSV');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Users</h1>
          <p className="text-gray-600">
            {users.length} registered user{users.length !== 1 ? 's' : ''} on the platform
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={handleAddUser}>
          <UserPlus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="card-sharp p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full input-sharp pl-11"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full input-sharp pl-11"
            >
              <option value="all">All Roles</option>
              <option value="borrower">Borrower</option>
              <option value="lender">Lender</option>
              <option value="analyst">Analyst</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <button className="w-full btn-primary flex items-center justify-center gap-2" onClick={handleExportData}>
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card-sharp overflow-hidden">
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
        <div className="overflow-x-auto">
          <table className="table-sharp">
            <thead>
              <tr>
<<<<<<< HEAD
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Verified</th>
                <th>Joined</th>
                <th>Action</th>
=======
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
<<<<<<< HEAD
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No users match the current filters.
=======
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    {users.length === 0
                      ? 'No registered users yet. Users will appear here after they register.'
                      : 'No users match your search criteria.'}
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
<<<<<<< HEAD
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
=======
                    <td>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </td>
                    <td>
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold">
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge-${user.status === 'active'
                            ? 'active'
                            : user.status === 'suspended'
                              ? 'defaulted'
                              : 'pending'
                          }`}
                      >
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-gray-700">{user.joinDate}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 hover:bg-blue-50 text-blue-600"
                          title="View Details"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-2 ${user.status === 'suspended'
                              ? 'hover:bg-green-50 text-green-600'
                              : 'hover:bg-orange-50 text-orange-600'
                            }`}
                          title={user.status === 'suspended' ? 'Reactivate User' : 'Suspend User'}
                          onClick={() => handleSuspendUser(user)}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-red-50 text-red-600"
                          title="Delete User"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
<<<<<<< HEAD
      </section>
=======
      </div>
>>>>>>> 5ad99e5b2827ca57162b42a5a11994b1a8b4ac5c
    </div>
  );
}
