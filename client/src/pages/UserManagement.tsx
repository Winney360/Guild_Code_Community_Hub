import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface UserType {
  _id: string;
  fullName: string;
  email: string;
  role: 'member' | 'moderator' | 'admin';
  status: 'pending' | 'active' | 'suspended';
  profilePicture?: string;
  joinDate?: string;
}

export const UserManagement: React.FC = () => {
  const location = useLocation();
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Read initial filter from URL params (e.g. ?status=pending)
  const queryParams = new URLSearchParams(location.search);
  const urlStatus = queryParams.get('status');
  const initialFilter = (urlStatus === 'pending' || urlStatus === 'active' || urlStatus === 'suspended')
    ? urlStatus
    : 'all';

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>(initialFilter);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (urlStatus === 'pending' || urlStatus === 'active' || urlStatus === 'suspended') {
      setStatusFilter(urlStatus);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        if (res.ok) {
          const data = await res.json();
          setUsers(data.data);
          setFilteredUsers(data.data);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on tab and search
  useEffect(() => {
    let result = users;

    if (statusFilter !== 'all') {
      result = result.filter((u) => u.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.fullName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
      );
    }

    setFilteredUsers(result);
  }, [search, statusFilter, users]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/users/${id}/approve`, {
        method: 'PATCH',
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, status: 'active' } : u))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/users/${id}/suspend`, {
        method: 'PATCH',
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, status: 'suspended' } : u))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = () => {
    if (!filteredUsers || filteredUsers.length === 0) return;

    const escapeCSV = (str?: string) => {
      if (!str) return '""';
      return `"${String(str).replace(/"/g, '""')}"`;
    };

    const headers = ['User ID', 'Full Name', 'Email', 'Role', 'Status', 'Join Date'];
    const rows = filteredUsers.map((u) =>
      [
        escapeCSV(u._id),
        escapeCSV(u.fullName),
        escapeCSV(u.email),
        escapeCSV(u.role),
        escapeCSV(u.status),
        escapeCSV(u.joinDate ? new Date(u.joinDate).toLocaleDateString() : 'N/A'),
      ].join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `guild_code_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const maps: Record<string, string> = {
      active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      pending: 'bg-amber-50 text-amber-600 border-amber-100',
      suspended: 'bg-red-50 text-red-500 border-red-100',
    };
    return `px-2 py-0.5 border text-[9px] font-bold rounded-lg uppercase ${maps[status] || 'bg-slate-100 text-slate-500'}`;
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') return 'bg-purple-100 text-purple-700 border-purple-200';
    if (role === 'moderator') return 'bg-blue-100 text-blue-700 border-blue-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-[#5c7075] font-semibold">Loading users directory...</span>
      </div>
    );
  }

  const pendingUsersCount = users.filter((u) => u.status === 'pending').length;

  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">User Management</h1>
          <p className="text-xs text-[#5c7075] uppercase tracking-wider font-bold">
            Total Members: {users.length} {pendingUsersCount > 0 && `• (${pendingUsersCount} Pending Approval)`}
          </p>
        </div>

        <button className="bg-[#006655] hover:bg-[#004d40] text-white py-2.5 px-6 rounded-xl font-bold text-xs transition-colors shadow-sm select-none">
          + Invite User
        </button>
      </div>

      {/* Pending Approvals Notice Banner */}
      {pendingUsersCount > 0 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 select-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-amber-900">
                {pendingUsersCount} Pending Account{pendingUsersCount > 1 ? 's' : ''} Awaiting Admin Approval
              </h4>
              <p className="text-xs text-amber-700">Review new user registrations and grant them active access to the community hub.</p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter('pending')}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm shrink-0"
          >
            Review Pending ({pendingUsersCount})
          </button>
        </div>
      )}

      {/* Main Table view wrapper */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        
        {/* Filters & Actions Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-4 select-none">
          {/* Tabs */}
          <div className="flex bg-slate-100 border border-slate-200/50 p-1 rounded-xl gap-1 text-[9px] font-bold text-slate-550">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg ${statusFilter === 'all' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg ${statusFilter === 'active' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              Active ({users.filter(u => u.status === 'active').length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${statusFilter === 'pending' ? 'bg-amber-500 text-white shadow-sm' : 'text-amber-700 bg-amber-50/60'}`}
            >
              <span>Pending</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[8px] ${statusFilter === 'pending' ? 'bg-white text-amber-600' : 'bg-amber-200 text-amber-800'}`}>
                {pendingUsersCount}
              </span>
            </button>
            <button
              onClick={() => setStatusFilter('suspended')}
              className={`px-3 py-1.5 rounded-lg ${statusFilter === 'suspended' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              Suspended ({users.filter(u => u.status === 'suspended').length})
            </button>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full lg:w-48">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>
            <button
              onClick={handleExportCSV}
              disabled={filteredUsers.length === 0}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#091e22] py-2 px-4 rounded-xl text-xs font-semibold shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              title="Export current member list to CSV"
            >
              <svg className="w-3.5 h-3.5 text-[#006655]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        {filteredUsers.length === 0 ? (
          <div className="p-16 text-center select-none flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-extrabold text-base mb-1">No members found</h3>
            <p className="text-xs text-[#5c7075]">Matches in this filter selection do not exist.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs font-medium text-[#5c7075]">
            <thead className="bg-slate-50 border-b border-slate-100 text-[#091e22] font-bold select-none text-[10px] uppercase">
              <tr>
                <th className="p-4 pl-6">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Join Date</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/30 transition-colors">
                  {/* User details */}
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 border border-slate-100 shrink-0 select-none">
                      {item.profilePicture ? (
                        <img src={item.profilePicture} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                          {item.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-[#091e22] block">{item.fullName}</span>
                      <span className="text-[10px] text-slate-400">{item.email}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="p-4 select-none">
                    <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-lg ${getRoleBadge(item.role)}`}>
                      {item.role.toUpperCase()}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4 select-none">
                    <span className={getStatusBadge(item.status)}>{item.status.toUpperCase()}</span>
                  </td>

                  {/* Join Date */}
                  <td className="p-4 select-none">
                    {item.joinDate ? (
                      new Date(item.joinDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    ) : (
                      'Oct 12, 2023'
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right select-none space-x-2">
                    {item.status === 'pending' && (
                      <button
                        disabled={actionLoading !== null}
                        onClick={() => handleApprove(item._id)}
                        className="text-emerald-600 hover:underline font-bold text-[10px]"
                      >
                        Approve
                      </button>
                    )}
                    {item.status !== 'suspended' && (
                      <button
                        disabled={actionLoading !== null}
                        onClick={() => handleSuspend(item._id)}
                        className="text-amber-600 hover:underline font-bold text-[10px]"
                      >
                        Suspend
                      </button>
                    )}
                    {item.status === 'suspended' && (
                      <button
                        disabled={actionLoading !== null}
                        onClick={() => handleApprove(item._id)}
                        className="text-emerald-600 hover:underline font-bold text-[10px]"
                      >
                        Re-Activate
                      </button>
                    )}
                    <button
                      disabled={actionLoading !== null}
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:underline font-bold text-[10px]"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};
export default UserManagement;
