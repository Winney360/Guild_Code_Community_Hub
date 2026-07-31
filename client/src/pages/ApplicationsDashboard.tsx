import React, { useEffect, useState } from 'react';
import ScrollReveal from '../components/ScrollReveal.js';

interface ApplicationReceived {
  _id: string;
  collaboration: {
    _id: string;
    title: string;
  };
  applicant: {
    _id: string;
    fullName: string;
    email: string;
  };
  role: string;
  githubUsername: string;
  portfolioLink: string;
  answers: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
  appliedAt: string;
}

interface ApplicationSubmitted {
  _id: string;
  collaboration: {
    _id: string;
    title: string;
    byUser: {
      fullName: string;
    };
  };
  role: string;
  githubUsername: string;
  portfolioLink: string;
  answers: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
  appliedAt: string;
}

export const ApplicationsDashboard: React.FC = () => {
  const [received, setReceived] = useState<ApplicationReceived[]>([]);
  const [submitted, setSubmitted] = useState<ApplicationSubmitted[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'submitted'>('received');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/applications/dashboard');
        if (res.ok) {
          const data = await res.json();
          setReceived(data.received);
          setSubmitted(data.submitted);
        }
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (appId: string, newStatus: 'accepted' | 'declined') => {
    setActionLoading(appId);
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update local state reactively
        setReceived((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const maps: Record<string, string> = {
      pending: 'bg-amber-50 text-amber-600 border-amber-100',
      reviewed: 'bg-blue-50 text-blue-600 border-blue-100',
      accepted: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      declined: 'bg-red-50 text-red-500 border-red-100',
    };
    return `px-2 py-0.5 border text-[9px] font-bold rounded-lg ${maps[status] || 'bg-slate-100 text-slate-500'}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-[#5c7075] font-semibold">Loading applications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      
      {/* Header breadcrumbs layout */}
      <ScrollReveal>
      <div className="flex justify-between items-center select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Applications Management</h1>
          <p className="text-xs text-[#5c7075]">Review developer applications or track your own collaboration requests.</p>
        </div>
      </div>
      </ScrollReveal>

      {/* Selector Tabs */}
      <ScrollReveal>
      <div className="flex border-b border-[#006655]/30 dark:border-[#00a88a]/40 select-none">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-6 py-2.5 font-bold text-xs border-b-2 transition-colors ${
            activeTab === 'received'
              ? 'border-[#006655] text-[#006655]'
              : 'border-transparent text-[#5c7075] hover:text-[#091e22]'
          }`}
        >
          Received Applications ({received.length})
        </button>
        <button
          onClick={() => setActiveTab('submitted')}
          className={`px-6 py-2.5 font-bold text-xs border-b-2 transition-colors ${
            activeTab === 'submitted'
              ? 'border-[#006655] text-[#006655]'
              : 'border-transparent text-[#5c7075] hover:text-[#091e22]'
          }`}
        >
          Submitted Applications ({submitted.length})
        </button>
      </div>
      </ScrollReveal>

      {/* Received Applications view */}
      <ScrollReveal>
      {activeTab === 'received' && (
        <div className="space-y-6">
          {received.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-3xl p-16 text-center bg-white shadow-sm flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006655] flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-extrabold text-base mb-1">No applications received</h3>
              <p className="text-xs text-[#5c7075]">Developer applications on your collaboration posts will show up here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {received.map((app) => (
                <div
                  key={app._id}
                  className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    {/* Candidate */}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-extrabold text-base">{app.applicant.fullName}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">{app.applicant.email}</span>
                      </div>
                      <p className="text-xs text-[#5c7075] leading-relaxed">
                        Applied for <span className="font-bold text-[#091e22]">{app.role}</span> on{' '}
                        <span className="font-bold text-[#006655]">{app.collaboration.title}</span>
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className="shrink-0 flex items-center gap-2 select-none">
                      <span className={getStatusBadge(app.status)}>{app.status.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Why me Answers box */}
                  <div className="bg-slate-50/50 border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-2xl p-4">
                    <span className="text-[9px] uppercase font-bold text-slate-450 block mb-1.5 select-none">Why Me?</span>
                    <p className="text-xs text-[#5c7075] leading-relaxed italic">"{app.answers}"</p>
                  </div>

                  {/* Links and Review Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-[#006655]/30 dark:border-[#00a88a]/40 text-xs font-semibold">
                    <div className="flex items-center gap-4">
                      <a href={app.portfolioLink} target="_blank" rel="noreferrer" className="text-[#006655] hover:underline flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Portfolio / LinkedIn
                      </a>
                      <a href={`https://github.com/${app.githubUsername}`} target="_blank" rel="noreferrer" className="text-[#006655] hover:underline flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        GitHub: @{app.githubUsername}
                      </a>
                    </div>

                    {/* Actions row if pending */}
                    {app.status === 'pending' ? (
                      <div className="flex items-center gap-2 select-none">
                        <button
                          disabled={actionLoading !== null}
                          onClick={() => handleStatusUpdate(app._id, 'declined')}
                          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
                        >
                          Decline
                        </button>
                        <button
                          disabled={actionLoading !== null}
                          onClick={() => handleStatusUpdate(app._id, 'accepted')}
                          className="px-5 py-2 bg-[#006655] hover:bg-[#004d40] text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
                        >
                          Accept Application
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold select-none uppercase">Reviewed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </ScrollReveal>

      {/* Submitted Applications view */}
      <ScrollReveal>
      {activeTab === 'submitted' && (
        <div className="space-y-6">
          {submitted.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-3xl p-16 text-center bg-white shadow-sm flex flex-col items-center justify-center select-none">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006655] flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-extrabold text-base mb-1">No applications submitted</h3>
              <p className="text-xs text-[#5c7075]">When you apply to other members' collaboration posts, they will show up here.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs font-medium text-[#5c7075]">
                <thead className="bg-slate-50 border-b border-[#006655]/30 dark:border-[#00a88a]/40 text-[#091e22] font-bold select-none text-[10px] uppercase">
                  <tr>
                    <th className="p-4 pl-6">Collaboration Title</th>
                    <th className="p-4">Owner</th>
                    <th className="p-4">Applied Role</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4 pr-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#006655]/30 dark:divide-[#00a88a]/40">
                  {submitted.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 pl-6 font-bold text-[#091e22]">{app.collaboration.title}</td>
                      <td className="p-4">{app.collaboration.byUser ? app.collaboration.byUser.fullName : 'Guild Member'}</td>
                      <td className="p-4 font-semibold">{app.role}</td>
                      <td className="p-4 select-none">
                        {new Date(app.appliedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4 pr-6 text-right select-none">
                        <span className={getStatusBadge(app.status)}>{app.status.toUpperCase()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      </ScrollReveal>

    </div>
  );
};
export default ApplicationsDashboard;
