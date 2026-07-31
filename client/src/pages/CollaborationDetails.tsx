import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import ScrollReveal from '../components/ScrollReveal.js';

interface CommentType {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    profilePicture?: string;
  };
  collaborationId: string;
  parentId?: string | null;
  text: string;
  createdAt: string;
}

interface CollaborationType {
  _id: string;
  title: string;
  description: string;
  byUser: {
    _id: string;
    fullName: string;
    profilePicture?: string;
  };
  requiredSkills: string[];
  techStack: string[];
  commitment: string;
  duration: string;
  timezone: string;
  rolesNeeded: string[];
  status: 'open' | 'closed';
  likes: string[];
  views: number;
  applicantsCount?: number;
  createdAt: string;
  comments?: CommentType[];
}

export const CollaborationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [collab, setCollab] = useState<CollaborationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liking, setLiking] = useState(false);

  // Application Form state
  const [role, setRole] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [portfolioLink, setPortfolioLink] = useState('');
  const [answers, setAnswers] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Discussion comment state
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Reply state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    const fetchCollab = async () => {
      try {
        const res = await fetch(`/api/collaborations/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCollab(data.data);
          setLikesCount(data.data.likes.length);
          setComments(data.data.comments || []);
          if (user) {
            setIsLiked(data.data.likes.includes(user._id));
          }
          if (data.data.rolesNeeded && data.data.rolesNeeded.length > 0) {
            setRole(data.data.rolesNeeded[0]); // Default to first role
          }
        }
      } catch (err) {
        console.error('Error fetching collaboration details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCollab();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (liking) return;
    setLiking(true);

    try {
      const res = await fetch(`/api/collaborations/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      }
    } catch (err) {
      console.error('Error liking collaboration:', err);
    } finally {
      setLiking(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`/api/collaborations/${id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, githubUsername, portfolioLink, answers }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.message || 'Could not submit application');
      } else {
        setSubmitSuccess(true);
        // Clear fields
        setGithubUsername('');
        setPortfolioLink('');
        setAnswers('');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setSubmitError('Server connection issue. Try again later.');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!commentText.trim()) return;

    setCommenting(true);
    setCommentError('');
    try {
      const res = await fetch(`/api/collaborations/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments([...comments, data.data]);
        setCommentText('');
      } else {
        setCommentError(data.message || 'Failed to post comment');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      setCommentError('Server connection error');
    } finally {
      setCommenting(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!replyText.trim()) return;

    setReplying(true);
    setCommentError('');
    try {
      const res = await fetch(`/api/collaborations/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText, parentId }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments([...comments, data.data]);
        setReplyText('');
        setReplyingToId(null);
      } else {
        setCommentError(data.message || 'Failed to post reply');
      }
    } catch (err) {
      console.error('Error posting reply:', err);
      setCommentError('Server connection error');
    } finally {
      setReplying(false);
    }
  };

  const getClosesInText = () => {
    if (!collab) return 'Open';
    if (collab.status === 'closed') return 'Closed';
    const createdDate = new Date(collab.createdAt).getTime();
    const now = new Date().getTime();
    const daysPassed = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
    const daysLeft = 14 - daysPassed;
    if (daysLeft <= 0) return 'Closes Today';
    return `${daysLeft} Day${daysLeft === 1 ? '' : 's'}`;
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setComments(comments.filter((c) => c._id !== commentId));
      } else {
        alert(data.message || 'Failed to delete comment');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Server connection error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-[#5c7075] font-semibold">Loading request...</span>
      </div>
    );
  }

  if (!collab) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 border border-dashed border-slate-200 rounded-2xl text-center bg-white shadow-sm flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006655] flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </div>
        <h3 className="font-bold text-base mb-1">Collaboration not found</h3>
        <p className="text-xs text-[#5c7075] mb-6">The collaboration request you are looking for does not exist or has been closed.</p>
        <Link to="/collaborate" className="bg-[#006655] hover:bg-[#004d40] text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-sm">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-[#091e22]">
      {/* 1. Header Info Row */}
      <ScrollReveal>
      <div className="mb-8">
        <div className="flex items-center gap-1.5 text-xs text-[#006655] font-bold mb-3 select-none">
          <svg className="w-4 h-4 text-[#006655]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Active Collaboration Request
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
          {collab.title}
        </h1>

        {/* Creator Info Row */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden shrink-0 border border-[#006655]/15 dark:border-[#00a88a]/20">
            {collab.byUser && collab.byUser.profilePicture ? (
              <img src={collab.byUser.profilePicture} alt={collab.byUser.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[#006655]/10 flex items-center justify-center font-bold text-[#006655] text-sm">
                {collab.byUser ? collab.byUser.fullName.charAt(0).toUpperCase() : 'C'}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-bold text-xs">{collab.byUser ? collab.byUser.fullName : 'Guild Member'}</h4>
            <div className="flex items-center gap-1.5 text-[10px] text-[#5c7075] font-semibold mt-0.5 select-none">
              <span>Core Contributor @ Nexus Protocol</span>
              <span className="text-slate-350">&bull;</span>
              <span className="px-1.5 py-0.5 bg-[#e6f7f8] text-[#006655] border border-[#006655]/10 rounded font-bold">
                Verified Member
              </span>
            </div>
          </div>
        </div>
      </div>
      </ScrollReveal>

      {/* 2. Main Content Grid */}
      <ScrollReveal delay={100}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column (takes 8 columns) */}
        <div className="lg:col-span-8">
          {/* Mission */}
          <section className="bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 p-6 md:p-8 rounded-3xl shadow-sm mb-8">
            <h3 className="font-extrabold text-xl mb-4">The Mission</h3>
            <div className="text-sm text-[#5c7075] leading-relaxed space-y-4">
              <p>{collab.description}</p>
              <p>
                This is not just another blockchain or protocol project; it is a fundamental redesign of how data moves across the web. We are currently in the pre-alpha stage, having secured foundational architecture and early-stage backing. We need brilliant engineers to join us in refining the consensus engine and the P2P networking stack.
              </p>
              <p>
                Our goal is to reach a stable testnet by Q4. You will be working directly on the core protocol, contributing to open-source breakthroughs that will redefine edge computing.
              </p>
            </div>
          </section>

          {/* Tech Stack & Commitment row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 select-none">
            {/* Tech Stack */}
            <div className="bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 p-6 rounded-3xl shadow-sm">
              <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#006655]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {collab.techStack.map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-slate-50 border border-slate-150 text-[#5c7075] text-[10px] rounded-lg font-semibold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Commitment Details */}
            <div className="bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 p-6 rounded-3xl shadow-sm text-xs font-semibold">
              <h3 className="font-extrabold text-sm mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-[#006655]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Commitment
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1 border-b border-[#006655]/30 dark:border-[#00a88a]/40">
                  <span className="text-[#5c7075]">Weekly Hours</span>
                  <span className="text-[#091e22]">{collab.commitment}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#006655]/30 dark:border-[#00a88a]/40">
                  <span className="text-[#5c7075]">Duration</span>
                  <span className="text-[#091e22]">{collab.duration}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#5c7075]">Timezone</span>
                  <span className="text-[#091e22]">{collab.timezone || 'Global'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Discussion comments section */}
          <section className="bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 p-6 md:p-8 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-lg">Discussion ({comments.length})</h3>
            </div>

            {commentError && (
              <div className="bg-red-50 text-red-600 border border-red-150 p-3 rounded-xl text-xs mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{commentError}</span>
              </div>
            )}

            {/* Comments List & Threads */}
            <div className="space-y-6 mb-6">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#5c7075] border border-dashed border-slate-100 rounded-2xl bg-slate-50/20 select-none">
                  No comments yet. Start the discussion!
                </div>
              ) : (
                (() => {
                  const topLevelComments = comments.filter((c) => !c.parentId);

                  return topLevelComments.map((cmt) => {
                    const isCommentOwnerOrAdmin =
                      (collab.byUser && collab.byUser._id === user?._id) || user?.role === 'admin';

                    const childReplies = comments.filter((c) => {
                      if (!c.parentId) return false;
                      const pid = typeof c.parentId === 'string' ? c.parentId : (c.parentId as any)._id || (c.parentId as any).toString();
                      return pid === cmt._id;
                    });

                    return (
                      <div key={cmt._id} className="space-y-4">
                        {/* Top level comment */}
                        <div className="flex items-start gap-4 group">
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-100">
                            {cmt.userId && cmt.userId.profilePicture ? (
                              <img src={cmt.userId.profilePicture} alt={cmt.userId.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-[#006655]/10 flex items-center justify-center font-bold text-[#006655] text-xs">
                                {cmt.userId ? cmt.userId.fullName.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs">{cmt.userId ? cmt.userId.fullName : 'Guild Member'}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">
                                  {new Date(cmt.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                {user && (
                                  <button
                                    onClick={() => {
                                      setReplyingToId(replyingToId === cmt._id ? null : cmt._id);
                                      setReplyText('');
                                    }}
                                    className="text-[#006655] hover:underline text-[10px] font-bold cursor-pointer"
                                  >
                                    {replyingToId === cmt._id ? 'Cancel Reply' : 'Reply'}
                                  </button>
                                )}
                                {isCommentOwnerOrAdmin && (
                                  <button
                                    onClick={() => handleCommentDelete(cmt._id)}
                                    className="text-red-500 hover:text-red-700 text-[10px] font-bold transition-colors select-none flex items-center gap-1 cursor-pointer"
                                    title="Delete comment"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-[#5c7075] leading-relaxed">
                              {cmt.text}
                            </p>
                          </div>
                        </div>

                        {/* Inline Reply Form */}
                        {replyingToId === cmt._id && (
                          <form onSubmit={(e) => handleReplySubmit(e, cmt._id)} className="ml-10 flex gap-2">
                            <input
                              type="text"
                              placeholder={`Reply to ${cmt.userId ? cmt.userId.fullName : 'comment'}...`}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              disabled={replying}
                              autoFocus
                              className="flex-grow px-3 py-1.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#006655]"
                            />
                            <button
                              type="submit"
                              disabled={replying || !replyText.trim()}
                              className="bg-[#006655] hover:bg-[#004d40] disabled:bg-slate-200 disabled:cursor-not-allowed text-white py-1 px-4 rounded-xl font-bold text-xs shadow-sm transition-all"
                            >
                              {replying ? 'Replying...' : 'Send Reply'}
                            </button>
                          </form>
                        )}

                        {/* Child Replies Thread */}
                        {childReplies.length > 0 && (
                          <div className="ml-8 border-l-2 border-slate-100 pl-4 space-y-4">
                            {childReplies.map((reply) => {
                              const isReplyOwnerOrAdmin =
                                (collab.byUser && collab.byUser._id === user?._id) || user?.role === 'admin';

                              return (
                                <div key={reply._id} className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 bg-slate-100">
                                    {reply.userId && reply.userId.profilePicture ? (
                                      <img src={reply.userId.profilePicture} alt={reply.userId.fullName} className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full bg-[#006655]/10 flex items-center justify-center font-bold text-[#006655] text-[10px]">
                                        {reply.userId ? reply.userId.fullName.charAt(0).toUpperCase() : 'U'}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-grow">
                                    <div className="flex items-center justify-between mb-0.5">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-[11px]">{reply.userId ? reply.userId.fullName : 'Guild Member'}</span>
                                        <span className="text-[9px] text-slate-400 font-semibold">
                                          {new Date(reply.createdAt).toLocaleString()}
                                        </span>
                                      </div>
                                      {isReplyOwnerOrAdmin && (
                                        <button
                                          onClick={() => handleCommentDelete(reply._id)}
                                          className="text-red-500 hover:text-red-700 text-[9px] font-bold transition-colors cursor-pointer"
                                          title="Delete reply"
                                        >
                                          Delete
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-xs text-[#5c7075] leading-relaxed">
                                      {reply.text}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()
              )}
            </div>

            {/* Post comment input */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="flex gap-3 mt-8">
                <input
                  type="text"
                  placeholder="Ask a question about this mission..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={commenting}
                  className="flex-grow px-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  disabled={commenting || !commentText.trim()}
                  className="bg-[#006655] hover:bg-[#004d40] disabled:bg-slate-200 disabled:cursor-not-allowed text-white py-2 px-5 rounded-xl font-bold text-xs shadow-sm transition-all"
                >
                  {commenting ? 'Posting...' : 'Post'}
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 border border-[#006655]/15 dark:border-[#00a88a]/20 p-4 rounded-2xl text-center text-xs text-[#5c7075] mt-8 select-none">
                Please{' '}
                <Link to="/login" className="text-[#006655] font-bold hover:underline">
                  sign in
                </Link>{' '}
                to join the discussion.
              </div>
            )}
          </section>
        </div>

        {/* Right Column (takes 4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Apply Now Card */}
          <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-extrabold text-base mb-1">Apply Now</h3>
            <p className="text-[10px] text-[#5c7075] leading-relaxed mb-6">
              Join the core project team. Your application will be sent directly to the creator for review.
            </p>

            <form onSubmit={handleApply} className="space-y-4">
              {/* Target Role selection dropdown */}
              <div>
                <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Target Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
                >
                  {collab.rolesNeeded.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* GitHub username */}
              <div>
                <label className="text-[10px] font-bold text-[#5c7075] block mb-1">GitHub Username</label>
                <input
                  type="text"
                  placeholder="github.com/username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
                />
              </div>

              {/* Portfolio Link */}
              <div>
                <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Portfolio / LinkedIn</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
                />
              </div>

              {/* Why Me text */}
              <div>
                <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Why Me?</label>
                <textarea
                  placeholder="Briefly describe your relevant experience..."
                  value={answers}
                  onChange={(e) => setAnswers(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
                />
              </div>

              {/* Status feedback alerts */}
              {submitError && (
                <div className="bg-red-50 text-red-600 border border-red-150 p-3 rounded-xl text-[10px] leading-relaxed flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{submitError}</span>
                </div>
              )}
              {submitSuccess && (
                <div className="bg-green-50 text-green-700 border border-green-150 p-3 rounded-xl text-[10px] leading-relaxed flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Application submitted successfully! The creator will review your profile.</span>
                </div>
              )}

              {/* Submit CTA button */}
              <button
                type="submit"
                className="w-full bg-[#006655] hover:bg-[#004d40] text-white py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm font-bold flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit Application
              </button>
            </form>

            {/* Stats list summary */}
            <div className="space-y-3 mt-6 pt-6 border-t border-[#006655]/30 dark:border-[#00a88a]/40 text-xs font-semibold">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#5c7075]">Likes</span>
                <span className="text-[#091e22]">{likesCount} Total</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#5c7075]">Applicants</span>
                <span className="text-[#091e22]">{collab.applicantsCount || 0} Active</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#5c7075]">Views</span>
                <span className="text-[#091e22]">{collab.views || 0} Total</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#5c7075]">Status / Closes</span>
                <span className={collab.status === 'closed' ? 'text-slate-400 font-bold' : 'text-[#006655] font-bold'}>
                  {getClosesInText()}
                </span>
              </div>
            </div>
          </div>

          {/* Action toggle like */}
          <button
            onClick={handleLike}
            className={`w-full font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 ${
              isLiked
                ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100'
                : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isLiked ? 'Liked Request' : 'Like Collaboration'}
          </button>
        </div>
      </div>
      </ScrollReveal>
    </div>
  );
};
export default CollaborationDetails;
