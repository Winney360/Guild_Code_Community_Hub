import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { ThemeToggle } from '../components/ThemeToggle.js';
import heroLogo from '../assets/hero.png';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const linkClass = (path: string) => {
    return `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
      isActive(path)
        ? 'bg-[#006655] text-white shadow-sm'
        : 'text-[#5c7075] hover:bg-slate-50 hover:text-[#091e22]'
    }`;
  };

  // Convert pathname to breadcrumb label
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/projects/new')) return 'Create Project';
    if (path.includes('/dashboard/projects/edit')) return 'Edit Project';
    if (path.includes('/dashboard/projects')) return 'My Projects';
    if (path.includes('/dashboard/collaborations/new')) return 'Create Collaboration';
    if (path.includes('/dashboard/collaborations')) return 'My Collaborations';
    if (path.includes('/dashboard/applications')) return 'Applications';
    if (path.includes('/dashboard/events/new')) return 'Create Event';
    if (path.includes('/dashboard/events/edit')) return 'Edit Event';
    if (path.includes('/dashboard/events')) return 'Event Management';
    if (path.includes('/dashboard/activity')) return 'Notifications';
    if (path.includes('/dashboard/settings')) return 'Settings';
    if (path.includes('/dashboard/admin/users')) return 'User Management';
    if (path.includes('/dashboard/admin/moderation')) return 'Moderation Queue';
    if (path.includes('/dashboard/admin/analytics')) return 'Analytics';
    if (path.includes('/dashboard/admin')) return 'Admin Overview';
    return 'Overview';
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar (Left) */}
      <aside className="w-64 border-r border-slate-100 bg-white p-6 flex flex-col justify-between shrink-0 sticky top-0 h-screen select-none z-50">
        <div>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src={heroLogo} alt="Logo" className="w-7 h-7 object-contain shrink-0" />
            <span className="font-bold text-base tracking-tight text-[#091e22]">
              Guild <span className="text-[#006655]">Code</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link to="/dashboard" className={linkClass('/dashboard')}>
              <span>📊</span> Dashboard
            </Link>
            <Link to="/dashboard/projects" className={linkClass('/dashboard/projects')}>
              <span>📁</span> Projects
            </Link>
            <Link to="/dashboard/collaborations" className={linkClass('/dashboard/collaborations')}>
              <span>🤝</span> Collaborations
            </Link>
            <Link to="/dashboard/applications" className={linkClass('/dashboard/applications')}>
              <span>✉️</span> Applications
            </Link>
            <Link to="/dashboard/events" className={linkClass('/dashboard/events')}>
              <span>📅</span> Events
            </Link>
            <Link to="/dashboard/activity" className={linkClass('/dashboard/activity')}>
              <span>🔔</span> Activity
            </Link>
            <Link to="/dashboard/settings" className={linkClass('/dashboard/settings')}>
              <span>⚙️</span> Settings
            </Link>

            {/* Admin specific sidebar panel */}
            {user?.role === 'admin' && (
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase px-4 block select-none mb-1">Admin Panel</span>
                <Link to="/dashboard/admin" className={linkClass('/dashboard/admin')}>
                  <span>🛡️</span> Admin Overview
                </Link>
                <Link to="/dashboard/admin/users" className={linkClass('/dashboard/admin/users')}>
                  <span>👥</span> User Manager
                </Link>
                <Link to="/dashboard/admin/moderation" className={linkClass('/dashboard/admin/moderation')}>
                  <span>⚠️</span> Mod Queue
                </Link>
                <Link to="/dashboard/admin/analytics" className={linkClass('/dashboard/admin/analytics')}>
                  <span>📈</span> Platform Stats
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Profile card */}
        <div className="space-y-4">
          <Link
            to="/dashboard/projects/new"
            className="w-full flex items-center justify-center gap-2 bg-[#006655] hover:bg-[#004d40] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span>+</span> Create Project
          </Link>

          <hr className="border-slate-100" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#006655]/10 flex items-center justify-center font-bold text-[#006655] rounded-xl text-xs overflow-hidden shrink-0">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  user?.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-xs text-[#091e22] truncate">{user?.fullName || 'Guild Member'}</h5>
                <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{user?.role || 'member'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 text-sm p-1.5 hover:bg-slate-50 rounded-lg transition-colors shrink-0"
              title="Logout"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel Content (Right) */}
      <div className="flex-grow flex flex-col min-h-screen min-w-0">
        {/* Header bar */}
        <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40 select-none shrink-0">
          <div className="text-xs text-[#5c7075] font-semibold flex items-center gap-2">
            <span>Organization</span>
            <span className="text-slate-350">&gt;</span>
            <span className="text-[#091e22] font-bold">{getBreadcrumb()}</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search resource mock */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400">🔍</span>
              <input
                type="text"
                placeholder="Search resources..."
                className="pl-8 pr-4 py-1.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs w-48 focus:outline-none"
              />
            </div>
            <Link to="/dashboard/activity" className="text-sm cursor-pointer relative block hover:scale-105 transition-transform" title="Notifications">
              🔔
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-grow p-8 bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
