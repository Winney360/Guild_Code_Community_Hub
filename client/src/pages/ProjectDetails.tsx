import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  links?: {
    liveDemo?: string;
    github?: string;
    figma?: string;
    notebook?: string;
  };
  status: string;
  isVisible: boolean;
  createdAt: string;
}

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.data);
          const likesList = data.data.likes || [];
          setLikesCount(likesList.length);
          if (user) {
            const liked = likesList.some(
              (l: any) => (typeof l === 'string' ? l : l._id || l.toString()) === user._id
            );
            setIsLiked(liked);
          }
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
        if (project) {
          let updatedLikes = [...(project.likes || [])];
          if (data.isLiked && !updatedLikes.includes(user._id)) {
            updatedLikes.push(user._id);
          } else if (!data.isLiked) {
            updatedLikes = updatedLikes.filter(
              (l: any) => (typeof l === 'string' ? l : l._id || l.toString()) !== user._id
            );
          }
          setProject({ ...project, likes: updatedLikes });
        }
      }
    } catch (err) {
      console.error('Error liking project:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-[#5c7075] font-semibold">Loading project...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 border border-dashed border-slate-200 rounded-2xl text-center bg-white shadow-sm flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006655] flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="font-bold text-base mb-1">Project not found</h3>
        <p className="text-xs text-[#5c7075] mb-6">The project you are looking for does not exist or has been hidden.</p>
        <Link to="/projects" className="bg-[#006655] hover:bg-[#004d40] text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-sm">
          Return to Showcase
        </Link>
      </div>
    );
  }

  // Format date
  const formatPublishDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Published ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-[#091e22]">
      {/* 1. Header Information Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 select-none">
        <div>
          <div className="flex items-center gap-3 mb-3 text-xs font-bold">
            <span className="px-2.5 py-1 bg-[#e6f7f8] text-[#006655] rounded-lg">
              {project.category === 'AI' ? 'AI & Machine Learning' : project.category === 'Design' ? 'UI/UX Design' : `${project.category} Infrastructure`}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-[#5c7075]">{formatPublishDate(project.createdAt)}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            {project.title}
          </h1>
          <p className="text-[#5c7075] text-base md:text-lg max-w-3xl leading-relaxed">
            {project.shortDescription || 'A revolutionary computing framework designed for real-time distributed tracing and zero-config edge scaling.'}
          </p>
        </div>

        {/* Action CTA Buttons */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
          <a
            href={project.links?.liveDemo || '#live-demo'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Live Demo
          </a>
          <a
            href={project.links?.github || '#github'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-[#006655] hover:bg-[#004d40] text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            View GitHub
          </a>
        </div>
      </div>

      {/* 2. Large Cover Image */}
      <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm mb-12 select-none">
        <img
          src={project.coverImage || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=514&fit=crop'}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 3. Main Split Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: About & Spec Details (takes 8 columns) */}
        <div className="lg:col-span-8">
          <section className="mb-10">
            <h3 className="font-extrabold text-xl mb-4">About the Project</h3>
            <div className="text-sm text-[#5c7075] leading-relaxed whitespace-pre-line bg-slate-50/50 p-6 rounded-2xl border border-slate-100/80">
              {project.description && project.description.trim() !== '' ? (
                project.description
              ) : (
                project.shortDescription || 'No detailed description provided for this project.'
              )}
            </div>
          </section>

          {/* Key Features Boxes */}
          <section className="mb-10">
            <h4 className="font-bold text-sm text-[#5c7075] uppercase tracking-wider mb-4">Key Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 border border-slate-100 bg-slate-50/30 rounded-2xl flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-[#e6f7f8] text-[#006655] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-xs mb-1">Sub-ms Latency</h5>
                  <p className="text-[11px] text-[#5c7075] leading-relaxed">Optimized engine core for high-speed execution.</p>
                </div>
              </div>

              <div className="p-5 border border-slate-100 bg-slate-50/30 rounded-2xl flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-[#e6f7f8] text-[#006655] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-xs mb-1">End-to-End Encryption</h5>
                  <p className="text-[11px] text-[#5c7075] leading-relaxed">Secure computation pathways for private data.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Stack Tags */}
          <section className="mb-10">
            <h4 className="font-bold text-sm text-[#5c7075] uppercase tracking-wider mb-4">Technology Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-700 text-xs font-semibold rounded-xl shadow-sm transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>

          {/* Gallery screenshots mockup */}
          <section>
            <h4 className="font-bold text-sm text-[#5c7075] uppercase tracking-wider mb-4">Gallery</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop" alt="Code Screenshot" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=300&fit=crop" alt="UI Screenshot" className="w-full h-full object-cover" />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Author Card & Engagement Card (takes 4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Author/Creator Card */}
          <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full overflow-hidden mb-4 shrink-0 border border-slate-100">
              {project.byUser && project.byUser.profilePicture ? (
                <img src={project.byUser.profilePicture} alt={project.byUser.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#006655]/10 flex items-center justify-center font-bold text-[#006655] text-xl">
                  {project.byUser ? project.byUser.fullName.charAt(0).toUpperCase() : 'G'}
                </div>
              )}
            </div>

            <h4 className="font-extrabold text-base mb-1">{project.byUser ? project.byUser.fullName : 'Guild Member'}</h4>
            <p className="text-xs text-[#5c7075] font-semibold mb-6">Guild Member &bull; Premium Tier</p>

            <Link
              to={project.byUser ? `/members/${project.byUser._id}` : '#'}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition-colors shadow-sm mb-6"
            >
              View Profile
            </Link>

            <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-slate-50 text-xs font-semibold">
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-[10px] uppercase font-bold mb-1">Followers</span>
                <span className="text-base font-extrabold text-[#091e22]">1,284</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-slate-400 text-[10px] uppercase font-bold mb-1">Projects</span>
                <span className="text-base font-extrabold text-[#091e22]">14</span>
              </div>
            </div>
          </div>

          {/* Project Engagement Stats Card */}
          <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-sm mb-4">Project Engagement</h4>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-xs font-semibold py-1.5 border-b border-slate-50">
                <span className="text-[#5c7075]">Likes</span>
                <span className="text-[#091e22]">{likesCount}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold py-1.5 border-b border-slate-50">
                <span className="text-[#5c7075]">Views</span>
                <span className="text-[#091e22]">{project.views}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold py-1.5">
                <span className="text-[#5c7075]">Shares</span>
                <span className="text-[#091e22]">89</span>
              </div>
            </div>

            <button
              onClick={handleLike}
              className={`w-full font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                isLiked
                  ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'
                  : 'bg-[#006655] hover:bg-[#004d40] text-white'
              }`}
            >
              <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isLiked ? 'Liked Project' : 'Like Project'}
            </button>
          </div>

          {/* Design Assets Card */}
          <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-sm mb-4">Design Assets</h4>
            <a
              href={project.links?.figma || '#figma'}
              target="_blank"
              rel="noreferrer"
              className="p-4 border border-slate-150 bg-slate-50/20 rounded-2xl flex items-center gap-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h5 className="font-bold text-xs mb-0.5">Figma File</h5>
                <p className="text-[10px] text-[#5c7075]">Design System & Screens</p>
              </div>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
export default ProjectDetails;
