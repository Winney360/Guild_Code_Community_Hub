import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Member {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  specializations: string[];
  location?: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  bio?: string;
  profilePicture?: string;
  joinDate?: string;
  status: string;
  isActive: boolean;
}

export const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setMember(data.data);
        }
      } catch (err) {
        console.error('Error fetching member profile:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMember();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-[#5c7075] font-semibold">Loading profile...</span>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 border border-dashed border-slate-200 rounded-2xl text-center bg-white shadow-sm">
        <span className="text-4xl block mb-4">🕵️‍♂️</span>
        <h3 className="font-bold text-base mb-1">Profile not found</h3>
        <p className="text-xs text-[#5c7075] mb-6">The member profile you are looking for does not exist or is not active.</p>
        <Link to="/members" className="bg-[#006655] hover:bg-[#004d40] text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-sm">
          Return to Directory
        </Link>
      </div>
    );
  }

  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Sept 2022';
    const date = new Date(dateString);
    return `Joined ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-[#091e22] bg-slate-50/10">
      
      {/* 1. Header Card Panel */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative">
        {/* Avatar image */}
        <div className="relative shrink-0 select-none">
          <div className="w-28 h-28 rounded-full overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
            {member.profilePicture ? (
              <img src={member.profilePicture} alt={member.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#006655]/10 flex items-center justify-center text-4xl font-bold text-[#006655]">
                {member.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {/* Active status indicator green dot */}
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-[#00e676] border-4 border-white rounded-full"></span>
        </div>

        {/* Member details info */}
        <div className="flex-grow flex flex-col justify-between h-full text-center md:text-left">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">{member.fullName}</h1>
            <p className="text-sm text-[#5c7075] font-semibold mb-3">
              {member.specializations.join(', ') || 'Lead Core Engineer'} &bull; Member since 2022
            </p>
            <p className="text-sm text-[#5c7075] leading-relaxed max-w-3xl mb-6">
              {member.bio || 'Full-stack architect specializing in distributed systems and rust-based compilers. Currently exploring the intersection of Web3 infrastructure and developer productivity tools.'}
            </p>
          </div>

          {/* Footer of card */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-xs text-[#5c7075] font-semibold">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {member.location || 'San Francisco, CA'}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatJoinDate(member.joinDate)}
            </span>
          </div>
        </div>

        {/* Right side CTA / links */}
        <div className="flex flex-col sm:flex-row md:flex-col items-center gap-3 shrink-0 self-center md:self-start">
          <div className="flex gap-2">
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            )}
          </div>
          <button className="bg-[#006655] hover:bg-[#004d40] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-sm w-36">
            Follow Member
          </button>
        </div>
      </div>

      {/* 2. Content Row: Ecosystem Rank & Technical Proficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left Column: Ecosystem Rank Card (takes 4 columns) */}
        <div className="lg:col-span-4 border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-6">Ecosystem Rank</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-xs text-[#5c7075] font-semibold">Reputation (REP)</span>
                <span className="text-xl font-extrabold text-[#006655]">12.4k</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-xs text-[#5c7075] font-semibold">Total Projects</span>
                <span className="text-xl font-extrabold text-[#091e22]">42</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-[#5c7075] font-semibold">Contributions</span>
                <span className="text-xl font-extrabold text-[#091e22]">1,890</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-6 border-t border-slate-50 mt-6">
            <span className="px-2 py-1 bg-[#006655]/10 text-[#006655] text-[10px] font-bold rounded">TOP</span>
            <span className="px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded">MVP</span>
            <span className="text-[10px] text-[#5c7075] font-semibold">Top 1% of Global Contributors</span>
          </div>
        </div>

        {/* Right Column: Technical Proficiency (takes 8 columns) */}
        <div className="lg:col-span-8 border border-slate-100 bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Technical Proficiency</h3>
            <span className="text-[#006655] text-xs font-bold flex items-center gap-1 bg-[#e6f7f8] px-2.5 py-1 rounded-lg">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verified
            </span>
          </div>

          {/* Skill progress bars grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>{member.skills[0] || 'Rust'}</span>
                <span className="text-slate-400">Lvl 9</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[#006655] h-full rounded-full w-[90%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>{member.skills[1] || 'TypeScript'}</span>
                <span className="text-slate-400">Lvl 8</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[#006655] h-full rounded-full w-[80%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>{member.skills[2] || 'Solidity'}</span>
                <span className="text-slate-400">Lvl 7</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[#006655] h-full rounded-full w-[70%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>{member.skills[3] || 'Kubernetes'}</span>
                <span className="text-slate-400">Lvl 6</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[#006655] h-full rounded-full w-[60%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Go</span>
                <span className="text-slate-400">Lvl 7</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[#006655] h-full rounded-full w-[70%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>GraphQL</span>
                <span className="text-slate-400">Lvl 8</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[#006655] h-full rounded-full w-[80%]"></div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-50">
            {member.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 bg-slate-50 border border-slate-150 text-[#5c7075] text-[10px] rounded font-semibold"
              >
                #{skill}
              </span>
            ))}
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-150 text-[#5c7075] text-[10px] rounded font-semibold">#distributed-systems</span>
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-150 text-[#5c7075] text-[10px] rounded font-semibold">#wasm</span>
            <span className="px-2.5 py-1 bg-slate-50 border border-slate-150 text-[#5c7075] text-[10px] rounded font-semibold">#zero-knowledge</span>
          </div>
        </div>
      </div>

      {/* 3. Contribution History Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Contribution History</h2>
          <a href="#contributions" className="text-[#006655] hover:underline text-xs font-semibold">View All Contributions</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="border border-slate-100 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow transition-shadow flex flex-col justify-between h-[300px]">
            <div>
              <div className="relative aspect-[16/9] w-full bg-slate-100 border-b border-slate-50">
                <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop" alt="Guild Protocol v2" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#e0f2f1] text-[#00695c] border border-[#00695c]/10 text-[9px] font-bold rounded">CORE ENGINE</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-sm mb-1 text-[#091e22]">Guild Protocol v2</h4>
                <p className="text-[11px] text-[#5c7075] leading-relaxed line-clamp-2">Lead developer for the decentralized identity module and auth system.</p>
              </div>
            </div>
            <div className="px-4 pb-4 flex justify-between items-center text-[10px] text-[#5c7075] font-semibold">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                2.4k
              </span>
              <span>Rust / WASM</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-slate-100 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow transition-shadow flex flex-col justify-between h-[300px]">
            <div>
              <div className="relative aspect-[16/9] w-full bg-slate-100 border-b border-slate-50">
                <img src="https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=400&h=225&fit=crop" alt="CodeFlow CLI" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#e8eaf6] text-[#283593] border border-[#9fa8da]/10 text-[9px] font-bold rounded">COMMUNITY</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-sm mb-1 text-[#091e22]">CodeFlow CLI</h4>
                <p className="text-[11px] text-[#5c7075] leading-relaxed line-clamp-2">Automated documentation generator for complex monorepo structures.</p>
              </div>
            </div>
            <div className="px-4 pb-4 flex justify-between items-center text-[10px] text-[#5c7075] font-semibold">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                840
              </span>
              <span>Go / Node.js</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-slate-100 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow transition-shadow flex flex-col justify-between h-[300px]">
            <div>
              <div className="relative aspect-[16/9] w-full bg-slate-100 border-b border-slate-50">
                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop" alt="Lumos UI Kit" className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#e0f7fa] text-[#00838f] border border-[#80deea]/10 text-[9px] font-bold rounded">EXPERIMENTAL</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-sm mb-1 text-[#091e22]">Lumos UI Kit</h4>
                <p className="text-[11px] text-[#5c7075] leading-relaxed line-clamp-2">A high-performance glassmorphic UI library for react-based dashboards.</p>
              </div>
            </div>
            <div className="px-4 pb-4 flex justify-between items-center text-[10px] text-[#5c7075] font-semibold">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                1.1k
              </span>
              <span>TypeScript</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bottom grid: Active Collaborations & Attending Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Active Collaborations */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Active Collaborations</h3>
          
          <div className="space-y-4">
            {/* Collab 1 */}
            <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#006655]/10 text-[#006655] font-bold rounded-xl flex items-center justify-center text-sm">
                  N
                </div>
                <div>
                  <h4 className="font-bold text-sm">Nebula Network</h4>
                  <p className="text-[10px] text-[#5c7075]">Infrastructure Audit &bull; Ongoing</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop" alt="" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop" alt="" />
                  </div>
                </div>
                <span className="text-[10px] text-[#5c7075] font-semibold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">+4</span>
              </div>
            </div>

            {/* Collab 2 */}
            <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#006655]/10 text-[#006655] font-bold rounded-xl flex items-center justify-center text-sm">
                  D
                </div>
                <div>
                  <h4 className="font-bold text-sm">DevDAO Core</h4>
                  <p className="text-[10px] text-[#5c7075]">Governance Strategy &bull; Final Review</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop" alt="" />
                  </div>
                </div>
                <span className="text-[10px] text-[#5c7075] font-semibold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">+1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Attending Events */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Attending Events</h3>
          
          <div className="space-y-4">
            {/* Event 1 */}
            <div className="flex items-center gap-4 p-4 border border-[#006655]/10 bg-[#006655]/[0.02] rounded-2xl">
              <div className="bg-[#e6f7f8] border border-[#006655]/10 text-[#006655] py-2 px-3 rounded-xl flex flex-col items-center justify-center w-14 shrink-0 select-none">
                <span className="text-[9px] uppercase font-bold tracking-wider">Oct</span>
                <span className="text-xl font-extrabold leading-none mt-0.5">24</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#091e22]">Guild Developer Summit 2024</h4>
                <p className="text-[10px] text-[#5c7075] mt-0.5">Keynote Speaker: "The Future of WASM"</p>
                <p className="text-[9px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  San Francisco, Digital Arts Center
                </p>
              </div>
            </div>

            {/* Event 2 */}
            <div className="flex items-center gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-2xl">
              <div className="bg-[#e6f7f8] border border-[#006655]/10 text-[#006655] py-2 px-3 rounded-xl flex flex-col items-center justify-center w-14 shrink-0 select-none">
                <span className="text-[9px] uppercase font-bold tracking-wider">Nov</span>
                <span className="text-xl font-extrabold leading-none mt-0.5">08</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#091e22]">Rust Berlin Meetup</h4>
                <p className="text-[10px] text-[#5c7075] mt-0.5">Panel Discussion on Safety Systems</p>
                <p className="text-[9px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Virtual Session
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default MemberProfile;
