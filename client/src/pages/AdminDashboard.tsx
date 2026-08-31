import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.js';

interface StatsType {
  totalMembers: number;
  activeProjects: number;
  pendingReviews: number;
  totalCollaborations: number;
  totalEvents: number;
  growthPercentage: string;
}

interface AcquisitionItem {
  date: string;
  count: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsType>({
    totalMembers: 0,
    activeProjects: 0,
    pendingReviews: 0,
    totalCollaborations: 0,
    totalEvents: 0,
    growthPercentage: '0.0',
  });
  const [acquisition, setAcquisition] = useState<AcquisitionItem[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      // Fetch Admin Stats
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setAcquisition(statsData.acquisitionData || []);
      }

      // Fetch User Manager list for recent signups feed and pending applications
      const usersRes = await fetch('/api/admin/users');
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        const allUsers = usersData.data || [];
        
        // Filter pending applications
        const pending = allUsers.filter((u: any) => u.status === 'pending');
        setPendingUsers(pending);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/users/${id}/approve`, {
        method: 'PATCH',
      });
      if (res.ok) {
        setPendingUsers((prev) => prev.filter((u) => u._id !== id));
        setStats((prev) => ({
          ...prev,
          pendingReviews: Math.max(0, prev.pendingReviews - 1),
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDecline = async (id: string) => {
    if (!window.confirm('Are you sure you want to decline and permanently delete this application?')) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPendingUsers((prev) => prev.filter((u) => u._id !== id));
        setStats((prev) => ({
          ...prev,
          pendingReviews: Math.max(0, prev.pendingReviews - 1),
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] select-none">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#006655] mb-4"></div>
        <p className="text-xs text-[#5c7075] font-semibold">Loading platform metrics...</p>
      </div>
    );
  }

  // Find max acquisition count to scale chart heights properly
  const maxCount = Math.max(...acquisition.map((item) => item.count), 1);

  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      {/* Welcome Message */}
      <ScrollReveal>
        <div className="flex justify-between items-center select-none">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight mb-1">Dashboard Overview</h1>
            <p className="text-xs text-[#5c7075]">Welcome back, Admin. Here's what's happening today.</p>
          </div>
        </div>
      </ScrollReveal>

      {/* 1. Statistics Cards Row */}
      <ScrollReveal delay={100}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        {/* Card 1: Total Members */}
        <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center h-40">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 21c-2.24 0-4.303-.647-6.05-1.758a3.385 3.385 0 01-1.28-2.506 4.125 4.125 0 017.533-2.493c.501.911.787 1.958.787 3.076M15 8.25a3 3 0 11-6 0 3 3 0 016 0zm6 2.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </span>
            <span className="text-2xl font-extrabold leading-tight">{stats.totalMembers}</span>
          </div>
          <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Total Members</span>
        </div>

        {/* Card 2: Active Projects */}
        <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center h-40">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
              </svg>
            </span>
            <span className="text-2xl font-extrabold leading-tight">{stats.activeProjects}</span>
          </div>
          <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Active Projects</span>
        </div>

        {/* Card 3: Pending Approvals */}
        <Link
          to="/dashboard/admin/users?status=pending"
          className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white hover:border-amber-200 hover:shadow-md transition-all rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center h-40 group cursor-pointer"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="text-2xl font-extrabold leading-tight">{stats.pendingReviews}</span>
          </div>
          <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider group-hover:text-amber-700">Pending Approvals</span>
        </Link>

        {/* Card 4: Ecosystem Share */}
        <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center h-40">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </span>
            <span className="text-2xl font-extrabold leading-tight">
              {stats.totalCollaborations + stats.totalEvents}
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Ecosystem Share</span>
        </div>
      </div>
      </ScrollReveal>

      {/* 2. Charts & Interactions Row */}
      <ScrollReveal delay={200}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Acquisition chart */}
        <div className="lg:col-span-8 border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 select-none">
            <div>
              <h3 className="font-extrabold text-sm">User Acquisition</h3>
              <p className="text-[10px] text-slate-400">Daily registrations over the last 14 days</p>
            </div>
            <div className="bg-slate-50 border border-[#006655]/15 dark:border-[#00a88a]/20 p-1 rounded-xl flex gap-1 text-[9px] font-bold text-[#5c7075]">
              <span>Real-time Tracking</span>
            </div>
          </div>

          {/* Acquisition Bar graph simulator */}
          {acquisition.length > 0 ? (
            <div className="h-64 flex flex-col justify-between relative mt-8 select-none">
              <div className="flex-grow flex items-end gap-3 h-48 pb-2 border-b border-[#006655]/30 dark:border-[#00a88a]/40">
                {acquisition.map((item, idx) => (
                  <div key={idx} className="flex-grow flex flex-col items-center group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full mb-2 bg-[#091e22] text-white text-[8px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                      {item.count} signups
                    </div>
                    {/* Bar */}
                    <div 
                      className="bg-[#006655] hover:bg-[#004d40] w-full rounded-t-lg transition-all"
                      style={{ height: `${(item.count / maxCount) * 120}px`, minHeight: '6px' }}
                    />
                    <span className="text-[8px] font-bold text-slate-400 uppercase mt-2 rotate-45 sm:rotate-0 block shrink-0">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 rounded-2xl select-none">
              <p className="text-xs text-slate-400 font-medium">No registrations logged in the last 14 days.</p>
            </div>
          )}
        </div>

        {/* Pending Applications */}
        <div className="lg:col-span-4">
          <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 select-none">
              <h3 className="font-extrabold text-sm">Pending Applications</h3>
              {pendingUsers.length > 0 && (
                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                  {pendingUsers.length}
                </span>
              )}
            </div>

            {pendingUsers.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center py-6">
                  <svg className="w-10 h-10 mx-auto mb-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[10px] text-slate-400 font-semibold">All caught up!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 flex-1">
                {pendingUsers.slice(0, 5).map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-[#091e22] block truncate">{member.fullName}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(member.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-3 select-none">
                      {actionLoading === member._id ? (
                        <span className="text-[10px] text-[#006655] font-bold">...</span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(member._id)}
                            className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDecline(member._id)}
                            className="w-6 h-6 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link to="/dashboard/admin/users?status=pending" className="w-full text-center border border-[#006655]/15 dark:border-[#00a88a]/20 bg-slate-50/20 py-2 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-colors mt-4 select-none block">
              View All Applications
            </Link>
          </div>
        </div>
      </div>
      </ScrollReveal>


    </div>
  );
};

export default AdminDashboard;
