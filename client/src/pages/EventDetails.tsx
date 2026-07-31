import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal.js';

interface EventType {
  _id: string;
  title: string;
  description: string;
  eventType: 'workshop' | 'hackathon' | 'meetup' | 'webinar' | 'training';
  date: string;
  time: string;
  timezone: string;
  mode: 'online' | 'physical' | 'hybrid';
  locationOrLink: string;
  participants: Array<{ name: string; email: string }>;
  maxParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [registeredName, setRegisteredName] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (res.ok) {
          const data = await res.json();
          setEvent(data.data);
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);
    setAlreadyRegistered(false);

    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (data.alreadyRegistered) {
        setAlreadyRegistered(true);
        setRegisteredName(name);
        return;
      }
      if (!res.ok) {
        setSubmitError(data.message || 'Could not register for event');
      } else {
        setSubmitSuccess(true);
        setRegisteredName(name);
        setName('');
        setEmail('');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setSubmitError('Connection issue. Try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-[#5c7075] font-semibold">Loading details...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 border border-dashed border-slate-200 rounded-2xl text-center bg-white shadow-sm flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006655] flex items-center justify-center mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="font-bold text-base mb-1">Event not found</h3>
        <p className="text-xs text-[#5c7075] mb-6">The event you are looking for does not exist or has been cancelled.</p>
        <Link to="/events" className="bg-[#006655] hover:bg-[#004d40] text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-sm">
          Return to Events
        </Link>
      </div>
    );
  }

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getGoogleCalendarUrl = () => {
    const startDate = new Date(event.date + 'T' + event.time);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: fmt(startDate) + '/' + fmt(endDate),
      details: event.description?.slice(0, 500) || '',
      location: event.locationOrLink || '',
      ctz: 'UTC',
    });
    return `https://www.google.com/calendar/render?${params.toString()}`;
  };

  const downloadIcs = () => {
    const startDate = new Date(event.date + 'T' + event.time);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Guild Code//Events//EN',
      'BEGIN:VEVENT',
      'DTSTART:' + fmt(startDate),
      'DTEND:' + fmt(endDate),
      'SUMMARY:' + event.title,
      'DESCRIPTION:' + (event.description?.replace(/\n/g, '\\n').slice(0, 500) || ''),
      'LOCATION:' + (event.locationOrLink || ''),
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="font-sans text-[#091e22]">
      {/* 1. Header Hero Banner (Teal background card) */}
      <ScrollReveal direction="none">
      <section className="bg-gradient-to-r from-[#8be0eb] to-[#a3f0f9]/80 dark:from-[#1a292c] dark:to-[#0d1f22] py-12 md:py-16 px-6 relative overflow-hidden select-none">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Details */}
          <div className="max-w-2xl text-[#091e22] dark:text-[#f1f5f9]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#1a292c] border border-[#006655]/10 rounded-full text-[10px] font-bold text-[#006655] shadow-sm mb-4">
              &bull; LIVE WORKSHOP
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              {event.title}
            </h1>
            <p className="text-slate-700 dark:text-[#8ba4a8] text-sm md:text-base mb-8 leading-relaxed max-w-xl">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2 bg-white/70 dark:bg-[#1a292c]/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                <svg className="w-4 h-4 text-[#006655]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date: {formatEventDate(event.date)}
              </div>
              <div className="flex items-center gap-2 bg-white/70 dark:bg-[#1a292c]/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                <svg className="w-4 h-4 text-[#006655]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Time: {event.time} {event.timezone}
              </div>
            </div>
          </div>

          {/* Event Details sidebar */}
          <div className="w-full max-w-sm flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-300 uppercase tracking-widest block mb-4">Event Details</span>
            <div className="space-y-3 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-[#5c7075] dark:text-[#8ba4a8]">Timezone</span>
                <span className="dark:text-[#f1f5f9]">{event.timezone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5c7075] dark:text-[#8ba4a8]">Mode</span>
                <span className="text-[#006655] dark:text-emerald-400 uppercase font-bold">{event.mode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5c7075] dark:text-[#8ba4a8]">Capacity</span>
                <span className="dark:text-[#f1f5f9]">{event.maxParticipants || 'Unlimited'} Seats</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#5c7075] dark:text-[#8ba4a8]">Registered</span>
                <span className="dark:text-[#f1f5f9]">{event.participants ? event.participants.length : 0} Attendees</span>
              </div>
              <div className="pt-2 border-t border-[#006655]/30 dark:border-[#00a88a]/40 dark:border-[#00a88a]/20">
                <span className="text-slate-400 dark:text-slate-300 text-[10px] block mb-0.5 font-bold uppercase">Location / Access Link</span>
                {event.locationOrLink?.match(/^https?:\/\//) ? (
                  <a
                    href={event.locationOrLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#006655] break-all font-semibold hover:underline"
                  >
                    {event.locationOrLink}
                  </a>
                ) : (
                  <span className="text-[#091e22] dark:text-[#f1f5f9] break-all font-semibold">
                    {event.locationOrLink || 'To be shared with registered attendees'}
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>
      </ScrollReveal>

      {/* 2. Content Sections Splitting Grid */}
      <ScrollReveal delay={100}>
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left panel (takes 8 columns) */}
          <div className="lg:col-span-8">
            {/* About Event Description */}
            <section className="bg-white dark:bg-[#121e21] border border-[#006655]/15 dark:border-[#00a88a]/20 p-8 rounded-3xl shadow-sm mb-8">
              <h3 className="font-extrabold text-xl mb-4 pb-2 border-b border-[#006655]/30 dark:border-[#00a88a]/40 dark:border-[#00a88a]/20">About This Event</h3>
              <p className="text-sm text-[#5c7075] dark:text-[#8ba4a8] leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </section>
          </div>

          {/* Right panel (takes 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Registration / Confirmation Card */}
            <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white dark:bg-[#121e21] rounded-3xl p-6 shadow-sm">
              {submitSuccess || alreadyRegistered ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base dark:text-[#f1f5f9]">
                        {alreadyRegistered ? 'Already Registered' : "You're In!"}
                      </h3>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {registeredName || 'Registration confirmed'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl p-4 mb-4 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#5c7075] dark:text-[#8ba4a8]">Date</span>
                      <span className="font-semibold text-[#091e22] dark:text-[#f1f5f9]">{formatEventDate(event.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5c7075] dark:text-[#8ba4a8]">Time</span>
                      <span className="font-semibold text-[#091e22] dark:text-[#f1f5f9]">{event.time} {event.timezone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5c7075] dark:text-[#8ba4a8]">Location</span>
                      <span className="font-semibold text-[#006655] dark:text-emerald-400 text-right max-w-[180px] truncate">{event.locationOrLink || 'TBA'}</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-[#5c7075] dark:text-[#8ba4a8] mb-4 leading-relaxed">
                    Add this event to your calendar so you never miss it.
                  </p>

                  <div className="flex flex-col gap-2">
                    <a
                      href={getGoogleCalendarUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-white dark:bg-[#1a292c] border border-slate-200 dark:border-[#00a88a]/20 hover:bg-slate-50 dark:hover:bg-[#0d1f22] text-slate-700 dark:text-[#f1f5f9] py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Add to Google Calendar
                    </a>
                    <button
                      onClick={downloadIcs}
                      className="flex items-center justify-center gap-2 w-full bg-white dark:bg-[#1a292c] border border-slate-200 dark:border-[#00a88a]/20 hover:bg-slate-50 dark:hover:bg-[#0d1f22] text-slate-700 dark:text-[#f1f5f9] py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download .ICS
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-extrabold text-base mb-1 dark:text-[#f1f5f9]">Reserve Your Spot</h3>
                  <p className="text-[10px] text-[#5c7075] dark:text-[#8ba4a8] leading-relaxed mb-6">
                    Limited seats available. Complete your registration below.
                  </p>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
                      />
                    </div>

                    {submitError && (
                      <div className="bg-red-50 text-red-600 border border-red-150 p-3 rounded-xl text-[10px] leading-relaxed flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{submitError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#006655] hover:bg-[#004d40] text-white py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm font-bold flex items-center justify-center gap-1.5"
                    >
                      Complete Registration
                    </button>
                  </form>

                  <span className="text-[9px] text-[#5c7075] dark:text-[#8ba4a8] font-semibold text-center block mt-4 select-none">
                    By registering, you agree to our <Link to="/terms" className="underline">Terms of Service</Link>.
                  </span>
                </>
              )}
            </div>

          </div>

        </div>
      </section>
      </ScrollReveal>

    </div>
  );
};
export default EventDetails;
