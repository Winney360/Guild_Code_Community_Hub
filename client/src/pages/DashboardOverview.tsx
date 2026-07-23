import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

interface DashboardStats {
  activeProjects: number;
  openCollaborations: number;
  newApplications: number;
  profileViews: number;
}

interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeProjects: 0,
    openCollaborations: 0,
    newApplications: 0,
    profileViews: 0,
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats
      const statsRes = await fetch('/api/stats/dashboard');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      // Fetch user notifications
      const notificationsRes = await fetch('/api/notifications');
      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData.data || []);
      }
    } catch (err) {
      console.error('Error fetching member dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
      });
      if (res.ok) {
        // Refresh lists
        await fetchDashboardData();
      }
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  const getTimeElapsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMin / 60);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] select-none">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#006655] mb-4"></div>
        <p className="text-xs text-[#5c7075] font-semibold">Loading dashboard overview...</p>
      </div>
    );
  }

  const unreadNotifications = notifications.filter((n) => !n.read);
  const recentActivities = notifications.slice(0, 4);

  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      {/* Welcome Banner */}
      <div className="flex justify-between items-center select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">
            Welcome Back, {user?.fullName.split(' ')[0] || 'Guild Member'}!
          </h1>
          <p className="text-xs text-[#5c7075]">Manage, monitor, and scale your open-source initiatives.</p>
        </div>
      </div>

      {/* 1. Statistics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        {/* Card 1 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-lg bg-emerald-50 text-emerald-600 p-2 rounded-xl">📊</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Live DB</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">{stats.activeProjects}</span>
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Active Projects</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-lg bg-teal-50 text-teal-600 p-2 rounded-xl">🤝</span>
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">Open</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">{stats.openCollaborations}</span>
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Open Collaborations</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-lg bg-blue-50 text-blue-600 p-2 rounded-xl">✉️</span>
            <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${stats.newApplications > 0 ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-slate-500 bg-slate-50 border-slate-200'}`}>
              {stats.newApplications > 0 ? `+${stats.newApplications} new` : 'no actions'}
            </span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">{stats.newApplications}</span>
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Pending Applications</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-lg bg-rose-50 text-rose-600 p-2 rounded-xl">👁️</span>
            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">Project Traffic</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">{stats.profileViews}</span>
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Total Project Views</span>
          </div>
        </div>
      </div>

      {/* 2. Main Content Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Activity */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 select-none">
              <h3 className="font-extrabold text-base">Recent Activity</h3>
              <Link to="/dashboard/activity" className="text-[#006655] hover:underline text-xs font-semibold">View All</Link>
            </div>

            {/* Activity Timeline List */}
            <div className="space-y-6">
              {recentActivities.length > 0 ? (
                recentActivities.map((act) => (
                  <div key={act._id} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-[#006655]/10 text-[#006655] border border-[#006655]/20 flex items-center justify-center text-xs shrink-0 select-none font-bold">
                      🔔
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-[#091e22] truncate pr-2">
                          {act.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold select-none shrink-0">
                          {getTimeElapsed(act.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-[#5c7075] leading-relaxed">
                        {act.message}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center select-none">
                  <p className="text-xs text-slate-400 font-semibold">No recent activity logged in your account.</p>
                </div>
              )}
            </div>

            {/* View Full History redirect link */}
            <Link to="/dashboard/activity" className="w-full text-center border border-slate-100 py-2.5 rounded-xl text-xs text-slate-500 font-semibold bg-slate-50/30 hover:bg-slate-50 transition-colors mt-8 select-none block">
              View Activity Feed
            </Link>
          </div>
        </div>

        {/* Right Column: Quick Actions & Notifications */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Quick Actions Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-base mb-6 select-none">Quick Actions</h3>
            <div className="space-y-3">
              {/* Action 1 */}
              <Link
                to="/dashboard/projects"
                className="flex items-center gap-4 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors"
              >
                <span className="text-base bg-emerald-50 text-emerald-600 p-2 rounded-xl select-none">📁</span>
                <div>
                  <h4 className="font-bold text-xs">My Projects Showcase</h4>
                  <p className="text-[9px] text-[#5c7075] mt-0.5">Manage details & links</p>
                </div>
              </Link>

              {/* Action 2 */}
              <Link
                to="/dashboard/collaborations"
                className="flex items-center gap-4 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors"
              >
                <span className="text-base bg-teal-50 text-teal-600 p-2 rounded-xl select-none">📢</span>
                <div>
                  <h4 className="font-bold text-xs">Manage Collabs</h4>
                  <p className="text-[9px] text-[#5c7075] mt-0.5">Close or check requests</p>
                </div>
              </Link>

              {/* Action 3 */}
              <Link
                to="/members"
                className="flex items-center gap-4 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors"
              >
                <span className="text-base bg-blue-50 text-blue-600 p-2 rounded-xl select-none">👥</span>
                <div>
                  <h4 className="font-bold text-xs">Browse Members</h4>
                  <p className="text-[9px] text-[#5c7075] mt-0.5">Connect with developers</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 select-none">
              <h3 className="font-extrabold text-base">Unread Alerts</h3>
              <span className="w-5 h-5 bg-[#006655] text-white flex items-center justify-center text-[10px] font-bold rounded-full">
                {unreadNotifications.length}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {unreadNotifications.length > 0 ? (
                unreadNotifications.slice(0, 4).map((n) => (
                  <div key={n._id} className="text-[11px] leading-relaxed py-1.5 border-b border-slate-50 last:border-0 min-w-0">
                    <span className="font-bold block text-slate-800 truncate">{n.title}</span>
                    <p className="text-[#5c7075] mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-400 text-center py-6 font-semibold select-none">No unread notifications.</p>
              )}
            </div>

            {unreadNotifications.length > 0 && (
              <button onClick={handleMarkAllAsRead} className="w-full text-center text-xs font-bold text-[#006655] hover:underline pt-2 select-none">
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
