import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface ProjectType {
  _id: string;
  title: string;
  shortDescription: string;
  category: string;
  techStack: string[];
  coverImage: string;
  status: string;
  updatedAt: string;
}

export const MyProjects: React.FC = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const res = await fetch('/api/projects/my');
        if (res.ok) {
          const data = await res.json();
          setProjects(data.data);
          setFilteredProjects(data.data);
        }
      } catch (err) {
        console.error('Error fetching my projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProjects();
  }, []);

  // Filter local search list
  useEffect(() => {
    if (!search.trim()) {
      setFilteredProjects(projects);
      return;
    }
    const q = search.toLowerCase();
    const result = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q))
    );
    setFilteredProjects(result);
  }, [search, projects]);

  const getTimeElapsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Updated just now';
    if (diffHours < 24) return `Updated ${diffHours}h ago`;
    return `Updated ${Math.floor(diffHours / 24)}d ago`;
  };

  const getStatusStyle = (status: string) => {
    if (status === 'completed') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    return 'bg-amber-50 text-amber-600 border-amber-100';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-[#5c7075] font-semibold">Loading your projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">My Projects</h1>
          <p className="text-xs text-[#5c7075]">Manage and monitor your ongoing development initiatives.</p>
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
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Grid listing */}
      {projects.length === 0 ? (
        // Empty State (mocking designs/myProjects-emptyState.png layout)
        <div className="border border-dashed border-slate-200 rounded-3xl p-16 text-center bg-white shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-emerald-50 text-[#006655] border border-emerald-100 rounded-full flex items-center justify-center mb-4 select-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 className="font-extrabold text-base mb-1">New Project</h3>
          <p className="text-xs text-[#5c7075] max-w-xs mb-6">Start building your next big idea. Upload screenshots, wireframes, and documentation.</p>
          <Link
            to="/dashboard/projects/new"
            className="bg-[#006655] hover:bg-[#004d40] text-white py-2.5 px-6 rounded-xl font-bold text-xs transition-colors shadow-sm"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="border border-slate-100 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow transition-shadow flex flex-col justify-between h-[340px]"
            >
              <div>
                {/* Image & status */}
                <div className="relative aspect-[16/10] bg-slate-50 border-b border-slate-50 select-none">
                  <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                  <span className={`absolute top-4 left-4 px-2.5 py-0.5 border text-[9px] font-bold rounded-lg ${getStatusStyle(project.status)} shadow-sm`}>
                    {project.status === 'completed' ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm text-[#091e22] line-clamp-1">{project.title}</h4>
                    {/* Action dropdown edit/delete button */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 select-none">
                      <Link to={`/dashboard/projects/edit/${project._id}`} className="hover:text-[#006655]" title="Edit project">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                  <p className="text-xs text-[#5c7075] leading-relaxed line-clamp-2 h-8 mb-4">
                    {project.shortDescription}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1 h-12 overflow-hidden content-start select-none">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 bg-slate-50 border border-slate-150 text-[9px] text-slate-500 rounded font-semibold">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer timeline */}
              <div className="px-5 pb-5 pt-3 border-t border-slate-50 text-[9px] font-semibold text-slate-400 select-none flex items-center justify-between">
                <span>{getTimeElapsed(project.updatedAt)}</span>
                <span className="text-[10px] uppercase font-bold text-slate-350">{project.category}</span>
              </div>

            </div>
          ))}

          {/* Plus Add project card */}
          <Link
            to="/dashboard/projects/new"
            className="border-2 border-dashed border-slate-200 hover:border-[#006655] rounded-3xl p-6 bg-slate-50/20 text-center flex flex-col items-center justify-center h-[340px] transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl font-bold text-[#006655] mb-4 select-none">
              +
            </div>
            <h4 className="font-bold text-sm text-[#091e22] mb-1">New Project</h4>
            <p className="text-[10px] text-[#5c7075]">Start building your next big idea</p>
          </Link>
        </div>
      )}

    </div>
  );
};
export default MyProjects;
