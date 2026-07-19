import React from 'react';

interface TrendingType {
  _id: string;
  projectName: string;
  desc: string;
  stars: string;
  commits: number;
  developer: string;
  status: 'Explosive' | 'Steady' | 'Review';
}

const mockTrending: TrendingType[] = [
  {
    _id: '1',
    projectName: 'NextSync',
    desc: 'Real-time collaboration engine',
    stars: '4.2k',
    commits: 82,
    developer: '@alex_dev',
    status: 'Explosive',
  },
  {
    _id: '2',
    projectName: 'Quantum-Layer',
    desc: 'WASM-based cryptography',
    stars: '1.8k',
    commits: 14,
    developer: '@sarah_codes',
    status: 'Steady',
  },
  {
    _id: '3',
    projectName: 'Atlas-Bridge',
    desc: 'Multi-cloud orchestration',
    stars: '942',
    commits: 5,
    developer: '@j_smith',
    status: 'Review',
  },
];

export const PlatformAnalytics: React.FC = () => {
  const getStatusBadge = (status: string) => {
    if (status === 'Explosive') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (status === 'Steady') return 'bg-blue-50 text-blue-600 border-blue-100';
    return 'bg-slate-100 text-slate-500 border-slate-200';
  };

  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Platform Analytics</h1>
          <p className="text-xs text-[#5c7075]">Analyze platform growth, engagement, and developer interaction metrics.</p>
        </div>
        <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs shadow-sm">
          📅 Last 30 Days
        </button>
      </div>

      {/* 1. Statistics Cards Row (matching designs/AdminPanel-PlatformAnalytics.png) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 select-none">
        {/* Card 1 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Total Active Users</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">24.5k</span>
        </div>

        {/* Card 2 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">New Projects</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+5.2%</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">1,204</span>
        </div>

        {/* Card 3 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Pull Requests</span>
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">-2.1%</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">8.9k</span>
        </div>

        {/* Card 4 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Avg. Response Time</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">-14ms</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">142ms</span>
        </div>
      </div>

      {/* 2. User Growth and Ecosystem shares split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* User Growth Trajectory (8 cols) */}
        <div className="lg:col-span-8 border border-slate-100 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 select-none">
            <div>
              <h3 className="font-extrabold text-sm">User Growth Trajectory</h3>
              <p className="text-[10px] text-slate-400">Tracking daily active users (DAU) over time</p>
            </div>
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-[9px] font-bold">
              <button className="bg-white px-2.5 py-1 rounded-lg text-slate-700 shadow-sm">Daily</button>
              <button className="px-2.5 py-1 rounded-lg text-slate-500">Monthly</button>
            </div>
          </div>

          {/* Bar Charts simulator */}
          <div className="h-64 flex items-end gap-3 select-none">
            <div className="flex flex-col items-center flex-grow">
              <div className="bg-[#006655]/30 w-full h-24 rounded-t-lg" />
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">Jan</span>
            </div>
            <div className="flex flex-col items-center flex-grow">
              <div className="bg-[#006655]/30 w-full h-20 rounded-t-lg" />
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">Feb</span>
            </div>
            <div className="flex flex-col items-center flex-grow">
              <div className="bg-[#006655]/40 w-full h-28 rounded-t-lg" />
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">Mar</span>
            </div>
            <div className="flex flex-col items-center flex-grow">
              <div className="bg-[#006655]/40 w-full h-26 rounded-t-lg" />
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">Apr</span>
            </div>
            <div className="flex flex-col items-center flex-grow">
              <div className="bg-[#006655]/50 w-full h-36 rounded-t-lg" />
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">May</span>
            </div>
            <div className="flex flex-col items-center flex-grow">
              <div className="bg-[#006655]/60 w-full h-40 rounded-t-lg" />
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">Jun</span>
            </div>
            <div className="flex flex-col items-center flex-grow">
              <div className="bg-[#006655]/50 w-full h-32 rounded-t-lg" />
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">Jul</span>
            </div>
            <div className="flex flex-col items-center flex-grow">
              <div className="bg-[#006655]/60 w-full h-44 rounded-t-lg" />
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">Aug</span>
            </div>
            <div className="flex flex-col items-center flex-grow">
              <div className="bg-[#006655]/60 w-full h-36 rounded-t-lg" />
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">Sep</span>
            </div>
            <div className="flex flex-col items-center flex-grow">
              <div className="bg-[#006655]/70 w-full h-48 rounded-t-lg" />
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">Oct</span>
            </div>
            <div className="flex flex-col items-center flex-grow">
              <div className="bg-[#006655]/70 w-full h-42 rounded-t-lg" />
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">Nov</span>
            </div>
            <div className="flex flex-col items-center flex-grow">
              <div className="bg-[#006655] w-full h-52 rounded-t-lg" />
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-2">Dec</span>
            </div>
          </div>
        </div>

        {/* Ecosystem Shares (4 cols) */}
        <div className="lg:col-span-4 border border-slate-100 bg-white rounded-3xl p-6 shadow-sm space-y-5 select-none">
          <h3 className="font-extrabold text-sm border-b border-slate-50 pb-2 mb-2">Ecosystem Shares</h3>
          <div className="space-y-4 text-xs font-semibold">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[#5c7075]">Web Development</span>
                <span className="text-[#091e22]">42%</span>
              </div>
              <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                <div className="bg-[#006655] h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[#5c7075]">AI / Machine Learning</span>
                <span className="text-[#091e22]">28%</span>
              </div>
              <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                <div className="bg-[#006655] h-full rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[#5c7075]">DevOps & Cloud</span>
                <span className="text-[#091e22]">15%</span>
              </div>
              <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                <div className="bg-[#006655] h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[#5c7075]">Blockchain</span>
                <span className="text-[#091e22]">10%</span>
              </div>
              <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100">
                <div className="bg-[#006655] h-full rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Trending Projects list */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center select-none">
          <h3 className="font-extrabold text-sm">Recent Trending Projects</h3>
          <span className="text-[#006655] hover:underline text-xs font-semibold cursor-pointer">View All Projects</span>
        </div>

        <table className="w-full text-left text-xs font-medium text-[#5c7075]">
          <thead className="bg-slate-50 border-b border-slate-100 text-[#091e22] font-bold select-none text-[10px] uppercase">
            <tr>
              <th className="p-4 pl-6">Project Name</th>
              <th className="p-4">Stars</th>
              <th className="p-4">Commits (24H)</th>
              <th className="p-4">Lead Developer</th>
              <th className="p-4 pr-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockTrending.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-4 pl-6">
                  <span className="font-bold text-[#091e22] block">{item.projectName}</span>
                  <span className="text-[10px] text-slate-400">{item.desc}</span>
                </td>
                <td className="p-4 font-bold text-[#091e22] select-none">⭐ {item.stars}</td>
                <td className="p-4 font-semibold select-none">{item.commits}</td>
                <td className="p-4 font-semibold">{item.developer}</td>
                <td className="p-4 pr-6 text-right select-none">
                  <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-lg ${getStatusBadge(item.status)}`}>
                    {item.status.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
export default PlatformAnalytics;
