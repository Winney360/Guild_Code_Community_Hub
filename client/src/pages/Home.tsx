import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Stats {
  activeMembers: number;
  projectsShared: number;
  upcomingEvents: number;
}

interface Member {
  _id: string;
  fullName: string;
  profilePicture?: string;
  role?: string;
  specializations?: string[];
  skills?: string[];
  github?: string;
  projectCount?: number;
}

export const Home: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    activeMembers: 0,
    projectsShared: 0,
    upcomingEvents: 0,
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const fetchStatsAndMembers = async () => {
      try {
        const statsRes = await fetch('/api/stats');
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }

        const membersRes = await fetch('/api/users');
        if (membersRes.ok) {
          const membersData = await membersRes.json();
          setMembers(membersData.data || []);
        }
      } catch (err) {
        console.error('Error fetching landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatsAndMembers();
  }, []);

  return (
    <div className="font-sans antialiased text-[#091e22] bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#e6f7f8] via-[#eef9fa] to-white pt-16 pb-20 px-6 relative overflow-hidden select-none">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-semibold text-[#5c7075] shadow-sm mb-8">
            <svg className="w-3.5 h-3.5 text-[#006655] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a5 5 0 100-10 5 5 0 000 10z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 14L4.5 21l3.75-1.5L12 21l3.75-1.5L19.5 21l-3.75-7" />
            </svg>
            <span>Building Together Since 2024</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight max-w-6xl mx-auto">
            Welcome to <span className="text-[#006655] font-serif italic pr-1">Guild Code</span>, <br className="hidden md:block" />
            Ecosystem for <span className="italic text-[#006655] font-serif pr-2">Elite</span> Builders & Founders.
          </h1>

          {/* Subtitle */}
          <p className="text-[#5c7075] text-lg max-w-4xl mx-auto mb-8 leading-relaxed select-none">
            A collaborative platform where developers, designers, and creators come together to learn, build, and grow. <br className="hidden md:block" />
            Share your work, connect with peers, and be part of something amazing.
          </p>

          {/* Active Members Avatar Pile */}
          <div className="flex items-center justify-center gap-4 mb-10 select-none">
            {/* Overlapping Rings (Rendering actual DB members) */}
            {members.length > 0 && (
              <div className="flex items-center">
                <div className="flex -space-x-3 py-1 px-0.5">
                  {members.slice(0, 6).map((member) => (
                    <Link
                      key={member._id}
                      to={`/members/${member._id}`}
                      className="w-10 h-10 rounded-full border-2 border-white bg-[#e6f7f8] flex items-center justify-center text-xs font-bold text-[#006655] shadow-sm select-none overflow-hidden shrink-0 hover:z-10 hover:scale-110 transition-transform"
                      title={member.fullName}
                    >
                      {member.profilePicture && member.profilePicture.trim() !== '' ? (
                        <img
                          src={member.profilePicture}
                          alt={member.fullName}
                          className="w-full h-full object-cover select-none"
                        />
                      ) : (
                        getInitials(member.fullName)
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {/* Active Members count details */}
            <div className="text-left font-bold">
              <div className="flex items-center gap-1 text-xs text-[#091e22]">
                {loading ? '...' : (stats.activeMembers > 0 ? stats.activeMembers : members.length)} Active Members
              </div>
              <p className="text-[9px] text-[#5c7075] font-bold mt-0.5">Explore the community today</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <Link
              to="/members"
              className="w-full sm:w-auto bg-[#006655] hover:bg-[#004d40] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
            >
              Explore Members
            </Link>
            <Link
              to="/projects"
              className="w-full sm:w-auto bg-white border border-slate-200 hover:bg-slate-50 text-[#006655] font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm text-sm"
            >
              View Projects
            </Link>
          </div>

          {/* Live Stat Counters (Spec 4.1) */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-6xl mx-auto shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x md:divide-slate-100">
            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-3xl md:text-4xl font-extrabold text-[#091e22] mb-1">
                {loading ? '...' : (stats.activeMembers > 0 ? stats.activeMembers : members.length)}
              </span>
              <span className="text-xs font-bold text-[#5c7075] uppercase tracking-wider">Active Members</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-3xl md:text-4xl font-extrabold text-[#091e22] mb-1">
                {loading ? '...' : stats.projectsShared}
              </span>
              <span className="text-xs font-bold text-[#5c7075] uppercase tracking-wider">Open Projects</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-3xl md:text-4xl font-extrabold text-[#091e22] mb-1">
                {loading ? '...' : stats.upcomingEvents}
              </span>
              <span className="text-xs font-bold text-[#5c7075] uppercase tracking-wider">
                Upcoming Sessions
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Elite Craftsmanship Section (Vetted Developers) */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">Elite Craftsmanship</h2>
            <p className="text-[#5c7075] text-sm max-w-xl">
              Meet the architects shaping the future. Our members are vetted for technical excellence and collaborative spirit.
            </p>
          </div>
          <Link to="/members" className="text-[#006655] hover:underline text-sm font-semibold flex items-center gap-1 shrink-0">
            <span>View all members</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Members Cards Row */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border border-slate-100 rounded-2xl p-5 bg-white h-56 animate-pulse flex flex-col justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex gap-2 my-4">
                  <div className="h-4 bg-slate-200 rounded w-12"></div>
                  <div className="h-4 bg-slate-200 rounded w-12"></div>
                  <div className="h-4 bg-slate-200 rounded w-12"></div>
                </div>
                <div className="border-t border-slate-50 pt-3 flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-8"></div>
                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.slice(0, 4).map((member) => {
              const primaryRole = member.specializations && member.specializations.length > 0
                ? member.specializations[0]
                : (member.role === 'admin' ? 'Admin / Lead' : 'Community Member');
              const displaySkills = member.skills && member.skills.length > 0
                ? member.skills.slice(0, 3)
                : (member.specializations ? member.specializations.slice(0, 3) : []);

              return (
                <div
                  key={member._id}
                  className="border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow transition-shadow bg-white flex flex-col justify-between h-56"
                >
                  <div className="flex items-center gap-4">
                    <Link to={`/members/${member._id}`} className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold text-[#006655]">
                      {member.profilePicture ? (
                        <img
                          src={member.profilePicture}
                          alt={member.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{getInitials(member.fullName)}</span>
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/members/${member._id}`} className="font-bold text-sm hover:text-[#006655] truncate block">
                        {member.fullName}
                      </Link>
                      <p className="text-xs text-[#5c7075] truncate">{primaryRole}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 my-4">
                    {displaySkills.length > 0 ? (
                      displaySkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-[#5c7075] text-[10px] rounded font-semibold truncate max-w-[90px]"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-[#5c7075] text-[10px] rounded font-semibold">
                        Builder
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-auto text-xs text-[#5c7075]">
                    {member.github ? (
                      <a
                        href={member.github.startsWith('http') ? member.github : `https://${member.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#091e22]"
                        title="GitHub Profile"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      </a>
                    ) : (
                      <Link to={`/members/${member._id}`} className="hover:text-[#091e22]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </Link>
                    )}
                    <span>{member.projectCount ?? 0} {member.projectCount === 1 ? 'Project' : 'Projects'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 border border-slate-100 rounded-2xl">
            <p className="text-[#5c7075] text-sm">No active members found yet. Be the first to join!</p>
          </div>
        )}
      </section>

      {/* Innovation in Action Section (Featured Projects Grid) */}
      <section className="bg-slate-50/50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-3">Innovation in Action</h2>
            <p className="text-[#5c7075] text-sm max-w-md mx-auto">
              Peer into the repositories of the Guild. From low-level kernel optimization to distributed ledger protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Featured Project (Takes 2 Columns on large screens) */}
            <div className="lg:col-span-2 border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-sm flex flex-col justify-between">
              <div>
                {/* Banner Image */}
                <div className="relative aspect-[16/9] w-full bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop"
                    alt="Aether Mesh Protocol"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-[#e6f7f8] border border-[#006655]/20 text-[#006655] text-xs font-bold rounded-full">
                    Featured
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-[#091e22]">Aether Mesh Protocol</h3>
                    <div className="flex gap-4 text-xs text-[#5c7075] items-center">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        1.2k
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        8.4k
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[#5c7075] mb-6 leading-relaxed">
                    High-performance decentralized networking layer built with Rust and libp2p.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-100 font-semibold">#p2p</span>
                    <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-100 font-semibold">#rust</span>
                    <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs rounded-lg border border-slate-100 font-semibold">#networking</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Mini Project Cards stack */}
            <div className="flex flex-col gap-6">
              {/* Card 1 */}
              <div className="border border-slate-100 rounded-3xl p-6 bg-white shadow-sm flex flex-col justify-between flex-grow">
                <div>
                  <h4 className="font-bold text-base mb-2">TypeGenie</h4>
                  <p className="text-xs text-[#5c7075] leading-relaxed mb-4">
                    AI-powered TypeScript interface generator for complex JSON schemas.
                  </p>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex gap-1">
                    <span className="w-5 h-5 bg-[#006655]/10 border border-[#006655]/20 rounded-full flex items-center justify-center text-[10px] text-[#006655] font-bold">AI</span>
                    <span className="w-5 h-5 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-500 font-bold">TS</span>
                  </div>
                  <a href="#github" className="text-[#006655] hover:underline font-bold">View Code</a>
                </div>
              </div>

              {/* Card 2 */}
              <div className="border border-slate-100 rounded-3xl p-6 bg-white shadow-sm flex flex-col justify-between flex-grow">
                <div>
                  <h4 className="font-bold text-base mb-2">Neovim Pro Pack</h4>
                  <p className="text-xs text-[#5c7075] leading-relaxed mb-4">
                    The ultimate productivity configuration for modern systems engineers.
                  </p>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex gap-1">
                    <span className="w-5 h-5 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-[10px] text-slate-500 font-bold">Lua</span>
                  </div>
                  <a href="#github" className="text-[#006655] hover:underline font-bold">View Repo</a>
                </div>
              </div>

              {/* Card 3 */}
              <div className="border border-slate-100 rounded-3xl p-6 bg-white shadow-sm flex flex-col justify-between flex-grow">
                <div>
                  <h4 className="font-bold text-base mb-2">CloudFlow Runner</h4>
                  <p className="text-xs text-[#5c7075] leading-relaxed mb-4">
                    Zero-config serverless orchestration engine for multi-cloud deployments.
                  </p>
                </div>
                <div className="flex justify-between items-center gap-2 text-xs">
                  <a href="#code" className="bg-[#006655] hover:bg-[#004d40] text-white py-1.5 px-3 rounded-lg font-bold text-[10px] shadow-sm">View Source</a>
                  <a href="#docs" className="text-[#5c7075] hover:text-[#091e22] font-semibold text-[10px]">Docs</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center relative select-none">
        <span className="text-8xl font-serif text-[#006655]/10 leading-none select-none absolute top-10 left-1/2 -translate-x-1/2">
          “
        </span>
        <blockquote className="relative z-10 text-xl md:text-2xl font-medium italic text-[#091e22] leading-relaxed mb-8">
          "Guild Code isn't just another platform; it's the professional sanctuary I didn't know I needed.
          The level of discourse and the quality of projects here are unparalleled in the open-source world."
        </blockquote>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden mb-3">
            <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" alt="Jameson Burke" />
          </div>
          <span className="font-bold text-sm">Jameson Burke</span>
          <span className="text-xs text-[#5c7075]">Principal Engineer @ TechCorp</span>
        </div>
      </section>
    </div>
  );
};
export default Home;
