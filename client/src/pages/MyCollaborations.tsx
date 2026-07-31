import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.js';

interface CollaborationType {
  _id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  techStack: string[];
  commitment: string;
  duration: string;
  status: 'open' | 'closed';
  updatedAt: string;
}

export const MyCollaborations: React.FC = () => {
  const [collabs, setCollabs] = useState<CollaborationType[]>([]);
  const [filteredCollabs, setFilteredCollabs] = useState<CollaborationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMyCollabs = async () => {
      try {
        const res = await fetch('/api/collaborations/my');
        if (res.ok) {
          const data = await res.json();
          setCollabs(data.data);
          setFilteredCollabs(data.data);
        }
      } catch (err) {
        console.error('Error fetching my collaborations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCollabs();
  }, []);

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredCollabs(collabs);
      return;
    }
    const q = search.toLowerCase();
    const result = collabs.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.requiredSkills.some((s) => s.toLowerCase().includes(q))
    );
    setFilteredCollabs(result);
  }, [search, collabs]);

  const getStatusStyle = (status: string) => {
    if (status === 'open') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    return 'bg-slate-100 text-slate-500 border-slate-200';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-[#5c7075] font-semibold">Loading your collaborations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      
      {/* Header bar */}
      <ScrollReveal>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">My Collaborations</h1>
          <p className="text-xs text-[#5c7075]">Manage and monitor your open collaboration requests.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search collaborations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>
      </ScrollReveal>

      {/* Grid listing */}
      <ScrollReveal>
      {collabs.length === 0 ? (
        // Empty State
        <div className="border border-dashed border-slate-200 rounded-3xl p-16 text-center bg-white shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-teal-50 text-teal-700 border border-teal-100 rounded-full flex items-center justify-center mb-4 select-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <h3 className="font-extrabold text-base mb-1">Post Collaboration</h3>
          <p className="text-xs text-[#5c7075] max-w-xs mb-6">Find developers, designers, and visionaries to join your projects. Outline required skills and schedules.</p>
          <Link
            to="/dashboard/collaborations/new"
            className="bg-[#006655] hover:bg-[#004d40] text-[#ffffff] py-2.5 px-6 rounded-xl font-bold text-xs transition-colors shadow-sm"
          >
            Post Collaboration
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCollabs.map((collab) => (
            <div
              key={collab._id}
              className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm hover:shadow transition-shadow flex flex-col justify-between h-[360px]"
            >
              <div>
                {/* Header title */}
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h4 className="font-bold text-base text-[#091e22] line-clamp-1">{collab.title}</h4>
                  <div className="flex items-center gap-3 select-none">
                    <span className={`px-2.5 py-0.5 border text-[9px] font-bold rounded-lg ${getStatusStyle(collab.status)}`}>
                      {collab.status.toUpperCase()}
                    </span>
                    <Link to={`/dashboard/collaborations/edit/${collab._id}`} className="text-slate-400 hover:text-[#006655] text-xs" title="Edit collaboration">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#5c7075] leading-relaxed line-clamp-2 mb-4">
                  {collab.description}
                </p>

                {/* Required Skills list */}
                <div className="mb-4">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Required Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {collab.requiredSkills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-50 border border-slate-150 text-[9px] text-[#5c7075] rounded font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tech Stack list */}
                <div className="mb-4">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Tech Stack</span>
                  <div className="flex flex-wrap gap-1">
                    {collab.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 bg-[#006655]/5 border border-[#006655]/15 text-[9px] text-[#006655] rounded font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom details card info */}
              <div className="border-t border-[#006655]/30 dark:border-[#00a88a]/40 pt-4 flex flex-col justify-between gap-4">
                <div className="flex justify-between items-center text-[10px] bg-slate-50/50 border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-xl p-3 select-none">
                  <div>
                    <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5">Commitment</span>
                    <span className="font-extrabold text-[#091e22]">{collab.commitment}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[9px] font-bold uppercase mb-0.5">Duration</span>
                    <span className="font-extrabold text-[#091e22]">{collab.duration}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}

          {/* Plus Add collaboration card */}
          <Link
            to="/dashboard/collaborations/new"
            className="border-2 border-dashed border-slate-200 hover:border-[#006655] rounded-3xl p-6 bg-slate-50/20 text-center flex flex-col items-center justify-center h-[360px] transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl font-bold text-[#006655] mb-4 select-none">
              +
            </div>
            <h4 className="font-bold text-sm text-[#091e22] mb-1">Post Collaboration</h4>
            <p className="text-[10px] text-[#5c7075]">Find developers & designers for projects</p>
          </Link>
        </div>
      )}
      </ScrollReveal>

    </div>
  );
};
export default MyCollaborations;
