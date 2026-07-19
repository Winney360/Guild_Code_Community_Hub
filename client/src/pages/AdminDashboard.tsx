import React from 'react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      {/* Welcome Message */}
      <div className="flex justify-between items-center select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Dashboard Overview</h1>
          <p className="text-xs text-[#5c7075]">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs shadow-sm">
          📅 Last 30 Days
        </button>
      </div>

      {/* 1. Statistics Cards Row (matching AdminPanel-DasboardOverview.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        {/* Card 1 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Total Members</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12.5% ↗</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">42,892</span>
            <span className="text-[9px] text-slate-400 font-semibold mt-1 block">+840 this week</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Active Projects</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+4.2% ↗</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">1,204</span>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#006655] h-full" style={{ width: '72%' }} />
            </div>
            <span className="text-[9px] text-slate-400 font-semibold mt-1 block">72% of goal reached</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Pending Reviews</span>
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">-8.1% ↘</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">28</span>
            <div className="flex gap-2 mt-2">
              <span className="px-1.5 py-0.5 bg-red-50 text-[8px] font-extrabold text-red-500 rounded uppercase">12 Urgent</span>
              <span className="px-1.5 py-0.5 bg-amber-50 text-[8px] font-extrabold text-amber-600 rounded uppercase">16 Normal</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Platform Growth</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+24.8% ↗</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">94.2%</span>
            <div className="flex items-end gap-1 h-6 mt-2">
              <div className="bg-emerald-100 w-full h-2 rounded-t" />
              <div className="bg-emerald-200 w-full h-3 rounded-t" />
              <div className="bg-emerald-300 w-full h-2.5 rounded-t" />
              <div className="bg-emerald-400 w-full h-4 rounded-t" />
              <div className="bg-[#006655] w-full h-5.5 rounded-t" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Charts & Interactions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Acquisition chart (8 cols) */}
        <div className="lg:col-span-8 border border-slate-100 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 select-none">
            <div>
              <h3 className="font-extrabold text-sm">User Acquisition</h3>
              <p className="text-[10px] text-slate-400">Daily registrations over the last 14 days</p>
            </div>
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-[9px] font-bold">
              <button className="bg-white px-2.5 py-1 rounded-lg text-slate-700 shadow-sm">Live View</button>
              <button className="px-2.5 py-1 rounded-lg text-slate-500">Export</button>
            </div>
          </div>

          {/* Acquisition Line graph simulator */}
          <div className="h-64 flex flex-col justify-between relative mt-8 select-none">
            <div className="absolute inset-0 flex flex-col justify-between border-b border-slate-100">
              <div className="border-t border-slate-100/50 w-full h-0" />
              <div className="border-t border-slate-100/50 w-full h-0" />
              <div className="border-t border-slate-100/50 w-full h-0" />
            </div>
            {/* SVG line */}
            <svg className="w-full h-44 overflow-visible z-10" viewBox="0 0 600 100" preserveAspectRatio="none">
              <path
                d="M 0 80 Q 75 40 150 70 T 300 30 T 450 80 T 600 20"
                fill="none"
                stroke="#006655"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Highlight dot */}
              <circle cx="340" cy="40" r="6" fill="#006655" stroke="white" strokeWidth="2" />
            </svg>

            {/* Hover tooltip */}
            <div className="absolute top-10 left-[50%] bg-[#091e22] text-white text-[9px] p-2.5 rounded-xl shadow-md z-20 border border-slate-800">
              <span className="font-extrabold block">Oct 14: 1,240 Users</span>
              <span className="text-slate-400">Significant spike via referral campaign</span>
            </div>

            {/* Timestamps */}
            <div className="flex justify-between text-[9px] font-bold text-slate-400 pt-4 border-t border-slate-100">
              <span>OCT 01</span>
              <span>OCT 04</span>
              <span>OCT 07</span>
              <span>OCT 10</span>
              <span>OCT 13</span>
              <span>OCT 16</span>
            </div>
          </div>
        </div>

        {/* Quick Actions & Audit logs (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-sm mb-6 select-none">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <Link
                to="/dashboard/admin/users"
                className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl hover:border-[#006655] hover:bg-white transition-all group"
              >
                <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">👥</span>
                <span className="font-extrabold text-[10px]">Add Member</span>
              </Link>

              <Link
                to="/dashboard/admin/users"
                className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl hover:border-[#006655] hover:bg-white transition-all group"
              >
                <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">🔓</span>
                <span className="font-extrabold text-[10px]">Permissions</span>
              </Link>

              <a
                href="#logs"
                className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl hover:border-[#006655] hover:bg-white transition-all group"
              >
                <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">📄</span>
                <span className="font-extrabold text-[10px]">System Log</span>
              </a>

              <a
                href="#broadcast"
                className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl hover:border-[#006655] hover:bg-white transition-all group"
              >
                <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">✉️</span>
                <span className="font-extrabold text-[10px]">Broadcast</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Global Activity & Engagement type grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Engagement breakdown (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6 select-none">
          {/* Engagement Card */}
          <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm border-b border-slate-50 pb-2 mb-2">Engagement By Type</h3>
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#5c7075]">Code Reviews</span>
                  <span className="text-[#091e22]">64%</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                  <div className="bg-[#006655] h-full rounded-full" style={{ width: '64%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#5c7075]">Project Commits</span>
                  <span className="text-[#091e22]">82%</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                  <div className="bg-[#006655] h-full rounded-full" style={{ width: '82%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[#5c7075]">Discussions</span>
                  <span className="text-[#091e22]">45%</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                  <div className="bg-[#006655] h-full rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Daily Interactions donut simulator */}
          <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
            <h3 className="font-extrabold text-sm mb-4">Daily Interactions</h3>
            <div className="relative w-28 h-28 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#006655]"
                  strokeWidth="3.5"
                  strokeDasharray="80, 100"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-[#091e22]">8.2k</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Interactions</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12% from yesterday</span>
          </div>
        </div>

        {/* Global audit log list (4 cols) */}
        <div className="lg:col-span-4 border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 select-none">
              <h3 className="font-extrabold text-sm">Global Activity</h3>
              <span className="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                Real-time
              </span>
            </div>

            <div className="space-y-4">
              {/* Activity 1 */}
              <div className="flex gap-3 text-[10px] leading-relaxed pb-3 border-b border-slate-50">
                <span className="text-emerald-500">✔️</span>
                <div>
                  <span className="font-bold text-[#091e22] block">Sarah Chen approved PR #452</span>
                  <span className="text-slate-400">in 'Quantum Engine' &bull; 2 minutes ago</span>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="flex gap-3 text-[10px] leading-relaxed pb-3 border-b border-slate-50">
                <span className="text-[#006655]">🚀</span>
                <div>
                  <span className="font-bold text-[#091e22] block">Marcus Wright launched project</span>
                  <span className="text-slate-400">Nebula UI &bull; 15 minutes ago</span>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="flex gap-3 text-[10px] leading-relaxed pb-3 border-b border-slate-50">
                <span className="text-red-500">⚠️</span>
                <div>
                  <span className="font-bold text-[#091e22] block">Suspicious login flagged</span>
                  <span className="text-slate-400">from unknown IP &bull; 1 hour ago</span>
                </div>
              </div>

              {/* Activity 4 */}
              <div className="flex gap-3 text-[10px] leading-relaxed">
                <span className="text-amber-500">⭐</span>
                <div>
                  <span className="font-bold text-[#091e22] block">Aoki Kenji achieved status</span>
                  <span className="text-slate-400">Top Contributor &bull; 2 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full text-center border border-slate-100 bg-slate-50/20 py-2 rounded-xl text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-colors mt-6 select-none">
            View Full Audit Log
          </button>
        </div>

      </div>

    </div>
  );
};
export default AdminDashboard;
