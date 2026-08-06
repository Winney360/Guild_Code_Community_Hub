import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import ScrollReveal from '../components/ScrollReveal.js';
import { HeroVideoCarousel } from '../components/HeroVideoCarousel.js';
import { getDeviceId, getLikerId, isLikedBy } from '../utils/deviceId.js';

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
  bio?: string;
  projectCount?: number;
}

export const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    activeMembers: 0,
    projectsShared: 0,
    upcomingEvents: 0,
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const handleLikeProject = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Device-Id': getDeviceId() },
      });

      if (res.ok) {
        const data = await res.json();
        const likerId = getLikerId(user?._id);
        setProjects((prevProjects) =>
          prevProjects.map((p) => {
            if (p._id === projectId) {
              const currentLikes: string[] = p.likes || [];
              const userLiked = currentLikes.some((id: any) => id.toString() === likerId);
              let updatedLikes = [...currentLikes];
              if (data.isLiked && !userLiked) {
                updatedLikes.push(likerId);
              } else if (!data.isLiked && userLiked) {
                updatedLikes = updatedLikes.filter((id: any) => id.toString() !== likerId);
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

        const projectsRes = await fetch('/api/projects');
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData.data || []);
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
      <section className="bg-white pt-12 pb-10 px-5 sm:pt-16 sm:pb-20 sm:px-6 relative overflow-hidden select-none min-h-[90svh] sm:min-h-dvh lg:min-h-0">
        {/* Background media layers */}
        <div className="absolute inset-0 h-full w-full" aria-hidden="true">
          {/* Mobile picture (below md) */}
          <img src="/hero/hero-mobile.png" alt="" className="absolute inset-0 h-full w-full min-h-full min-w-full object-cover object-center md:hidden" />
          {/* Video carousel (tablet & above) */}
          <HeroVideoCarousel />
          {/* Dark scrim for readability (both themes) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#07191b]/85 via-[#091719]/70 to-[#0b1315]/70" />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-full text-xs font-semibold text-[#5c7075] shadow-sm mb-8 sm:mb-8">
              <svg className="w-3.5 h-3.5 text-[#006655] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a5 5 0 100-10 5 5 0 000 10z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 14L4.5 21l3.75-1.5L12 21l3.75-1.5L19.5 21l-3.75-7" />
              </svg>
              <span>Building Together Since 2024</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] sm:text-4xl md:text-6xl font-extrabold tracking-tight mb-6 sm:mb-6 leading-tight max-w-6xl mx-auto text-white whitespace-nowrap md:whitespace-normal">
              Welcome to <br className="md:hidden" /> <span className="text-emerald-400 font-serif italic pr-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">Guild Code Community</span> <br className="hidden md:block" />
            </h1>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal delay={200}>
            <p className="text-slate-300 text-sm sm:text-lg max-w-4xl mx-auto mb-8 sm:mb-8 leading-relaxed select-none">
              A collaborative platform where developers, designers, and creators come together to learn, build, and grow. <br className="hidden md:block" />
              Share your work, connect with peers, and be part of something amazing.
            </p>
          </ScrollReveal>

          {/* Active Members Avatar Pile */}
          <ScrollReveal delay={300}>
            <div className="flex items-center justify-center gap-4 mb-10 sm:mb-10 select-none">
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
                <div className="flex items-center gap-1 text-xs text-slate-100">
                  {loading ? '...' : (stats.activeMembers > 0 ? stats.activeMembers : members.length)} Active Members
                </div>
                <p className="text-[9px] text-slate-400 font-bold mt-0.5">Explore the community today</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Action Buttons */}
          <ScrollReveal delay={400}>
            <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 mb-12 sm:mb-16">
              <Link
                to="/members"
                className="flex-1 sm:flex-none bg-[#006655] hover:bg-[#004d40] text-white font-bold py-3.5 px-4 sm:px-8 rounded-xl transition-all shadow-md hover:shadow-lg text-xs sm:text-sm"
              >
                Explore Members
              </Link>
              <Link
                to="/projects"
                className="flex-1 sm:flex-none bg-white border border-slate-200 hover:bg-slate-50 text-[#006655] font-bold py-3.5 px-4 sm:px-8 rounded-xl transition-all shadow-sm text-xs sm:text-sm"
              >
                View Projects
              </Link>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* Live Stat Counters (Spec 4.1) */}
      <section className="bg-white dark:bg-[#0d1618] px-4 sm:px-6 pt-10 sm:pt-14 pb-14 sm:pb-16">
        <ScrollReveal delay={100}>
          <div className="max-w-6xl mx-auto grid grid-cols-3 gap-2 sm:gap-8 divide-x divide-[#006655]/15 dark:divide-[#00a88a]/30">
            <div className="flex flex-col items-center justify-center p-2 min-w-0">
              <span className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#091e22] dark:text-[#f1f5f9] mb-1">
                {loading ? '...' : (stats.activeMembers > 0 ? stats.activeMembers : members.length)}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#5c7075] uppercase tracking-wider text-center">Active Members</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 min-w-0">
              <span className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#091e22] dark:text-[#f1f5f9] mb-1">
                {loading ? '...' : stats.projectsShared}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#5c7075] uppercase tracking-wider text-center">Open Projects</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 min-w-0">
              <span className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#091e22] dark:text-[#f1f5f9] mb-1">
                {loading ? '...' : stats.upcomingEvents}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#5c7075] uppercase tracking-wider text-center">
                Upcoming Sessions
              </span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Elite Craftsmanship Section (Vetted Developers) */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[#006655]/30 dark:border-[#00a88a]/40">
        <div className="mb-10">
          <ScrollReveal>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-3">Elite Craftsmanship</h2>
              <p className="text-[#5c7075] text-sm max-w-xl">
                Meet the architects shaping the future. Our members are vetted for technical excellence and collaborative spirit.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Members Cards Row */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-2xl p-5 bg-white h-56 animate-pulse flex flex-col justify-between">
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
                <div className="border-t border-[#006655]/30 dark:border-[#00a88a]/40 pt-3 flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-8"></div>
                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : members.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.slice(0, 4).map((member, idx) => {
              const primaryRole = member.specializations && member.specializations.length > 0
                ? member.specializations[0]
                : (member.role === 'admin' ? 'Admin / Lead' : 'Community Member');
              const displaySkills = member.skills && member.skills.length > 0
                ? member.skills.slice(0, 3)
                : (member.specializations ? member.specializations.slice(0, 3) : []);

              return (
                <ScrollReveal key={member._id} delay={idx * 120}>
                  <div
                    onClick={() => navigate(`/members/${member._id}`)}
                    className="border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-2xl p-5 shadow-sm hover:shadow transition-shadow bg-white flex flex-col justify-between h-56 cursor-pointer group"
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
                      <Link to={`/members/${member._id}`} className="font-bold text-sm group-hover:text-[#006655] truncate block">
                        {member.fullName}
                      </Link>
                      <p className="text-xs text-[#5c7075] truncate">{primaryRole}</p>
                    </div>
                  </div>

                  <p className="text-xs text-[#5c7075] leading-relaxed line-clamp-2">
                    {member.bio || 'Vetted developer contributing to open-source tooling and scalable community projects within the Guild.'}
                  </p>

                  <div className="flex flex-wrap gap-1.5 my-4">
                    {displaySkills.length > 0 ? (
                      displaySkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-50 border border-[#006655]/15 dark:border-[#00a88a]/20 text-[#5c7075] text-[10px] rounded font-semibold truncate max-w-[90px]"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-50 border border-[#006655]/15 dark:border-[#00a88a]/20 text-[#5c7075] text-[10px] rounded font-semibold">
                        Builder
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-[#006655]/30 dark:border-[#00a88a]/40 pt-3 mt-auto text-xs text-[#5c7075]">
                    {member.github ? (
                      <a
                        href={member.github.startsWith('http') ? member.github : `https://${member.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
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
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-2xl">
            <p className="text-[#5c7075] text-sm">No active members found yet. Be the first to join!</p>
          </div>
        )}

        {/* View members action - always shown below the member cards */}
        <ScrollReveal delay={200}>
          <div className="mt-10 text-center select-none">
            <Link
              to="/members"
              className="inline-flex items-center gap-2 text-[#006655] hover:underline text-sm font-semibold"
            >
              <span>View all members</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Innovation in Action Section (Featured Projects Grid) */}
      <section className="bg-slate-50/50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight mb-3">Innovation in Action</h2>
              <p className="text-[#5c7075] text-sm max-w-md mx-auto">
                Peer into the repositories of the Guild. From low-level kernel optimization to distributed ledger protocols.
              </p>
            </div>
          </ScrollReveal>

          {(() => {
            const adminFeaturedProjects = projects.filter(
              (p) => p.isFeatured === true || p.isOfficialGuildCode === true
            );

            let featuredProject: any = null;
            let isActuallyAdminFeatured = false;

            if (adminFeaturedProjects.length > 0) {
              adminFeaturedProjects.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
              featuredProject = adminFeaturedProjects[0];
              isActuallyAdminFeatured = true;
            } else if (projects.length > 0) {
              const sortedByLikes = [...projects].sort((a, b) => {
                const likesA = a.likes?.length || 0;
                const likesB = b.likes?.length || 0;
                if (likesB !== likesA) return likesB - likesA;
                return (b.views || 0) - (a.views || 0);
              });
              featuredProject = sortedByLikes[0];
            }

            const topLikedProjects = projects
              .filter((p) => p._id !== featuredProject?._id)
              .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
              .slice(0, 3);

            if (!featuredProject) {
              return (
                <div className="text-center py-12 bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-3xl shadow-sm">
                  <p className="text-xs text-[#5c7075] font-semibold">No community projects published yet.</p>
                </div>
              );
            }

            return (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Left Column: Admin Featured or Most Liked Project (Takes 2 Columns on large screens) */}
                  <ScrollReveal className="md:col-span-2 lg:col-span-2">
                    <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-3xl overflow-hidden bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow h-full">
                    <div>
                      {/* Banner Image */}
                      <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                        <Link to={`/projects/${featuredProject._id}`}>
                          <img
                            src={
                              featuredProject.coverImage && featuredProject.coverImage.trim() !== ''
                                ? featuredProject.coverImage
                                : 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop'
                            }
                            alt={featuredProject.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                        <span className="absolute top-4 left-4 px-3 py-1 bg-[#e6f7f8] border border-[#006655]/20 text-[#006655] text-xs font-bold rounded-full shadow-xs">
                          {isActuallyAdminFeatured ? 'Admin Featured' : 'Featured Project'}
                        </span>
                      </div>

                      {/* Body Content */}
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-3">
                          <Link to={`/projects/${featuredProject._id}`} className="hover:underline">
                            <h3 className="text-xl font-bold text-[#091e22] hover:text-[#006655] transition-colors">
                              {featuredProject.title}
                            </h3>
                          </Link>
                          <div className="flex gap-3 text-xs text-[#5c7075] items-center shrink-0">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleLikeProject(featuredProject._id);
                              }}
                              className={`flex items-center gap-1 font-semibold border px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                                isLikedBy(featuredProject.likes, getLikerId(user?._id))
                                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50'
                              }`}
                              title={
                                isLikedBy(featuredProject.likes, getLikerId(user?._id))
                                  ? 'Unlike project'
                                  : 'Like project'
                              }
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                              <span>{featuredProject.likes?.length || 0}</span>
                            </button>
                            <span className="flex items-center gap-1 font-semibold text-slate-400">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {featuredProject.views || 0}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-[#5c7075] mb-6 leading-relaxed line-clamp-3">
                          {featuredProject.shortDescription || featuredProject.description || 'Innovative community open-source project.'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(featuredProject.techStack || []).slice(0, 5).map((tech: string) => (
                            <span key={tech} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs rounded-lg border border-[#006655]/15 dark:border-[#00a88a]/20 font-semibold">
                              #{tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    </div>
                  </ScrollReveal>

                  {/* Right Column: Top 3 Most Liked Projects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 md:col-span-2 lg:col-span-1">
                    {topLikedProjects.map((p, idx) => (
                      <ScrollReveal key={p._id} delay={150 + idx * 120} className="flex flex-col flex-grow">
                        <div
                          className="border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-3xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between flex-grow"
                        >
                        <div>
                          {topLikedProjects.length <= 2 && (
                            <Link to={`/projects/${p._id}`} className="block relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 mb-4">
                              <img
                                src={
                                  p.coverImage && p.coverImage.trim() !== ''
                                    ? p.coverImage
                                    : 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=600&h=337&fit=crop'
                                }
                                alt={p.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </Link>
                          )}
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <Link to={`/projects/${p._id}`} className="hover:underline">
                              <h4 className="font-bold text-base text-[#091e22] hover:text-[#006655] transition-colors">{p.title}</h4>
                            </Link>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleLikeProject(p._id);
                              }}
                              className={`flex items-center gap-1 text-xs font-bold shrink-0 border px-2 py-0.5 rounded-lg transition-colors cursor-pointer ${
                                isLikedBy(p.likes, getLikerId(user?._id))
                                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                              }`}
                              title={
                                isLikedBy(p.likes, getLikerId(user?._id))
                                  ? 'Unlike project'
                                  : 'Like project'
                              }
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                              <span>{p.likes?.length || 0}</span>
                            </button>
                          </div>
                          <p className="text-xs text-[#5c7075] leading-relaxed mb-4 line-clamp-2">
                            {p.shortDescription || p.description || 'Community project.'}
                          </p>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex flex-wrap gap-1">
                            {(p.techStack || []).slice(0, 2).map((tech: string) => (
                              <span key={tech} className="px-2 py-0.5 bg-slate-50 border border-[#006655]/15 dark:border-[#00a88a]/20 rounded text-[10px] text-slate-500 font-bold">
                                {tech}
                              </span>
                            ))}
                          </div>
                          <Link to={`/projects/${p._id}`} className="text-[#006655] hover:underline font-bold">
                            View Project
                          </Link>
                        </div>
                      </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>

                {/* Link to See All Projects */}
                <ScrollReveal delay={200}>
                  <div className="mt-12 text-center select-none">
                    <Link
                      to="/projects"
                      className="inline-flex items-center gap-2 bg-[#006655] hover:bg-[#004d40] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md text-xs hover:scale-105"
                    >
                      <span>See All Projects</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </ScrollReveal>
              </>
            );
          })()}
        </div>
      </section>

      {/* Quote Section */}
      <ScrollReveal>
        <section className="py-20 px-6 max-w-4xl mx-auto text-center relative select-none">
          <span className="text-8xl font-serif text-[#006655]/10 leading-none select-none absolute top-10 left-1/2 -translate-x-1/2">
            “
          </span>
          <blockquote className="relative z-10 text-sm sm:text-base md:text-2xl font-medium italic text-[#091e22] leading-relaxed mb-8 line-clamp-3">
            "Guild Code isn't just another platform; it's the professional sanctuary I didn't know I needed."
          </blockquote>
          <Link to="/members" className="flex flex-col items-center group">
            <div className="w-10 h-10 bg-[#006655] rounded-full overflow-hidden mb-3 flex items-center justify-center">
              <span className="text-white text-xs font-bold">WN</span>
            </div>
            <span className="font-bold text-sm group-hover:text-[#006655] transition-colors">Winfred Nkatha</span>
            <span className="text-xs text-[#5c7075]">Team Lead / Fullstack Developer</span>
          </Link>
        </section>
      </ScrollReveal>
    </div>
  );
};
export default Home;
