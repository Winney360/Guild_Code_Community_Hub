import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  projectCount?: number;
}

export const MembersDirectory: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Developers' | 'Designers' | 'Data & AI'>('All');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');

  // Categories definitions from Spec 4.4
  const developersSpecs = [
    'Frontend Developer', 'Backend Developer', 'Full-Stack Developer', 'Mobile App Developer',
    'DevOps Engineer', 'Cloud Engineer', 'API Developer', 'Software Engineer',
    'AI / Machine Learning Engineer', 'Cybersecurity Engineer', 'Game Developer'
  ];

  const designersSpecs = [
    'UI/UX Designer', 'Product Designer', 'Graphic Designer', 'Motion Designer',
    'Interaction Designer', 'Brand Designer', 'Visual Designer'
  ];

  const dataAiSpecs = [
    'Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'Deep Learning Engineer',
    'AI Researcher', 'Business Intelligence Analyst', 'Data Engineer', 'NLP Engineer', 'Computer Vision Engineer'
  ];

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch('/api/users');
        if (res.ok) {
          const data = await res.json();
          setMembers(data.data);
          setFilteredMembers(data.data);
        }
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Filter application
  useEffect(() => {
    let result = members;

    // 1. Search Query filter (Name, Bio, Location)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.fullName.toLowerCase().includes(q) ||
          (m.bio && m.bio.toLowerCase().includes(q)) ||
          (m.location && m.location.toLowerCase().includes(q))
      );
    }

    // 2. Category Tab Filter (Developers, Designers, Data & AI)
    if (selectedCategory !== 'All') {
      result = result.filter((m) => {
        const hasSpec = m.specializations.some((spec) => {
          if (selectedCategory === 'Developers') return developersSpecs.includes(spec);
          if (selectedCategory === 'Designers') return designersSpecs.includes(spec);
          if (selectedCategory === 'Data & AI') return dataAiSpecs.includes(spec);
          return false;
        });
        return hasSpec;
      });
    }

    // 3. Dropdown Specialization Filter
    if (selectedSpecialization !== 'All') {
      result = result.filter((m) => m.specializations.includes(selectedSpecialization));
    }

    // 4. Dropdown Skill Filter
    if (selectedSkill !== 'All') {
      result = result.filter((m) => m.skills.includes(selectedSkill));
    }

    setFilteredMembers(result);
  }, [search, selectedCategory, selectedSpecialization, selectedSkill, members]);

  // Extract unique skills and specializations for filters dropdown
  const allAvailableSkills = Array.from(new Set(members.flatMap((m) => m.skills))).sort();
  const allAvailableSpecs = Array.from(new Set(members.flatMap((m) => m.specializations))).sort();

  // Helper to format join date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Joined Recently';
    const date = new Date(dateString);
    return `JOINED ${date.toLocaleString('default', { month: 'short' }).toUpperCase()} ${date.getFullYear()}`;
  };

  // Helper to choose status badge styling
  const getBadgeStyle = (index: number) => {
    const styles = [
      { bg: 'bg-[#e8f5e9] text-[#2e7d32] border-[#a5d6a7]/20', label: 'Available' },
      { bg: 'bg-[#e0f2f1] text-[#00695c] border-[#80cbc4]/20', label: 'Core Member' },
      { bg: 'bg-[#e0f7fa] text-[#00838f] border-[#80deea]/20', label: 'Pro' },
      { bg: 'bg-[#fff3e0] text-[#ef6c00] border-[#ffcc80]/20', label: 'Busy' },
      { bg: 'bg-[#e8eaf6] text-[#283593] border-[#9fa8da]/20', label: 'Hiring' }
    ];
    return styles[index % styles.length];
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-[#091e22]">
      {/* Header Title */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Member Directory</h1>
        <p className="text-[#5c7075] text-base max-w-2xl leading-relaxed">
          Discover and connect with the world's most talented developers contributing to the Guild Code ecosystem.
        </p>
      </div>

      {/* Filter Bar Panel */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-8 flex flex-col gap-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
          {(['All', 'Developers', 'Designers', 'Data & AI'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSpecialization('All'); // Reset subspec on category change
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#006655] text-white shadow-sm'
                  : 'bg-slate-50 border border-slate-150 text-[#5c7075] hover:bg-slate-100'
              }`}
            >
              {cat === 'All' ? 'All Members' : cat}
            </button>
          ))}
        </div>

        {/* Inputs & Dropdowns Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search box */}
          <div className="md:col-span-6 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name, bio, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
            />
          </div>

          {/* Specializations Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
            >
              <option value="All">All Specializations</option>
              {allAvailableSpecs.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Skills Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
            >
              <option value="All">All Skills</option>
              {allAvailableSkills.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Member Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs text-[#5c7075] font-semibold">Loading members...</span>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl p-16 text-center bg-white shadow-sm">
          <span className="text-4xl block mb-4">👥</span>
          <h3 className="font-bold text-base mb-1">No members found</h3>
          <p className="text-xs text-[#5c7075]">Try refining your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, idx) => {
            const badge = getBadgeStyle(idx);
            return (
              <div
                key={member._id}
                className="border border-slate-100 rounded-3xl p-6 bg-white shadow-sm hover:shadow transition-shadow flex flex-col justify-between h-[310px]"
              >
                <div>
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden shrink-0 border border-slate-50">
                        {member.profilePicture ? (
                          <img
                            src={member.profilePicture}
                            alt={member.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#006655]/10 flex items-center justify-center text-sm font-bold text-[#006655]">
                            {member.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <Link to={`/members/${member._id}`}>
                          <h4 className="font-bold text-base line-clamp-1 hover:text-[#006655] transition-colors">{member.fullName}</h4>
                        </Link>
                        <p className="text-xs text-[#5c7075] line-clamp-1">
                          {member.specializations.join(', ') || 'Developer'}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2 py-0.5 border text-[9px] font-bold rounded-full ${badge.bg} shrink-0`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-[#5c7075] leading-relaxed line-clamp-3 mb-4 h-15">
                    {member.bio || 'No description provided by the member yet.'}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4 h-14 overflow-hidden content-start">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-slate-50 border border-slate-150 text-[10px] text-slate-500 rounded font-semibold"
                      >
                        #{skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between border-t border-slate-50 pt-4 text-[10px] text-[#5c7075] select-none">
                  {/* Links */}
                  <div className="flex items-center gap-3 shrink-0">
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noreferrer" className="hover:text-[#091e22]">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" /></svg>
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#091e22]">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      </a>
                    )}
                    <span className="font-semibold">{member.projectCount || 0} Projects</span>
                  </div>

                  {/* Location & Date */}
                  <div className="flex flex-col items-end gap-0.5 text-[9px] font-bold text-slate-400">
                    <span>📍 {member.location || 'Remote'}</span>
                    <span>{formatDate(member.joinDate)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && filteredMembers.length > 0 && (
        <div className="flex justify-center items-center gap-1.5 mt-12 select-none">
          <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors">
            &lt;
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-[#006655] text-white rounded-lg text-xs font-bold">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-slate-200 hover:bg-slate-50 rounded-lg text-xs text-[#5c7075] transition-colors">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-slate-200 hover:bg-slate-50 rounded-lg text-xs text-[#5c7075] transition-colors">
            3
          </button>
          <span className="text-slate-400 text-xs px-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors">
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};
export default MembersDirectory;
