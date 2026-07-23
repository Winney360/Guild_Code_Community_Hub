import React, { useEffect, useState } from 'react';

interface ModerationType {
  _id: string;
  itemTitle: string;
  creator: string;
  status: 'flagged' | 'reported' | 'pending';
  reportType: string;
  timeLabel: string;
}

export const ModerationQueue: React.FC = () => {
  const [reports, setReports] = useState<ModerationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'flagged' | 'reported' | 'pending'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/moderation');
      if (res.ok) {
        const data = await res.json();
        setReports(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching moderation queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (id: string, action: 'dismiss' | 'resolve') => {
    try {
      setActionLoading(id);
      const res = await fetch(`/api/admin/moderation/${id}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        // Refresh queue
        await fetchQueue();
      }
    } catch (err) {
      console.error(`Error performing moderation action ${action}:`, err);
    } finally {
      setActionLoading(null);
    }
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

  if (loading && reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] select-none">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#006655] mb-4"></div>
        <p className="text-xs text-[#5c7075] font-semibold">Loading content moderation queue...</p>
      </div>
    );
  }

  const flaggedCount = reports.filter((r) => r.status === 'flagged').length;
  const pendingCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Moderation Queue</h1>
          <p className="text-xs text-[#5c7075]">Manage flagged items, inappropriate comments, and platform infractions.</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 select-none">
        {/* Card 1 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Total Items</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live DB</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">{reports.length}</span>
        </div>

        {/* Card 2 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Moderated / Hidden</span>
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Flagged</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">{flaggedCount}</span>
        </div>

        {/* Card 3 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Visible / Active</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Audited</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">{pendingCount}</span>
        </div>

        {/* Card 4 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Status Code</span>
            <span className="text-[10px] font-bold text-[#006655] bg-[#006655]/10 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">MERN</span>
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
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg ${activeTab === 'pending' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500'}`}
            >
              Pending Reviews
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-medium text-[#5c7075] min-w-[600px]">
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
                      <span className="text-[10px] text-slate-400">by {item.creator}</span>
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
                      {actionLoading === item._id ? (
                        <span className="text-[10px] font-bold text-[#006655]">Processing...</span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleAction(item._id, 'dismiss')}
                            className="text-[#006655] hover:text-[#004d40] font-bold text-[10px]"
                            title="Restore public visibility"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(item._id, 'resolve')}
                            className="text-red-500 hover:text-red-700 font-bold text-[10px]"
                            title="Hide content from public showcae"
                          >
                            Moderate (Hide)
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
    </div>
  );
};

export default ModerationQueue;
