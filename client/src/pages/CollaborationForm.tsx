import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.js';

export const CollaborationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [commitment, setCommitment] = useState('');
  const [duration, setDuration] = useState('');
  const [timezone, setTimezone] = useState('Any (Flexible)');
  const [skillsInput, setSkillsInput] = useState(''); // Comma separated
  const [techInput, setTechInput] = useState(''); // Comma separated
  const [rolesInput, setRolesInput] = useState(''); // Comma separated
  const [status, setStatus] = useState<'open' | 'closed'>('open');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchCollab = async () => {
        setFetchLoading(true);
        try {
          const res = await fetch(`/api/collaborations/${id}`);
          if (res.ok) {
            const data = await res.json();
            const c = data.data;
            setTitle(c.title);
            setDescription(c.description);
            setCommitment(c.commitment);
            setDuration(c.duration);
            setTimezone(c.timezone || 'Global');
            setSkillsInput(c.requiredSkills.join(', '));
            setTechInput(c.techStack.join(', '));
            setRolesInput(c.rolesNeeded.join(', '));
            setStatus(c.status);
          } else {
            setError('Failed to fetch collaboration details');
          }
        } catch (err) {
          console.error(err);
          setError('Could not connect to server');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchCollab();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const requiredSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const techStack = techInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const rolesNeeded = rolesInput
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    if (requiredSkills.length > 8) {
      setError('Required skills cannot exceed 8 items');
      setLoading(false);
      return;
    }

    if (techStack.length > 8) {
      setError('Tech stack cannot exceed 8 items');
      setLoading(false);
      return;
    }

    if (rolesNeeded.length === 0) {
      setError('At least one target role is required');
      setLoading(false);
      return;
    }

    const payload = {
      title,
      description,
      commitment,
      duration,
      timezone,
      requiredSkills,
      techStack,
      rolesNeeded,
      status,
    };

    try {
      const url = isEditMode ? `/api/collaborations/${id}` : '/api/collaborations';
      const method = isEditMode ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not submit collaboration request');
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard/collaborations');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to server. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this collaboration request? This will also delete all active applications submitted to it.')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/collaborations/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        navigate('/dashboard/collaborations');
      } else {
        const data = await res.json();
        setError(data.message || 'Could not delete request');
      }
    } catch (err) {
      console.error(err);
      setError('Server connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-[#5c7075] font-semibold">Fetching request details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 p-6 md:p-8 rounded-3xl shadow-sm font-sans text-[#091e22]">
      {/* Title */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#006655]/30 dark:border-[#00a88a]/40 select-none">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">
            {isEditMode ? 'Edit Collaboration' : 'New Collaboration'}
          </h1>
          <p className="text-[10px] text-[#5c7075] mt-0.5">
            {isEditMode ? 'Update your recruitment specifications and schedule.' : 'Find developers, designers, and visionaries to join your workspace.'}
          </p>
        </div>
        {isEditMode && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Delete Listing
          </button>
        )}
      </div>

      <ScrollReveal>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Collaboration Request Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Distributed Consensus Engine Optimization"
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Listing Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
          >
            <option value="open">Open (Accepting Applications)</option>
            <option value="closed">Closed (Recruitment Completed)</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Collaboration Mission Description *</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Outline the project goals, requirements, expectations, and milestones..."
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655]"
          />
        </div>

        {/* Commitment, Duration, and Timezone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Weekly Commitment *</label>
            <input
              type="text"
              required
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              placeholder="e.g. 10-15 hrs / week"
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Duration *</label>
            <input
              type="text"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 3 - 6 Months"
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Timezone Preference</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
            >
              <option value="Any (Flexible)">Any Timezone (Flexible)</option>
              <option value="UTC / GMT (UTC+0)">UTC / GMT (UTC+0)</option>
              <option value="EST / Eastern Time (UTC-5)">EST / Eastern Time (UTC-5)</option>
              <option value="CST / Central Time (UTC-6)">CST / Central Time (UTC-6)</option>
              <option value="MST / Mountain Time (UTC-7)">MST / Mountain Time (UTC-7)</option>
              <option value="PST / Pacific Time (UTC-8)">PST / Pacific Time (UTC-8)</option>
              <option value="CET / Central European Time (UTC+1)">CET / Central European Time (UTC+1)</option>
              <option value="EET / Eastern European Time (UTC+2)">EET / Eastern European Time (UTC+2)</option>
              <option value="EAT / East Africa Time (UTC+3)">EAT / East Africa Time (UTC+3)</option>
              <option value="GST / Gulf Standard Time (UTC+4)">GST / Gulf Standard Time (UTC+4)</option>
              <option value="IST / India Standard Time (UTC+5:30)">IST / India Standard Time (UTC+5:30)</option>
              <option value="ICT / Indochina Time (UTC+7)">ICT / Indochina Time (UTC+7)</option>
              <option value="SGT / Singapore Time (UTC+8)">SGT / Singapore Time (UTC+8)</option>
              <option value="JST / Japan Standard Time (UTC+9)">JST / Japan Standard Time (UTC+9)</option>
              <option value="AEST / Australian Eastern (UTC+10)">AEST / Australian Eastern (UTC+10)</option>
              <option value="NZST / New Zealand Time (UTC+12)">NZST / New Zealand Time (UTC+12)</option>
              {timezone && ![
                'Any (Flexible)',
                'UTC / GMT (UTC+0)',
                'EST / Eastern Time (UTC-5)',
                'CST / Central Time (UTC-6)',
                'MST / Mountain Time (UTC-7)',
                'PST / Pacific Time (UTC-8)',
                'CET / Central European Time (UTC+1)',
                'EET / Eastern European Time (UTC+2)',
                'EAT / East Africa Time (UTC+3)',
                'GST / Gulf Standard Time (UTC+4)',
                'IST / India Standard Time (UTC+5:30)',
                'ICT / Indochina Time (UTC+7)',
                'SGT / Singapore Time (UTC+8)',
                'JST / Japan Standard Time (UTC+9)',
                'AEST / Australian Eastern (UTC+10)',
                'NZST / New Zealand Time (UTC+12)',
              ].includes(timezone) && (
                <option value={timezone}>{timezone}</option>
              )}
            </select>
          </div>
        </div>

        {/* Required Skills, Tech Stack, and Roles Needed */}
        <div>
          <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Required Skills * (Comma separated, max 8 items)</label>
          <input
            type="text"
            required
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g. Low-level Optimization, Performance Profiling"
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Tech Stack * (Comma separated, max 8 items)</label>
          <input
            type="text"
            required
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="e.g. Rust, WebAssembly, gRPC"
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Roles Needed * (Comma separated list of target positions)</label>
          <input
            type="text"
            required
            value={rolesInput}
            onChange={(e) => setRolesInput(e.target.value)}
            placeholder="e.g. Backend Engineer (Rust), Systems Architect"
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>

        {/* Action feedback */}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-150 p-3.5 rounded-xl text-xs select-none flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 border border-green-150 p-3.5 rounded-xl text-xs select-none flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Collaboration request {isEditMode ? 'updated' : 'created'} successfully! Redirecting...</span>
          </div>
        )}

        {/* Submit row */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#006655]/30 dark:border-[#00a88a]/40 select-none">
          <Link
            to="/dashboard/collaborations"
            className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#006655] hover:bg-[#004d40] text-white rounded-xl text-xs font-bold transition-all shadow-sm w-32 flex items-center justify-center"
          >
            {loading ? 'Submitting...' : 'Save Request'}
          </button>
        </div>
      </form>
      </ScrollReveal>
    </div>
  );
};
export default CollaborationForm;
