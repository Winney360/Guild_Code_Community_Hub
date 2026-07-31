import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

interface CollaborationType {
  _id: string;
  title: string;
  description: string;
  byUser: {
    _id: string;
    fullName: string;
    profilePicture?: string;
  };
  requiredSkills: string[];
  techStack: string[];
  commitment: string;
  duration: string;
  timezone: string;
  rolesNeeded: string[];
  status: 'open' | 'closed';
  likes: string[];
  views: number;
  applicantsCount?: number;
  commentsCount?: number;
  createdAt: string;
}

export const CollaborationMarketplace: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collaborations, setCollaborations] = useState<CollaborationType[]>([]);
  const [filteredCollabs, setFilteredCollabs] = useState<CollaborationType[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Pagination filter states
  const [search, setSearch] = useState('');
  const ITEMS_PER_PAGE = 6;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const res = await fetch('/api/collaborations');
        if (res.ok) {
          const data = await res.json();
          setCollaborations(data.data);
          setFilteredCollabs(data.data);
        }
      } catch (err) {
        console.error('Error fetching collaborations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollaborations();
  }, []);

  const handleLikeCollab = async (collabId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`/api/collaborations/${collabId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setCollaborations((prev) =>
          prev.map((c) => {
            if (c._id === collabId) {
              const currentLikes = c.likes || [];
              const userLiked = currentLikes.some(
                (id: any) => (typeof id === 'string' ? id : id._id || id.toString()) === user._id
              );
              let updatedLikes = [...currentLikes];
              if (data.isLiked && !userLiked) {
                updatedLikes.push(user._id);
              } else if (!data.isLiked) {
                updatedLikes = updatedLikes.filter(
                  (id: any) => (typeof id === 'string' ? id : id._id || id.toString()) !== user._id
                );
              }
              return { ...c, likes: updatedLikes };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.error('Error liking collaboration:', err);
    }
  };

  // Filter application
  useEffect(() => {
    if (!search.trim()) {
      setFilteredCollabs(collaborations);
      return;
    }

    const q = search.toLowerCase();
    const result = collaborations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
        c.techStack.some((t) => t.toLowerCase().includes(q))
    );
    setFilteredCollabs(result);
    setVisibleCount(ITEMS_PER_PAGE);
  }, [search, collaborations]);

  const getTimeElapsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-[#091e22]">
      {/* Title Header */}
      <div className="mb-10 text-center flex flex-col items-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Collaboration Marketplace</h1>
        <p className="text-[#5c7075] text-base max-w-2xl leading-relaxed text-center">
          Connect with world-class engineers, designers, and visionaries. Discover opportunities to build the next generation of decentralized infrastructure.
        </p>
      </div>

      {/* Filter Bar Panel */}
      <div className="bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-2xl p-6 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search skills, tech, or project titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
          />
        </div>

        {/* Info Stats indicators */}
        <div className="flex items-center gap-3 shrink-0 text-[10px] font-bold">
          <span className="px-3 py-1.5 bg-[#e6f7f8] text-[#006655] rounded-lg">
            Active Now: {loading ? '...' : collaborations.filter((c) => c.status === 'open').length}
          </span>
          <span className="px-3 py-1.5 bg-slate-50 border border-slate-250 text-slate-600 rounded-lg">
            Matches: {loading ? '...' : filteredCollabs.length}
          </span>
        </div>
      </div>

      {/* Collaboration Opportunities Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs text-[#5c7075] font-semibold">Loading opportunities...</span>
        </div>
      ) : filteredCollabs.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl p-16 text-center bg-white shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006655] flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-base mb-1">No collaborations found</h3>
          <p className="text-xs text-[#5c7075]">Try modifying your search or skills queries.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredCollabs.slice(0, visibleCount).map((collab, idx) => (
            <div
              key={collab._id}
              onClick={() => navigate(`/collaborate/${collab._id}`)}
              className="border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-3xl p-6 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[360px] cursor-pointer group"
            >
              <div>
                {/* Header row: creator details */}
                <div className="flex items-start justify-between gap-4 mb-4 select-none">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden shrink-0 border border-slate-50">
                      {collab.byUser && collab.byUser.profilePicture ? (
                        <img
                          src={collab.byUser.profilePicture}
                          alt={collab.byUser.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#006655]/10 flex items-center justify-center font-bold text-[#006655] text-sm">
                          {collab.byUser ? collab.byUser.fullName.charAt(0).toUpperCase() : 'C'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-base line-clamp-1 group-hover:text-[#006655] transition-colors">{collab.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        By @{collab.byUser ? collab.byUser.fullName.toLowerCase().replace(/\s+/g, '') : 'member'} &bull; {getTimeElapsed(collab.createdAt)}
                      </p>
                    </div>
                  </div>

                  {idx === 1 && (
                    <span className="px-2 py-0.5 bg-[#e6f7f8] text-[#006655] text-[9px] font-bold rounded-md border border-[#006655]/10 shrink-0">
                      Featured
                    </span>
                  )}
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

              {/* Bottom footer section */}
              <div className="border-t border-[#006655]/30 dark:border-[#00a88a]/40 pt-4 flex flex-col justify-between gap-4">
                {/* Meta details row */}
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

                {/* Bottom engagement items */}
                <div className="flex justify-between items-center text-[10px] text-[#5c7075] select-none font-semibold">
                  <div className="flex gap-4 items-center" onClick={(e) => e.stopPropagation()}>
                    {(() => {
                      const likesList = collab.likes || [];
                      const isLiked = user && likesList.some(
                        (id: any) => (typeof id === 'string' ? id : id._id || id.toString()) === user._id
                      );
                      return (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeCollab(collab._id);
                          }}
                          className={`flex items-center gap-1 transition-colors cursor-pointer ${isLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-500'}`}
                          title="Like collaboration"
                        >
                          <svg className="w-3.5 h-3.5 text-rose-500" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {likesList.length}
                        </button>
                      );
                    })()}
                    <Link
                      to={`/collaborate/${collab._id}#discussion`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 hover:text-[#006655] transition-colors cursor-pointer"
                      title="View discussion & comments"
                    >
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {collab.commentsCount || 0}
                    </Link>
                  </div>
                  <Link
                    to={`/collaborate/${collab._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#006655] hover:bg-[#004d40] text-white py-2 px-5 rounded-xl transition-colors font-bold text-xs"
                  >
                    View & Apply
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Pagination Load more (Only appear if there are more collaborations to view) */}
      {!loading && visibleCount < filteredCollabs.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            Load More Opportunities <span>▼</span>
          </button>
        </div>
      )}
    </div>
  );
};
export default CollaborationMarketplace;
