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

interface MemberActivity {
  _id: string;
  fullName: string;
  role: string;
  createdAt: string;
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
  const [recentMembers, setRecentMembers] = useState<MemberActivity[]>([]);
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

        // Sort by creation date descending and grab first 4
        const sorted = [...allUsers]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);
        setRecentMembers(sorted);
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

        {/* Quick Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-sm mb-6 select-none">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <Link
                to="/dashboard/admin/users"
                className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl hover:border-[#006655] hover:bg-white transition-all group flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-600 group-hover:text-[#006655] flex items-center justify-center mb-2 group-hover:scale-110 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="font-extrabold text-[10px]">User Approvals</span>
              </Link>

              <Link
                to="/dashboard/admin/moderation"
                className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl hover:border-[#006655] hover:bg-white transition-all group flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-amber-50 text-slate-600 group-hover:text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span className="font-extrabold text-[10px]">Mod Queue</span>
              </Link>

              <Link
                to="/dashboard/admin/analytics"
                className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl hover:border-[#006655] hover:bg-white transition-all group flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 18L9 11.25l4.5 4.5L21.75 7.5M21.75 7.5V12m0-4.5H17.25" />
                  </svg>
                </div>
                <span className="font-extrabold text-[10px]">Platform Stats</span>
              </Link>

              <Link
                to="/dashboard/events"
                className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl hover:border-[#006655] hover:bg-white transition-all group flex flex-col items-center"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-purple-50 text-slate-600 group-hover:text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-extrabold text-[10px]">Manage Events</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      </ScrollReveal>

      {/* Pending Applications Section */}
      <ScrollReveal delay={300}>
      <div className="bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 select-none">
          <div>
            <h3 className="font-extrabold text-base">Pending Applications</h3>
            <p className="text-xs text-[#5c7075] mt-0.5">New builder accounts waiting for platform access approval.</p>
          </div>
          <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
            {pendingUsers.length} Pending
          </span>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl">
            <svg className="w-12 h-12 mx-auto mb-2 select-none text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-slate-400 font-semibold select-none">All registration applications have been processed!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-[#5c7075] min-w-[500px]">
              <thead className="bg-slate-50 border-b border-[#006655]/30 dark:border-[#00a88a]/40 text-[#091e22] font-bold text-[10px] uppercase select-none">
                <tr>
                  <th className="p-4 pl-6">Full Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Applied On</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#006655]/30 dark:divide-[#00a88a]/40">
                {pendingUsers.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 pl-6 font-bold text-[#091e22]">{member.fullName}</td>
                    <td className="p-4">{member.email}</td>
                    <td className="p-4 select-none">
                      {new Date(member.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-4 pr-6 text-right space-x-4 select-none">
                      {actionLoading === member._id ? (
                        <span className="text-xs text-[#006655] font-bold">Processing...</span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(member._id)}
                            className="text-[#006655] hover:text-[#004d40] font-bold text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecline(member._id)}
                            className="text-red-500 hover:text-red-700 font-bold text-xs"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </ScrollReveal>

      {/* 3. Global Activity Row */}
      <ScrollReveal delay={400}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Real Engagement Statistics */}
        <div className="lg:col-span-8 border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm space-y-4 select-none">
          <h3 className="font-extrabold text-sm border-b border-[#006655]/30 dark:border-[#00a88a]/40 pb-2 mb-2">Ecosystem Activity Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center py-4">
            <div className="p-4 bg-[#f8fafc] border border-slate-150 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Member Pool</span>
              <span className="text-3xl font-extrabold text-[#006655]">{stats.totalMembers}</span>
              <p className="text-[9px] text-[#5c7075] font-semibold mt-1">Total Registered Accounts</p>
            </div>
            <div className="p-4 bg-[#f8fafc] border border-slate-150 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Showcased Projects</span>
              <span className="text-3xl font-extrabold text-[#006655]">{stats.activeProjects}</span>
              <p className="text-[9px] text-[#5c7075] font-semibold mt-1">Active Platform Showcases</p>
            </div>
            <div className="p-4 bg-[#f8fafc] border border-slate-150 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Pending Reviews</span>
              <span className={`text-3xl font-extrabold ${stats.pendingReviews > 0 ? 'text-red-500' : 'text-[#006655]'}`}>
                {stats.pendingReviews}
              </span>
              <p className="text-[9px] text-[#5c7075] font-semibold mt-1">Awaiting Admin Approvals</p>
            </div>
          </div>
        </div>

        {/* Global audit log list (Live Database Users) */}
        <div className="lg:col-span-4 border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 select-none">
              <h3 className="font-extrabold text-sm">Recent Activity</h3>
              <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                Real-time
              </span>
            </div>

            <div className="space-y-4">
              {recentMembers.length > 0 ? (
                recentMembers.map((member) => (
                  <div key={member._id} className="flex gap-3 text-[10px] leading-relaxed pb-3 border-b border-[#006655]/30 dark:border-[#00a88a]/40">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-bold text-[#091e22] block">{member.fullName} signed up</span>
                      <span className="text-slate-400">
                        Role: {member.role} &bull; Joined: {new Date(member.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-slate-400 text-center py-6 font-semibold select-none">No recent registration activity logged.</p>
              )}
            </div>
          </div>

          <Link to="/dashboard/admin/users" className="w-full text-center border border-[#006655]/15 dark:border-[#00a88a]/20 bg-slate-50/20 py-2 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-colors mt-6 select-none block">
            Manage Users Directory
          </Link>
        </div>
      </div>
      </ScrollReveal>
    </div>
  );
};

export default AdminDashboard;
