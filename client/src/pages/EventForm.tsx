import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<'workshop' | 'hackathon' | 'meetup' | 'webinar' | 'training'>('workshop');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState<'online' | 'physical' | 'hybrid'>('online');
  const [locationOrLink, setLocationOrLink] = useState('');
  const [maxParticipants, setMaxParticipants] = useState<number>(100);
  const [status, setStatus] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchEvent = async () => {
        setFetchLoading(true);
        try {
          const res = await fetch(`/api/events/${id}`);
          if (res.ok) {
            const data = await res.json();
            const e = data.data;
            setTitle(e.title);
            setDescription(e.description);
            setEventType(e.eventType);
            // Format YYYY-MM-DD
            if (e.date) {
              setDate(new Date(e.date).toISOString().split('T')[0]);
            }
            setTime(e.time);
            setMode(e.mode);
            setLocationOrLink(e.locationOrLink);
            setMaxParticipants(e.maxParticipants);
            setStatus(e.status);
          } else {
            setError('Failed to fetch event details');
          }
        } catch (err) {
          console.error(err);
          setError('Could not connect to server');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchEvent();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const payload = {
      title,
      description,
      eventType,
      date,
      time,
      mode,
      locationOrLink,
      maxParticipants,
      status,
    };

    try {
      const url = isEditMode ? `/api/events/${id}` : '/api/events';
      const method = isEditMode ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Could not submit event');
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard/events');
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
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        navigate('/dashboard/events');
      } else {
        const data = await res.json();
        setError(data.message || 'Could not delete event');
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
        <span className="text-xs text-[#5c7075] font-semibold">Fetching event details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-sm font-sans text-[#091e22]">
      {/* Title */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100 select-none">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">
            {isEditMode ? 'Edit Event' : 'New Event'}
          </h1>
          <p className="text-[10px] text-[#5c7075] mt-0.5">
            {isEditMode ? 'Update your event details, location, and capacity.' : 'Schedule a workshop, keynote, or dev mixer.'}
          </p>
        </div>
        {isEditMode && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Delete Event
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Event Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Advanced Rust Systems Architecture"
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
          />
        </div>

        {/* Type & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Event Type *</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
            >
              <option value="workshop">Workshop</option>
              <option value="hackathon">Hackathon</option>
              <option value="meetup">Meetup / Mixer</option>
              <option value="webinar">Webinar</option>
              <option value="training">Training</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Event Status *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Event Description *</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Provide a detailed description of the agenda, prerequisites, and goals..."
            className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655]"
          />
        </div>

        {/* Date, Time, and Max Participants */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Event Date *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Event Time *</label>
            <input
              type="text"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 14:00 GMT"
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Max Registrations</label>
            <input
              type="number"
              min={0}
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Mode & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Event Mode *</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
            >
              <option value="online">Online / Virtual</option>
              <option value="physical">Physical / On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Location or Link *</label>
            <input
              type="text"
              required
              value={locationOrLink}
              onChange={(e) => setLocationOrLink(e.target.value)}
              placeholder="e.g. Zoom Link, Berlin Dev Hub, etc."
              className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>
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
            <span>Event configuration {isEditMode ? 'updated' : 'created'} successfully! Redirecting...</span>
          </div>
        )}

        {/* Submit row */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 select-none">
          <Link
            to="/dashboard/events"
            className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#006655] hover:bg-[#004d40] text-white rounded-xl text-xs font-bold transition-all shadow-sm w-32 flex items-center justify-center"
          >
            {loading ? 'Submitting...' : 'Save Event'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default EventForm;
