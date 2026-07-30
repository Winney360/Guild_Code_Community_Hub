import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

interface ProjectType {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: 'Web' | 'Mobile' | 'Design' | 'AI' | 'Cloud Infrastructure';
  techStack: string[];
  coverImage: string;
  byUser: {
    _id: string;
    fullName: string;
    profilePicture?: string;
    role?: string;
    bio?: string;
    github?: string;
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

  const formatPublishDate = (dateString: string) => {
    const date = new Date(dateString);
    return `Published ${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const hasAnyLink = !!(
    project.links?.liveDemo ||
    project.links?.github ||
    project.links?.figma ||
    project.links?.notebook
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-[#091e22]">
      {/* 1. Header Information Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 select-none">
        <div>
          <div className="flex items-center gap-3 mb-3 text-xs font-bold">
            <span className="px-2.5 py-1 bg-[#e6f7f8] text-[#006655] rounded-lg">
              {project.category === 'AI' ? 'AI & Machine Learning' : project.category === 'Design' ? 'UI/UX Design' : project.category === 'Cloud Infrastructure' ? 'Cloud Infrastructure' : `${project.category} App`}
            </span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-[#5c7075]">{formatPublishDate(project.createdAt)}</span>
            <span className="text-slate-400">&bull;</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${project.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
              {project.status === 'completed' ? 'Published' : 'In Progress'}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            {project.title}
          </h1>
          {project.shortDescription && (
            <p className="text-[#5c7075] text-base md:text-lg max-w-3xl leading-relaxed">
              {project.shortDescription}
            </p>
          )}
        </div>

        {/* Action CTA Buttons (Only render real links) */}
        {hasAnyLink && (
          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-end">
            {project.links?.liveDemo && (
              <a
                href={project.links.liveDemo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm text-xs"
              >
                <svg className="w-4 h-4 text-[#006655]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Live Demo
              </a>
            )}
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-[#006655] hover:bg-[#004d40] text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm text-xs"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub Repo
              </a>
            )}
            {project.links?.figma && (
              <a
                href={project.links.figma}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-700 font-bold py-2.5 px-5 rounded-xl transition-all text-xs"
              >
                Figma File
              </a>
            )}
            {project.links?.notebook && (
              <a
                href={project.links.notebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold py-2.5 px-5 rounded-xl transition-all text-xs"
              >
                Data Notebook
              </a>
            )}
          </div>
        )}
      </div>

      {/* 2. Cover Image */}
      {project.coverImage && (
        <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm mb-12 select-none">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 3. Main Split Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: About & Tech Details */}
        <div className="lg:col-span-8 space-y-10">
          <section>
            <h3 className="font-extrabold text-xl mb-4">About the Project</h3>
            <div className="text-sm text-[#5c7075] leading-relaxed whitespace-pre-line bg-slate-50/50 p-6 rounded-2xl border border-slate-100/80">
              {project.description && project.description.trim() !== '' ? (
                project.description
              ) : (
                project.shortDescription || 'No detailed description provided for this project.'
              )}
            </div>
          </section>

          {/* Technology Stack Tags */}
          {project.techStack && project.techStack.length > 0 && (
            <section>
              <h4 className="font-bold text-sm text-[#5c7075] uppercase tracking-wider mb-4">Technology Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Project Resources & External Links */}
          {hasAnyLink && (
            <section>
              <h4 className="font-bold text-sm text-[#5c7075] uppercase tracking-wider mb-4">Project Resources & Links</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.links?.liveDemo && (
                  <a
                    href={project.links.liveDemo}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 border border-slate-150 bg-slate-50/30 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#006655] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs mb-0.5 truncate">Live Application Demo</h5>
                      <p className="text-[10px] text-[#5c7075] truncate">{project.links.liveDemo}</p>
                    </div>
                  </a>
                )}
                {project.links?.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 border border-slate-150 bg-slate-50/30 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs mb-0.5 truncate">Source Code Repository</h5>
                      <p className="text-[10px] text-[#5c7075] truncate">{project.links.github}</p>
                    </div>
                  </a>
                )}
                {project.links?.figma && (
                  <a
                    href={project.links.figma}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 border border-slate-150 bg-slate-50/30 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs mb-0.5 truncate">Figma Design System</h5>
                      <p className="text-[10px] text-[#5c7075] truncate">{project.links.figma}</p>
                    </div>
                  </a>
                )}
                {project.links?.notebook && (
                  <a
                    href={project.links.notebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 border border-slate-150 bg-slate-50/30 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-xs mb-0.5 truncate">Data / Colab Notebook</h5>
                      <p className="text-[10px] text-[#5c7075] truncate">{project.links.notebook}</p>
                    </div>
                  </a>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Author Card & Engagement Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Author/Creator Card */}
          {(() => {
            const creatorId =
              typeof project.byUser === 'object' && project.byUser ? project.byUser._id : project.byUser;
            const creatorName =
              typeof project.byUser === 'object' && project.byUser ? project.byUser.fullName : 'Guild Member';
            const creatorPic =
              typeof project.byUser === 'object' && project.byUser ? project.byUser.profilePicture : undefined;
            const creatorRole =
              typeof project.byUser === 'object' && project.byUser ? project.byUser.role : undefined;

            return (
              <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
                <Link
                  to={creatorId ? `/members/${creatorId}` : '#'}
                  className="w-16 h-16 bg-slate-100 rounded-full overflow-hidden mb-4 shrink-0 border border-slate-100 block hover:scale-105 transition-transform"
                  title={`View ${creatorName}'s profile`}
                >
                  {creatorPic ? (
                    <img src={creatorPic} alt={creatorName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#006655]/10 flex items-center justify-center font-bold text-[#006655] text-xl">
                      {creatorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>

                <Link
                  to={creatorId ? `/members/${creatorId}` : '#'}
                  className="hover:underline mb-1"
                >
                  <h4 className="font-extrabold text-base text-[#091e22] hover:text-[#006655] transition-colors">
                    {creatorName}
                  </h4>
                </Link>

                <p className="text-xs text-[#5c7075] font-semibold mb-6">
                  {creatorRole === 'admin' ? 'Community Admin' : 'Guild Builder'}
                </p>

                {creatorId ? (
                  <Link
                    to={`/members/${creatorId}`}
                    className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm block text-center"
                  >
                    View Creator Profile
                  </Link>
                ) : (
                  <span className="text-xs text-slate-400">Profile Unavailable</span>
                )}
              </div>
            );
          })()}

          {/* Project Engagement Stats Card */}
          <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm">
            <h4 className="font-bold text-sm mb-4">Project Analytics</h4>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-xs font-semibold py-2 border-b border-slate-50">
                <span className="text-[#5c7075] flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  Likes
                </span>
                <span className="text-[#091e22] font-bold">{likesCount}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold py-2">
                <span className="text-[#5c7075] flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Total Views
                </span>
                <span className="text-[#091e22] font-bold">{project.views}</span>
              </div>
            </div>

            <button
              onClick={handleLike}
              className={`w-full font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                isLiked
                  ? 'bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100'
                  : 'bg-[#006655] hover:bg-[#004d40] text-white'
              }`}
            >
              <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {isLiked ? 'Liked Project' : 'Like Project'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
export default ProjectDetails;
