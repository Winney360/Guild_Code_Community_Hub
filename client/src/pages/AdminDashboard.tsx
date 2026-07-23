import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // Fetch Admin Stats
        const statsRes = await fetch('/api/admin/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
          setAcquisition(statsData.acquisitionData || []);
        }

        // Fetch User Manager list for recent signups feed
        const usersRes = await fetch('/api/admin/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          // Sort by creation date descending and grab first 4
          const sorted = [...(usersData.data || [])]
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

    fetchAdminData();
  }, []);

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
      <div className="flex justify-between items-center select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Dashboard Overview</h1>
          <p className="text-xs text-[#5c7075]">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl px-3 py-1.5 text-[10px] font-bold text-[#006655] shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          Live Database Connection
        </div>
      </div>

      {/* 1. Statistics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        {/* Card 1 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Total Members</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+{stats.growthPercentage}% ↗</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">{stats.totalMembers}</span>
            <span className="text-[9px] text-slate-400 font-semibold mt-1 block">Registered in database</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Active Projects</span>
            <span className="text-[10px] font-bold text-[#006655] bg-[#006655]/10 px-2 py-0.5 rounded-full">Live Showcase</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">{stats.activeProjects}</span>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#006655] h-full" style={{ width: stats.activeProjects > 0 ? '100%' : '0%' }} />
            </div>
            <span className="text-[9px] text-slate-400 font-semibold mt-1 block">Published showcase submissions</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Pending Reviews</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stats.pendingReviews > 0 ? 'text-red-500 bg-red-50' : 'text-slate-500 bg-slate-100'}`}>
              {stats.pendingReviews > 0 ? 'Requires Action' : 'Cleared'}
            </span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">{stats.pendingReviews}</span>
            <div className="flex gap-2 mt-2">
              <span className={`px-1.5 py-0.5 text-[8px] font-extrabold rounded uppercase ${stats.pendingReviews > 0 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                {stats.pendingReviews} User Approvals
              </span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Ecosystem Share</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">MERN Live</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">
              {stats.totalCollaborations + stats.totalEvents}
            </span>
            <div className="flex gap-3 text-[9px] text-slate-400 font-semibold mt-2">
              <span>🤝 {stats.totalCollaborations} Collabs</span>
              <span>📅 {stats.totalEvents} Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Charts & Interactions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Acquisition chart */}
        <div className="lg:col-span-8 border border-slate-100 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 select-none">
            <div>
              <h3 className="font-extrabold text-sm">User Acquisition</h3>
              <p className="text-[10px] text-slate-400">Daily registrations over the last 14 days</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-1 rounded-xl flex gap-1 text-[9px] font-bold text-[#5c7075]">
              <span>Real-time Tracking</span>
            </div>
          </div>

          {/* Acquisition Bar graph simulator */}
          {acquisition.length > 0 ? (
            <div className="h-64 flex flex-col justify-between relative mt-8 select-none">
              <div className="flex-grow flex items-end gap-3 h-48 pb-2 border-b border-slate-100">
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
          <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-sm mb-6 select-none">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <Link
                to="/dashboard/admin/users"
                className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl hover:border-[#006655] hover:bg-white transition-all group flex flex-col items-center"
              >
                <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">👥</span>
                <span className="font-extrabold text-[10px]">User Approvals</span>
              </Link>

              <Link
                to="/dashboard/admin/moderation"
                className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl hover:border-[#006655] hover:bg-white transition-all group flex flex-col items-center"
              >
                <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">⚠️</span>
                <span className="font-extrabold text-[10px]">Mod Queue</span>
              </Link>

              <Link
                to="/dashboard/admin/analytics"
                className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl hover:border-[#006655] hover:bg-white transition-all group flex flex-col items-center"
              >
                <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">📈</span>
                <span className="font-extrabold text-[10px]">Platform Stats</span>
              </Link>

              <Link
                to="/dashboard/events"
                className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl hover:border-[#006655] hover:bg-white transition-all group flex flex-col items-center"
              >
                <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">📅</span>
                <span className="font-extrabold text-[10px]">Manage Events</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Global Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Real Engagement Statistics */}
        <div className="lg:col-span-8 border border-slate-100 bg-white rounded-3xl p-6 shadow-sm space-y-4 select-none">
          <h3 className="font-extrabold text-sm border-b border-slate-50 pb-2 mb-2">Ecosystem Activity Metrics</h3>
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
        <div className="lg:col-span-4 border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
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
                  <div key={member._id} className="flex gap-3 text-[10px] leading-relaxed pb-3 border-b border-slate-50">
                    <span className="text-emerald-500">✔️</span>
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

          <Link to="/dashboard/admin/users" className="w-full text-center border border-slate-100 bg-slate-50/20 py-2 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-colors mt-6 select-none block">
            Manage Users Directory
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
