import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { ThemeToggle } from '../components/ThemeToggle.js';
import heroLogo from '../assets/hero.png';
import heroDarkLogo from '../assets/hero-dark.png';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const handleLogout = () => {
    setShowConfirmLogout(true);
  };

  const executeLogout = async () => {
    setShowConfirmLogout(false);
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
        <div className="flex flex-col flex-grow overflow-y-auto scrollbar-none mb-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 shrink-0">
            <img src={heroLogo} alt="Logo" className="w-9 h-9 object-contain shrink-0 dark:hidden" />
            <img src={heroDarkLogo} alt="Logo" className="w-9 h-9 object-contain shrink-0 hidden dark:block" />
            <span className="font-bold text-base tracking-tight text-[#091e22]">
              Guild <span className="text-[#006655]">Code</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link to="/" className={`${linkClass('/')} flex items-center gap-2.5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span>Home</span>
            </Link>
            <Link to="/dashboard" className={`${linkClass('/dashboard')} flex items-center gap-2.5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
              </svg>
              <span>Dashboard</span>
            </Link>
            <Link to="/dashboard/projects" className={`${linkClass('/dashboard/projects')} flex items-center gap-2.5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375C2.754 3.75 2.25 4.254 2.25 4.875v1.5c0 .621.504 1.125 1.125 1.125zM9 3.75h6v1.5H9v-1.5z" />
              </svg>
              <span>Projects</span>
            </Link>
            <Link to="/dashboard/collaborations" className={`${linkClass('/dashboard/collaborations')} flex items-center gap-2.5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
              <span>Collaborations</span>
            </Link>
            <Link to="/dashboard/applications" className={`${linkClass('/dashboard/applications')} flex items-center gap-2.5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <span>Applications</span>
            </Link>
            <Link to="/dashboard/events" className={`${linkClass('/dashboard/events')} flex items-center gap-2.5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <span>Events</span>
            </Link>
            <Link to="/dashboard/activity" className={`${linkClass('/dashboard/activity')} flex items-center gap-2.5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span>Activity</span>
            </Link>
            <Link to="/dashboard/settings" className={`${linkClass('/dashboard/settings')} flex items-center gap-2.5`}>
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128c.332-.183.582-.495.645-.869L9.594 3.94z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Settings</span>
            </Link>

            {/* Admin specific sidebar panel */}
            {user?.role === 'admin' && (
              <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase px-4 block select-none mb-1">Admin Panel</span>
                <Link to="/dashboard/admin" className={`${linkClass('/dashboard/admin')} flex items-center gap-2.5`}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                  </svg>
                  <span>Admin Overview</span>
                </Link>
                <Link to="/dashboard/admin/users" className={`${linkClass('/dashboard/admin/users')} flex items-center gap-2.5`}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 21c-2.24 0-4.303-.647-6.05-1.758a3.385 3.385 0 01-1.28-2.506 4.125 4.125 0 017.533-2.493c.501.911.787 1.958.787 3.076M15 8.25a3 3 0 11-6 0 3 3 0 016 0zm6 2.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                  <span>User Manager</span>
                </Link>
                <Link to="/dashboard/admin/users?status=pending" className={`${linkClass('/dashboard/admin/users?status=pending')} flex items-center gap-2.5`}>
                  <svg className="w-4 h-4 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Pending Approvals</span>
                </Link>
                <Link to="/dashboard/admin/moderation" className={`${linkClass('/dashboard/admin/moderation')} flex items-center gap-2.5`}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Mod Queue</span>
                </Link>
                <Link to="/dashboard/admin/analytics" className={`${linkClass('/dashboard/admin/analytics')} flex items-center gap-2.5`}>
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.5 4.5L21.75 7.5M21.75 7.5V12m0-4.5H17.25" />
                  </svg>
                  <span>Platform Stats</span>
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Profile card */}
        <div className="space-y-4 shrink-0 mt-auto pt-4 border-t border-slate-100">
          <Link
            to="/dashboard/projects/new"
            className="w-full flex items-center justify-center gap-2 bg-[#006655] hover:bg-[#004d40] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <span>+</span> Create Project
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 bg-[#006655]/10 flex items-center justify-center font-bold text-[#006655] rounded-xl text-xs overflow-hidden shrink-0">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  user?.fullName.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-grow">
                <h5 className="font-bold text-xs text-[#091e22] truncate">{user?.fullName || 'Guild Member'}</h5>
                <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{user?.role || 'member'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 text-sm p-1.5 hover:bg-red-50 rounded-lg transition-colors shrink-0 flex items-center justify-center"
              title="Logout"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
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
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400 pointer-events-none">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search resources..."
                className="pl-8 pr-4 py-1.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs w-48 focus:outline-none"
              />
            </div>
            <Link to="/dashboard/activity" className="text-slate-600 hover:text-[#006655] cursor-pointer relative block hover:scale-105 transition-transform" title="Notifications">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
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

      {showConfirmLogout && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col sm:flex-row items-center gap-4 bg-white border border-slate-100 text-[#091e22] px-6 py-4 rounded-2xl shadow-2xl text-xs font-bold animate-slide-in select-none dark:bg-[#121e21] dark:border-[#1e2e30] dark:text-[#f1f5f9]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span>Are you sure you want to log out?</span>
          </div>
          <div className="flex gap-2 shrink-0">
            <button 
              onClick={() => setShowConfirmLogout(false)}
              className="px-3 py-1.5 border border-slate-200 dark:border-[#1e2e30] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all font-semibold"
            >
              Cancel
            </button>
            <button 
              onClick={executeLogout}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-bold shadow-sm"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
