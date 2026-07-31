import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import ScrollReveal from '../components/ScrollReveal.js';

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
  status: string;
  isActive: boolean;
}

interface ProjectType {
  _id: string;
  title: string;
  shortDescription: string;
  category: string;
  techStack: string[];
  coverImage: string;
  likes: string[];
  views: number;
  byUser: any;
  createdAt: string;
}

export const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [memberProjects, setMemberProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeCache, setLikeCache] = useState<Record<string, { isLiked: boolean; likesCount: number }>>({});

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
        setLikeCache((prev) => ({ ...prev, [projectId]: { isLiked: data.isLiked, likesCount: data.likesCount } }));
        setMemberProjects((prev) =>
          prev.map((p) =>
            p._id === projectId
              ? { ...p, likes: data.isLiked ? [...p.likes, user._id] : p.likes.filter((id: any) => id.toString() !== user._id) }
              : p
          )
        );
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const [userRes, projectsRes] = await Promise.all([
          fetch(`/api/users/${id}`),
          fetch('/api/projects'),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setMember(userData.data);
        }

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          const allProjects: ProjectType[] = projectsData.data || [];
          const userProjects = allProjects.filter((p) => {
            const authorId = typeof p.byUser === 'object' && p.byUser ? p.byUser._id : p.byUser;
            return authorId === id;
          });
          setMemberProjects(userProjects);
        }
      } catch (err) {
        console.error('Error fetching member profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMemberData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-[#5c7075] font-semibold">Loading member profile...</span>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 border border-dashed border-slate-200 rounded-2xl text-center bg-white shadow-sm flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006655] flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="font-bold text-base mb-1">Profile not found</h3>
        <p className="text-xs text-[#5c7075] mb-6">The member profile you are looking for does not exist or is inactive.</p>
        <Link to="/members" className="bg-[#006655] hover:bg-[#004d40] text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-sm">
          Return to Directory
        </Link>
      </div>
    );
  }

  const specializations = member.specializations && member.specializations.length > 0
    ? member.specializations
    : [];
  const skills = member.skills && member.skills.length > 0 ? member.skills : [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-[#091e22]">
      {/* 1. Header Member Profile Card */}
      <ScrollReveal>
      <div className="bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-3xl p-6 md:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Avatar Image */}
        <div className="relative shrink-0 select-none">
          <div className="w-28 h-28 rounded-full overflow-hidden border border-[#006655]/15 dark:border-[#00a88a]/20 shadow-sm bg-slate-50">
            {member.profilePicture ? (
              <img src={member.profilePicture} alt={member.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#006655]/10 flex items-center justify-center text-4xl font-bold text-[#006655]">
                {member.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-[#00e676] border-4 border-white rounded-full"></span>
        </div>

        {/* Member Info */}
        <div className="flex-grow flex flex-col justify-between text-center md:text-left">
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl font-extrabold tracking-tight">{member.fullName}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${member.role === 'admin' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                {member.role === 'admin' ? 'Community Admin' : 'Guild Builder'}
              </span>
            </div>

            {specializations.length > 0 && (
              <p className="text-xs text-[#006655] font-bold mb-3">
                {specializations.join(' • ')}
              </p>
            )}

            <p className="text-sm text-[#5c7075] leading-relaxed max-w-3xl mb-6">
              {member.bio && member.bio.trim() !== '' ? member.bio : 'No bio added yet.'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-xs text-[#5c7075] font-semibold">
            {member.location && (
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {member.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {memberProjects.length} Published {memberProjects.length === 1 ? 'Project' : 'Projects'}
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 shrink-0">
          {member.github && (
            <a
              href={member.github.startsWith('http') ? member.github : `https://${member.github}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors"
              title="GitHub Profile"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          )}
          {member.linkedin && (
            <a
              href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors"
              title="LinkedIn Profile"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          )}
        </div>
      </div>
      </ScrollReveal>

      {/* 2. Skills & Specializations */}
      {(skills.length > 0 || specializations.length > 0) && (
        <ScrollReveal delay={100}>
        <div className="bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-3xl p-6 shadow-sm mb-8">
          <h3 className="font-bold text-base mb-4 text-[#091e22]">Skills & Technical Focus</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                #{skill}
              </span>
            ))}
            {specializations.map((spec) => (
              <span
                key={spec}
                className="px-3 py-1.5 bg-[#e6f7f8] border border-[#006655]/20 text-[#006655] text-xs font-bold rounded-xl"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
        </ScrollReveal>
      )}

      {/* 3. Real Projects Section */}
      <ScrollReveal delay={200}>
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight">Published Projects</h2>
          <span className="text-xs text-[#5c7075] font-semibold">{memberProjects.length} Total</span>
        </div>

        {memberProjects.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center bg-white shadow-sm flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006655] flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-bold text-base mb-1">No published projects yet</h3>
            <p className="text-xs text-[#5c7075]">{member.fullName} has not published any projects to the showcase yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberProjects.map((project) => (
              <div
                key={project._id}
                className="border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between min-h-[380px]"
              >
                <div>
                  <Link to={`/projects/${project._id}`} className="block relative aspect-[16/9] w-full bg-slate-100 overflow-hidden group">
                    <img
                      src={project.coverImage || 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=600&h=337&fit=crop'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 dark:bg-[#1a292c]/90 backdrop-blur-sm text-slate-800 dark:text-[#f1f5f9] text-[10px] font-bold rounded-lg shadow-sm">
                      {project.category}
                    </span>
                  </Link>

                  <div className="p-5">
                    <Link to={`/projects/${project._id}`} className="hover:underline block mb-1">
                      <h4 className="font-bold text-base text-[#091e22] hover:text-[#006655] transition-colors truncate">{project.title}</h4>
                    </Link>
                    <p className="text-xs text-[#5c7075] line-clamp-2 leading-relaxed mb-4">
                      {project.shortDescription || 'View project details to learn more.'}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.techStack?.slice(0, 4).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 bg-slate-50 border border-slate-150 text-[10px] text-slate-500 rounded font-semibold">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-[#006655]/30 dark:border-[#00a88a]/40 flex items-center justify-between text-xs text-[#5c7075]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLikeProject(project._id);
                      }}
                      className={`flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
                        (likeCache[project._id] !== undefined ? likeCache[project._id].isLiked : user && (project.likes || []).some((id: any) => id.toString() === user._id))
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-slate-50 border-slate-100 text-slate-500 hover:text-rose-500 hover:bg-rose-50'
                      }`}
                      title={
                        (likeCache[project._id] !== undefined ? likeCache[project._id].isLiked : user && (project.likes || []).some((id: any) => id.toString() === user._id))
                          ? 'Unlike project'
                          : 'Like project'
                      }
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span>{likeCache[project._id] !== undefined ? likeCache[project._id].likesCount : (project.likes ? project.likes.length : 0)}</span>
                    </button>
                    <span className="flex items-center gap-1 font-semibold">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {project.views || 0}
                    </span>
                  </div>

                  <Link to={`/projects/${project._id}`} className="text-[#006655] font-bold hover:underline text-xs">
                    View Project &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      </ScrollReveal>
    </div>
  );
};
export default MemberProfile;
