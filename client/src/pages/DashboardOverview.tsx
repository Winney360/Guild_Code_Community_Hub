import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();

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
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">24</span>
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Active Projects</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-lg bg-teal-50 text-teal-600 p-2 rounded-xl">🤝</span>
            <span className="text-[10px] font-bold text-[#5c7075] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">Steady</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">08</span>
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Open Collaborations</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-lg bg-blue-50 text-blue-600 p-2 rounded-xl">✉️</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">+4 new</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">15</span>
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">New Applications</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <span className="text-lg bg-rose-50 text-rose-600 p-2 rounded-xl">👁️</span>
            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">-2%</span>
          </div>
          <div>
            <span className="text-2xl font-extrabold block leading-tight">1.2k</span>
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Profile Views</span>
          </div>
        </div>
      </div>

      {/* 2. Main Content Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Activity (takes 8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 select-none">
              <h3 className="font-extrabold text-base">Recent Activity</h3>
              <a href="#activities" className="text-[#006655] hover:underline text-xs font-semibold">View All</a>
            </div>

            {/* Activity Timeline List */}
            <div className="space-y-6">
              {/* Activity item 1 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-xs shrink-0 select-none">
                  📁
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-[#091e22]">
                      Project Update: <span className="text-[#006655] font-semibold hover:underline cursor-pointer">NeuralMesh-v2</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold select-none">2h ago</span>
                  </div>
                  <p className="text-xs text-[#5c7075] leading-relaxed mb-2">
                    Successfully merged pull request #42: Implementing real-time GPU acceleration layers for decentralized compute.
                  </p>
                  <div className="flex gap-1 select-none">
                    <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-150 text-[9px] text-slate-400 font-bold rounded">RUST</span>
                    <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-150 text-[9px] text-slate-400 font-bold rounded">WASM</span>
                  </div>
                </div>
              </div>

              {/* Activity item 2 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-xs shrink-0 select-none">
                  💬
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-[#091e22]">
                      New Message from <span className="text-[#006655] font-semibold hover:underline cursor-pointer">Sarah Jenkins</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold select-none">5h ago</span>
                  </div>
                  <p className="text-xs text-[#5c7075] leading-relaxed">
                    "Hey! I saw your recent work on the Guild Code API. Would love to discuss a potential collab on the core-engine..."
                  </p>
                </div>
              </div>

              {/* Activity item 3 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-xs shrink-0 select-none">
                  🛡️
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-[#091e22]">Application Status Change</span>
                    <span className="text-[10px] text-slate-400 font-semibold select-none">1d ago</span>
                  </div>
                  <p className="text-xs text-[#5c7075] leading-relaxed">
                    Your application for <span className="font-bold">Lead Systems Architect</span> at Nebula Systems has been moved to <span className="text-emerald-600 font-semibold">Shortlisted</span>.
                  </p>
                </div>
              </div>

              {/* Activity item 4 */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center text-xs shrink-0 select-none">
                  🚀
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-xs text-[#091e22]">New Ecosystem Launch</span>
                    <span className="text-[10px] text-slate-400 font-semibold select-none">2d ago</span>
                  </div>
                  <p className="text-xs text-[#5c7075] leading-relaxed">
                    Guild Code officially launched the <span className="font-bold">Z-Protocol Alpha</span>. Join the first wave of validators.
                  </p>
                </div>
              </div>
            </div>

            {/* Load more */}
            <button className="w-full text-center border border-slate-100 py-2.5 rounded-xl text-xs text-slate-500 font-semibold bg-slate-50/30 hover:bg-slate-50 transition-colors mt-8 select-none">
              Load More Activity
            </button>
          </div>
        </div>

        {/* Right Column: Quick Actions & Notifications (takes 4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Actions Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-base mb-6 select-none">Quick Actions</h3>
            <div className="space-y-3">
              {/* Action 1 */}
              <Link
                to="/dashboard/projects/new"
                className="flex items-center gap-4 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors"
              >
                <span className="text-base bg-emerald-50 text-emerald-600 p-2 rounded-xl select-none">➕</span>
                <div>
                  <h4 className="font-bold text-xs">Create Project</h4>
                  <p className="text-[9px] text-[#5c7075] mt-0.5">Launch a new build</p>
                </div>
              </Link>

              {/* Action 2 */}
              <Link
                to="/dashboard/collaborations/new"
                className="flex items-center gap-4 p-3 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-colors"
              >
                <span className="text-base bg-teal-50 text-teal-600 p-2 rounded-xl select-none">📢</span>
                <div>
                  <h4 className="font-bold text-xs">Post Collaboration</h4>
                  <p className="text-[9px] text-[#5c7075] mt-0.5">Find team members</p>
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
                  <p className="text-[9px] text-[#5c7075] mt-0.5">Connect with devs</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 select-none">
              <h3 className="font-extrabold text-base">Notifications</h3>
              <span className="w-5 h-5 bg-[#006655] text-white flex items-center justify-center text-[10px] font-bold rounded-full">
                3
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {/* Notification 1 */}
              <div className="p-3 bg-emerald-50/40 border border-emerald-100/50 rounded-2xl text-[11px] leading-relaxed">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">🟢 System Maintenance</span>
                </div>
                <p className="text-[#5c7075]">API will be down for 20 mins at 02:00 UTC.</p>
              </div>

              {/* Notification 2 */}
              <div className="text-[11px] leading-relaxed py-1 border-b border-slate-50">
                <span className="font-bold block text-slate-800">👤 New Follower</span>
                <p className="text-[#5c7075] mt-0.5">Marcus Lin started following your work.</p>
              </div>

              {/* Notification 3 */}
              <div className="text-[11px] leading-relaxed py-1 border-b border-slate-50">
                <span className="font-bold block text-slate-800">⭐ Project Starred</span>
                <p className="text-[#5c7075] mt-0.5">Your project 'Vortex-UI' received 50 stars!</p>
              </div>

              {/* Notification 4 */}
              <div className="text-[11px] leading-relaxed py-1">
                <span className="font-bold block text-slate-800">📄 Docs Updated</span>
                <p className="text-[#5c7075] mt-0.5">View the latest changes to the Guild CLI.</p>
              </div>
            </div>

            <button className="w-full text-center text-xs font-bold text-[#006655] hover:underline pt-2 select-none">
              Mark all as read
            </button>
          </div>

          {/* Referral Banner card */}
          <div className="bg-gradient-to-br from-[#006655] to-[#004d40] rounded-3xl p-6 text-white text-center shadow-sm select-none">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-teal-300 mb-1">Guild Ecosystem</span>
            <h4 className="font-bold text-sm mb-4 leading-relaxed">Upgrade to Pro for limitless project slots.</h4>
            <button className="bg-white text-[#006655] hover:bg-slate-50 font-bold py-2 px-6 rounded-xl text-xs transition-colors shadow-sm">
              Go Premium
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
export default DashboardOverview;
