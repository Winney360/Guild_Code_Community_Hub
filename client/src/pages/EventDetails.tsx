import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

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
  const [experience, setExperience] = useState('Intermediate (1-3 Years)');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

    try {
      const res = await fetch(`/api/events/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.message || 'Could not register for event');
      } else {
        setSubmitSuccess(true);
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

  return (
    <div className="font-sans text-[#091e22]">
      {/* 1. Header Hero Banner (Teal background card) */}
      <section className="bg-gradient-to-r from-[#8be0eb] to-[#a3f0f9]/80 py-12 md:py-16 px-6 relative overflow-hidden select-none">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Details */}
          <div className="max-w-2xl text-[#091e22]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#006655]/10 rounded-full text-[10px] font-bold text-[#006655] shadow-sm mb-4">
              &bull; LIVE WORKSHOP
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              {event.title}
            </h1>
            <p className="text-slate-700 text-sm md:text-base mb-8 leading-relaxed max-w-xl">
              {event.description}
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                <svg className="w-4 h-4 text-[#006655]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Date: {formatEventDate(event.date)}
              </div>
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                <svg className="w-4 h-4 text-[#006655]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Time: {event.time} {event.timezone}
              </div>
            </div>
          </div>

          {/* Event Metadata Card */}
          <div className="bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-3xl p-6 shadow-md w-full max-w-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Event Details</span>
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <span className="text-[#5c7075]">Timezone</span>
                  <span className="text-[#091e22]">{event.timezone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5c7075]">Mode</span>
                  <span className="text-[#006655] uppercase font-bold">{event.mode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5c7075]">Capacity</span>
                  <span className="text-[#091e22]">{event.maxParticipants || 'Unlimited'} Seats</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5c7075]">Registered</span>
                  <span className="text-[#091e22]">{event.participants ? event.participants.length : 0} Attendees</span>
                </div>
                <div className="pt-2 border-t border-slate-50">
                  <span className="text-slate-400 text-[10px] block mb-0.5 font-bold uppercase">Location / Access Link</span>
                  <span className="text-[#091e22] break-all font-semibold">{event.locationOrLink || 'To be shared with registered attendees'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Content Sections Splitting Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left panel (takes 8 columns) */}
          <div className="lg:col-span-8">
            {/* About Event Description */}
            <section className="bg-white border border-[#006655]/15 dark:border-[#00a88a]/20 p-8 rounded-3xl shadow-sm mb-8">
              <h3 className="font-extrabold text-xl mb-4 pb-2 border-b border-slate-50">About This Event</h3>
              <p className="text-sm text-[#5c7075] leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </section>
          </div>

          {/* Right panel (takes 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Registration Form Card */}
            <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="font-extrabold text-base mb-1">Reserve Your Spot</h3>
              <p className="text-[10px] text-[#5c7075] leading-relaxed mb-6">
                Limited seats available. Certification included upon completion.
              </p>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full name */}
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

                {/* Email */}
                <div>
                  <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Work Email</label>
                  <input
                    type="email"
                    placeholder="john@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent transition-all"
                  />
                </div>

                {/* Experience Dropdown */}
                <div>
                  <label className="text-[10px] font-bold text-[#5c7075] block mb-1">Experience Level</label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] focus:border-transparent cursor-pointer transition-all"
                  >
                    <option>Beginner (&lt;1 Year)</option>
                    <option>Intermediate (1-3 Years)</option>
                    <option>Advanced (3-5 Years)</option>
                    <option>Expert (5+ Years)</option>
                  </select>
                </div>

                {/* Alert statuses */}
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
                    <span>Registration completed successfully! Check your inbox for summit instructions.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#006655] hover:bg-[#004d40] text-white py-2.5 px-4 rounded-xl text-xs transition-all shadow-sm font-bold flex items-center justify-center gap-1.5"
                >
                  Complete Registration
                </button>
              </form>

              <span className="text-[9px] text-[#5c7075] font-semibold text-center block mt-4 select-none">
                By registering, you agree to our <Link to="/terms" className="underline">Terms of Service</Link>.
              </span>
            </div>

            {/* Group discounts card */}
            <div className="border border-[#006655]/15 dark:border-[#00a88a]/20 bg-slate-50/50 rounded-3xl p-6 select-none">
              <h4 className="font-bold text-xs mb-1.5">Group Discounts</h4>
              <p className="text-[10px] text-[#5c7075] leading-relaxed mb-4">
                Registering for a team of 5 or more? Contact our partnership team for a 20% discount code.
              </p>
              <a href="#sales" className="text-[#006655] hover:underline font-bold text-xs flex items-center gap-1">
                Contact Sales &rarr;
              </a>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
export default EventDetails;
