import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Developers' | 'Designers' | 'Data & AI'>('All');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

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

  // Safe helper to extract specializations as a string array
  const getMemberSpecs = (m: Member): string[] => {
    if (!m.specializations) return [];
    if (Array.isArray(m.specializations)) return m.specializations.filter(Boolean);
    if (typeof m.specializations === 'string') {
      return (m.specializations as string).split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  // Safe helper to extract skills as a string array
  const getMemberSkills = (m: Member): string[] => {
    if (!m.skills) return [];
    if (Array.isArray(m.skills)) return m.skills.filter(Boolean);
    if (typeof m.skills === 'string') {
      return (m.skills as string).split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  // Filter application
  useEffect(() => {
    let result = members;

    // 1. Search Query filter (Name, Email, Bio, Location, Role, Specializations, Skills)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) => {
        const specs = getMemberSpecs(m);
        const skills = getMemberSkills(m);
        return (
          m.fullName.toLowerCase().includes(q) ||
          (m.email && m.email.toLowerCase().includes(q)) ||
          (m.bio && m.bio.toLowerCase().includes(q)) ||
          (m.location && m.location.toLowerCase().includes(q)) ||
          (m.role && m.role.toLowerCase().includes(q)) ||
          specs.some((s) => s.toLowerCase().includes(q)) ||
          skills.some((sk) => sk.toLowerCase().includes(q))
        );
      });
    }

    // 2. Category Tab Filter (Developers, Designers, Data & AI)
    if (selectedCategory !== 'All') {
      result = result.filter((m) => {
        const specs = getMemberSpecs(m);
        if (specs.length === 0) return false;
        return specs.some((spec) => {
          const specLower = spec.toLowerCase();
          if (selectedCategory === 'Developers') {
            return (
              developersSpecs.some((d) => d.toLowerCase() === specLower) ||
              specLower.includes('developer') ||
              specLower.includes('engineer') ||
              specLower.includes('frontend') ||
              specLower.includes('backend') ||
              specLower.includes('full') ||
              specLower.includes('mobile') ||
              specLower.includes('devops') ||
              specLower.includes('cloud') ||
              specLower.includes('software') ||
              specLower.includes('architect')
            );
          }
          if (selectedCategory === 'Designers') {
            return (
              designersSpecs.some((d) => d.toLowerCase() === specLower) ||
              specLower.includes('design') ||
              specLower.includes('ui') ||
              specLower.includes('ux') ||
              specLower.includes('graphic') ||
              specLower.includes('motion') ||
              specLower.includes('art')
            );
          }
          if (selectedCategory === 'Data & AI') {
            return (
              dataAiSpecs.some((d) => d.toLowerCase() === specLower) ||
              specLower.includes('data') ||
              specLower.includes('ai') ||
              specLower.includes('intelligence') ||
              specLower.includes('machine learning') ||
              specLower.includes('analyst') ||
              specLower.includes('nlp') ||
              specLower.includes('vision')
            );
          }
          return false;
        });
      });
    }

    // 3. Dropdown Specialization Filter
    if (selectedSpecialization !== 'All') {
      result = result.filter((m) => {
        const specs = getMemberSpecs(m);
        return specs.includes(selectedSpecialization);
      });
    }

    // 4. Dropdown Skill Filter
    if (selectedSkill !== 'All') {
      result = result.filter((m) => {
        const skills = getMemberSkills(m);
        return skills.includes(selectedSkill);
      });
    }

    setFilteredMembers(result);
    setCurrentPage(1);
  }, [search, selectedCategory, selectedSpecialization, selectedSkill, members]);

  // Extract unique skills and specializations for filter dropdowns safely
  const allAvailableSkills = Array.from(
    new Set(members.flatMap((m) => getMemberSkills(m)))
  ).sort();

  const allAvailableSpecs = Array.from(
    new Set(members.flatMap((m) => getMemberSpecs(m)))
  ).sort();

  // Helper to format join date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Joined Recently';
    const date = new Date(dateString);
    return `JOINED ${date.toLocaleString('default', { month: 'short' }).toUpperCase()} ${date.getFullYear()}`;
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-[#091e22]">
      {/* Header Title */}
      <div className="mb-10 text-center flex flex-col items-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Member Directory</h1>
        <p className="text-[#5c7075] text-base max-w-2xl leading-relaxed text-center">
          Discover and connect with the world's most talented developers contributing to the Guild Code ecosystem.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
        {(['All', 'Developers', 'Designers', 'Data & AI'] as const).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              selectedCategory === category
                ? 'border-[#006655] text-[#006655]'
                : 'border-transparent text-[#5c7075] hover:text-[#091e22]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-2xl p-6 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, role, specialization, skill, or bio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
          />
        </div>

        {/* Specialization Filter */}
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

        {/* Skill Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
          >
            <option value="All">All Skills</option>
            {allAvailableSkills.map((sk) => (
              <option key={sk} value={sk}>{sk}</option>
            ))}
          </select>
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
        <div className="border border-dashed border-slate-200 rounded-2xl p-16 text-center bg-white shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006655] flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="font-bold text-base mb-1">No members found</h3>
          <p className="text-xs text-[#5c7075] mb-4">Try refining your search query or filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedSpecialization('All');
              setSelectedSkill('All');
            }}
            className="bg-[#006655] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedMembers.map((member) => {
            const specs = getMemberSpecs(member);
            const skills = getMemberSkills(member);
            return (
              <div
                key={member._id}
                onClick={() => navigate(`/members/${member._id}`)}
                className="border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-3xl p-6 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Top bar: Avatar */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm shrink-0">
                      {member.profilePicture ? (
                        <img src={member.profilePicture} alt={member.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#006655]/10 flex items-center justify-center font-bold text-[#006655] text-lg">
                          {member.fullName ? member.fullName.charAt(0).toUpperCase() : 'G'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name + Role */}
                  <h3 className="font-bold text-base text-[#091e22] group-hover:text-[#006655] transition-colors">{member.fullName}</h3>
                  <p className="text-xs font-semibold text-[#006655] mb-2">{specs[0] || 'Guild Member'}</p>
                  <p className="text-xs text-[#5c7075] line-clamp-2 leading-relaxed mb-4">
                    {member.bio || 'Guild member contributing to open-source developer tooling and scalable backend architecture.'}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-50 border border-slate-150 text-[10px] text-slate-500 rounded font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer details */}
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-[#5c7075] select-none">
                  {/* Links / Stats */}
                  <div className="flex items-center gap-3">
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-[#091e22]">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="hover:text-[#091e22]">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                      </a>
                    )}
                    <span className="font-semibold">{member.projectCount || 0} Projects</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center text-[9px] font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {member.location || 'Remote'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-12 select-none">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            &lt;
          </button>
          {getPageNumbers().map((page, idx) =>
            typeof page === 'number' ? (
              <button
                key={idx}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#006655] text-white'
                    : 'border border-slate-200 hover:bg-slate-50 text-[#5c7075]'
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={idx} className="text-slate-400 text-xs px-1">
                ...
              </span>
            )
          )}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};
export default MembersDirectory;
