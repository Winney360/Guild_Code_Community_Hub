import React, { useEffect, useState } from 'react';

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

export const PlatformAnalytics: React.FC = () => {
  const [stats, setStats] = useState<StatsType>({
    totalMembers: 0,
    activeProjects: 0,
    pendingReviews: 0,
    totalCollaborations: 0,
    totalEvents: 0,
    growthPercentage: '0.0',
  });
  const [acquisition, setAcquisition] = useState<AcquisitionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setAcquisition(data.acquisitionData || []);
        }
      } catch (err) {
        console.error('Error fetching analytics stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] select-none">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#006655] mb-4"></div>
        <p className="text-xs text-[#5c7075] font-semibold">Loading platform analytics...</p>
      </div>
    );
  }

  // Find max acquisition count to scale chart heights properly
  const maxCount = Math.max(...acquisition.map((item) => item.count), 1);

  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Platform Analytics</h1>
          <p className="text-xs text-[#5c7075]">Analyze platform growth, engagement, and developer interaction metrics.</p>
        </div>
      </div>

      {/* 1. Statistics Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 select-none">
        {/* Card 1 */}
        <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Total Members</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+{stats.growthPercentage}%</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">{stats.totalMembers}</span>
        </div>

        {/* Card 2 */}
        <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Showcase Projects</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live DB</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">{stats.activeProjects}</span>
        </div>

        {/* Card 3 */}
        <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Collaborations</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">{stats.totalCollaborations}</span>
        </div>

        {/* Card 4 */}
        <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Upcoming Events</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Scheduled</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">{stats.totalEvents}</span>
        </div>
      </div>

      {/* 2. User Growth and Ecosystem shares split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User Growth Trajectory */}
        <div className="lg:col-span-8 border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 select-none">
            <div>
              <h3 className="font-extrabold text-sm">User Growth Trajectory</h3>
              <p className="text-[10px] text-slate-400">Tracking daily user registrations over the last 14 days</p>
            </div>
          </div>

          {/* Bar Charts simulator */}
          {acquisition.length > 0 ? (
            <div className="h-64 flex items-end gap-3 select-none pb-2 border-b border-slate-100">
              {acquisition.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center flex-grow group relative">
                  <div className="absolute bottom-full mb-2 bg-[#091e22] text-white text-[8px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none whitespace-nowrap">
                    {item.count} registrations
                  </div>
                  <div 
                    className="bg-[#006655] hover:bg-[#004d40] w-full rounded-t-lg transition-all"
                    style={{ height: `${(item.count / maxCount) * 160}px`, minHeight: '6px' }}
                  />
                  <span className="text-[8px] font-bold text-slate-400 uppercase mt-2 rotate-45 sm:rotate-0 block shrink-0">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 rounded-2xl select-none">
              <p className="text-xs text-slate-400 font-medium">No registrations logged in the last 14 days.</p>
            </div>
          )}
        </div>

        {/* Ecosystem Shares */}
        <div className="lg:col-span-4 border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm select-none">
          <h3 className="font-extrabold text-sm mb-6">Ecosystem Share</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Projects</span>
                <span className="text-xs font-bold">{stats.activeProjects} submissions</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#006655] h-full" style={{ width: stats.totalMembers > 0 ? `${(stats.activeProjects / stats.totalMembers) * 100}%` : '0%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Collaborations</span>
                <span className="text-xs font-bold">{stats.totalCollaborations} opportunities</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: stats.totalMembers > 0 ? `${(stats.totalCollaborations / stats.totalMembers) * 100}%` : '0%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Upcoming Events</span>
                <span className="text-xs font-bold">{stats.totalEvents} webinars</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: stats.totalMembers > 0 ? `${(stats.totalEvents / stats.totalMembers) * 100}%` : '0%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
