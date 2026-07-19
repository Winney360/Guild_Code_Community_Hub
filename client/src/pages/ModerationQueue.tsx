import React, { useState } from 'react';

interface ModerationType {
  _id: string;
  itemTitle: string;
  creator: string;
  status: 'flagged' | 'reported' | 'pending';
  reportType: string;
  timeLabel: string;
}

const mockQueue: ModerationType[] = [
  {
    _id: '1',
    itemTitle: 'Neuro-Pulse AI',
    creator: 'alex_dev',
    status: 'flagged',
    reportType: 'Inappropriate Content (Reported by 3 users)',
    timeLabel: '2 hours ago',
  },
  {
    _id: '2',
    itemTitle: 'Quantum-Dash',
    creator: 'sera_phi',
    status: 'reported',
    reportType: 'Spam / Duplicate (Reported by 1 user)',
    timeLabel: '5 hours ago',
  },
  {
    _id: '3',
    itemTitle: 'Void Bridge',
    creator: 'marcus_codes',
    status: 'pending',
    reportType: 'New Submission (Automatic safety scan)',
    timeLabel: '12 hours ago',
  },
  {
    _id: '4',
    itemTitle: 'Eco-Flow Monitor',
    creator: 'green_dev',
    status: 'flagged',
    reportType: 'Terms of Service violation (Internal audit flag)',
    timeLabel: '1 day ago',
  },
];

export const ModerationQueue: React.FC = () => {
  const [reports, setReports] = useState<ModerationType[]>(mockQueue);
  const [activeTab, setActiveTab] = useState<'all' | 'flagged' | 'reported' | 'pending'>('all');

  const handleAction = (id: string, action: 'dismiss' | 'resolve') => {
    // Dismiss/resolve removes from queue locally
    console.log(`Action ${action} executed on report ${id}`);
    setReports((prev) => prev.filter((r) => r._id !== id));
  };

  const filteredReports = reports.filter((item) => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    const maps: Record<string, string> = {
      flagged: 'bg-red-50 text-red-600 border-red-100',
      reported: 'bg-amber-50 text-amber-600 border-amber-100',
      pending: 'bg-blue-50 text-blue-600 border-blue-100',
    };
    return `px-2.5 py-0.5 border text-[9px] font-bold rounded-lg uppercase ${maps[status] || 'bg-slate-100 text-slate-500'}`;
  };

  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Moderation Queue</h1>
          <p className="text-xs text-[#5c7075]">Manage flagged items, inappropriate comments, and platform infractions.</p>
        </div>
      </div>

      {/* Stats Cards Row (matching AdminPanel-ContentModeration.png) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 select-none">
        {/* Card 1 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Total Reports</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">1,284</span>
        </div>

        {/* Card 2 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Flagged Projects</span>
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">-4%</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">82</span>
        </div>

        {/* Card 3 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Pending Reviews</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">+22</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">315</span>
        </div>

        {/* Card 4 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Resolution Rate</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">98%</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">1h 24m</span>
        </div>
      </div>

      {/* Moderation Queue table list */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        
        {/* Filtering Tabs Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center select-none">
          <div className="flex bg-slate-100 border border-slate-200/50 p-1 rounded-xl gap-1 text-[9px] font-bold text-slate-550">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg ${activeTab === 'all' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              All Content
            </button>
            <button
              onClick={() => setActiveTab('flagged')}
              className={`px-3 py-1.5 rounded-lg ${activeTab === 'flagged' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              Flagged
            </button>
            <button
              onClick={() => setActiveTab('reported')}
              className={`px-3 py-1.5 rounded-lg ${activeTab === 'reported' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              Reported
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg ${activeTab === 'pending' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              Pending
            </button>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-16 text-center select-none">
            <span className="text-4xl block mb-4">🛡️</span>
            <h3 className="font-extrabold text-base mb-1">Queue is clear!</h3>
            <p className="text-xs text-[#5c7075]">All flagged reports have been successfully moderated.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs font-medium text-[#5c7075]">
            <thead className="bg-slate-50 border-b border-slate-100 text-[#091e22] font-bold select-none text-[10px] uppercase">
              <tr>
                <th className="p-4 pl-6">Project / Member</th>
                <th className="p-4">Status</th>
                <th className="p-4">Report Type</th>
                <th className="p-4">Created</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredReports.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/30 transition-colors">
                  {/* Name */}
                  <td className="p-4 pl-6">
                    <span className="font-bold text-[#091e22] block">{item.itemTitle}</span>
                    <span className="text-[10px] text-slate-400">by @{item.creator}</span>
                  </td>

                  {/* Status */}
                  <td className="p-4 select-none">
                    <span className={getStatusBadge(item.status)}>{item.status.toUpperCase()}</span>
                  </td>

                  {/* Report Type */}
                  <td className="p-4">{item.reportType}</td>

                  {/* Created */}
                  <td className="p-4 select-none">{item.timeLabel}</td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right select-none space-x-3">
                    <button
                      onClick={() => handleAction(item._id, 'dismiss')}
                      className="text-slate-400 hover:text-slate-700 font-bold text-[10px]"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleAction(item._id, 'resolve')}
                      className="text-red-500 hover:text-red-700 font-bold text-[10px]"
                    >
                      Flag Content
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
export default ModerationQueue;
