import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

interface ProjectType {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: 'Web' | 'Mobile' | 'Design' | 'AI';
  techStack: string[];
  coverImage: string;
  byUser: {
    _id: string;
    fullName: string;
    profilePicture?: string;
  };
  likes: string[];
  views: number;
  status: string;
  isVisible: boolean;
  createdAt: string;
}

export const ProjectShowcase: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Popular'); // 'Popular' or 'Newest'
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const handleLikeProject = async (projectId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setProjects((prevProjects) =>
          prevProjects.map((p) => {
            if (p._id === projectId) {
              const currentLikes: string[] = p.likes || [];
              const userLiked = currentLikes.some((id: any) => id.toString() === user._id);
              let updatedLikes = [...currentLikes];
              if (data.isLiked && !userLiked) {
                updatedLikes.push(user._id);
              } else if (!data.isLiked && userLiked) {
                updatedLikes = updatedLikes.filter((id: any) => id.toString() !== user._id);
              }
              return { ...p, likes: updatedLikes };
            }
            return p;
          })
        );
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data.data);
          setFilteredProjects(data.data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Run filters
  useEffect(() => {
    let result = [...projects];

    // 1. Search Query filter (Title, Description, or Author Name)
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          (p.byUser && p.byUser.fullName.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 3. Tech Stack Filter
    if (selectedTech !== 'All') {
      result = result.filter((p) => p.techStack.includes(selectedTech));
    }

    // 4. Sorting logic
    if (sortBy === 'Popular') {
      // Sort by likes count, then by views
      result.sort((a, b) => b.likes.length - a.likes.length || b.views - a.views);
    } else if (sortBy === 'Newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredProjects(result);
    setCurrentPage(1);
  }, [search, selectedTech, selectedCategory, sortBy, projects]);

  // Extract unique tech tags for filter dropdown
  const allAvailableTech = Array.from(new Set(projects.flatMap((p) => p.techStack))).sort();

  // Pagination calculation
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
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
      {/* Page Title & Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          Explore Member <span className="text-[#006655]">Projects</span>
        </h1>
        <p className="text-[#5c7075] text-base max-w-2xl leading-relaxed">
          Discover innovative tools, open-source gems, and experimental prototypes built by the world's most talented developer guild.
        </p>
      </div>

      {/* Filter Bar Panel */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, tech, or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
          />
        </div>

        {/* Tech Stack filter */}
        <div className="md:col-span-2">
          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
          >
            <option value="All">All Stacks</option>
            {allAvailableTech.map((tech) => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
        </div>

        {/* Category filter */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
          >
            <option value="All">All Categories</option>
            <option value="Web">Web App</option>
            <option value="Mobile">Mobile App</option>
            <option value="Design">Design UI</option>
            <option value="AI">AI / ML</option>
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="md:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
          >
            <option value="Popular">Most Popular</option>
            <option value="Newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Grid of Projects */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs text-[#5c7075] font-semibold">Loading showcase...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-2xl p-16 text-center bg-white shadow-sm flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006655] flex items-center justify-center mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.605 15.12a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h3 className="font-bold text-base mb-1">No projects found</h3>
          <p className="text-xs text-[#5c7075]">Try adjusting your search queries or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProjects.map((project) => (
            <div
              key={project._id}
              className="border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[440px] h-[450px]"
            >
              <div>
                {/* Project Cover Image */}
                <Link to={`/projects/${project._id}`} className="block relative aspect-[16/9] w-full bg-slate-100 border-b border-slate-50 select-none overflow-hidden group">
                  <img
                    src={project.coverImage || 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=600&h=337&fit=crop'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Category Tag */}
                  <span className="absolute top-4 right-4 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold rounded-lg shadow-sm">
                    {project.category === 'AI' ? 'AI / ML' : project.category === 'Design' ? 'UI / Design' : `${project.category} App`}
                  </span>
                </Link>

                {/* Info Container */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <Link to={`/projects/${project._id}`} className="hover:underline flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-[#091e22] line-clamp-1 hover:text-[#006655] transition-colors">{project.title}</h3>
                    </Link>
                  </div>
                  <p className="text-xs text-[#5c7075] leading-relaxed line-clamp-3 mb-5 min-h-[54px]">
                    {project.shortDescription || project.description || 'A custom showcase project created by the talented Guild Code developers.'}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 min-h-[32px] content-start">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 bg-slate-50 border border-slate-150 text-[10px] text-slate-600 rounded-lg font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Owner Footer row */}
              <div className="px-6 pb-6 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-[#5c7075] select-none">
                {/* Author Info */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-slate-100 rounded-full overflow-hidden shrink-0">
                    {project.byUser && project.byUser.profilePicture ? (
                      <img src={project.byUser.profilePicture} alt={project.byUser.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#006655]/10 flex items-center justify-center font-bold text-[#006655] text-[9px]">
                        {project.byUser ? project.byUser.fullName.charAt(0).toUpperCase() : 'G'}
                      </div>
                    )}
                  </div>
                  <span className="font-semibold text-xs truncate max-w-[100px]">{project.byUser ? project.byUser.fullName : 'Guild Member'}</span>
                </div>

                {/* Engagement CTAs */}
                <div className="flex items-center gap-3">
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-[#006655] hover:text-[#004d40] font-bold text-xs hover:underline flex items-center gap-0.5 mr-1"
                    title="View project details"
                  >
                    <span>View</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleLikeProject(project._id);
                    }}
                    className={`flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                      user && (project.likes || []).some((id: any) => id.toString() === user._id)
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-slate-50 border-slate-100 text-slate-500 hover:text-rose-500 hover:bg-rose-50'
                    }`}
                    title={
                      user && (project.likes || []).some((id: any) => id.toString() === user._id)
                        ? 'Unlike project'
                        : 'Like project'
                    }
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span>{project.likes ? project.likes.length : 0}</span>
                  </button>
                  <span className="flex items-center gap-1 text-slate-400 text-xs">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {project.views || 0}
                  </span>
                </div>
              </div>

            </div>
          ))}
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
export default ProjectShowcase;
