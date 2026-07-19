import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface EventType {
  _id: string;
  title: string;
  description: string;
  eventType: 'workshop' | 'hackathon' | 'meetup' | 'webinar' | 'training';
  date: string;
  time: string;
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

  // Timer ticker simulation
  const [timeLeft, setTimeLeft] = useState({
    days: 8,
    hours: 14,
    minutes: 22,
    seconds: 45,
  });

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

    const ticker = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        clearInterval(ticker);
        return prev;
      });
    }, 1000);

    return () => clearInterval(ticker);
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
      <div className="max-w-md mx-auto my-20 p-8 border border-dashed border-slate-200 rounded-2xl text-center bg-white shadow-sm">
        <span className="text-4xl block mb-4">📅</span>
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
                <span>📅</span> Date: {formatEventDate(event.date)}
              </div>
              <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                <span>⏰</span> Time: {event.time}
              </div>
            </div>
          </div>

          {/* Countdown Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md w-full max-w-sm flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Starts In</span>
            <div className="grid grid-cols-4 gap-4 text-center w-full mb-6">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-[#091e22]">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[9px] font-bold text-[#5c7075] uppercase mt-1">Days</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-[#091e22]">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[9px] font-bold text-[#5c7075] uppercase mt-1">Hours</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-[#091e22]">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[9px] font-bold text-[#5c7075] uppercase mt-1">Mins</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-red-500 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[9px] font-bold text-[#5c7075] uppercase mt-1">Secs</span>
              </div>
            </div>
            <button className="w-full bg-[#006655] hover:bg-[#004d40] text-white py-2.5 px-4 rounded-xl text-xs transition-all font-bold flex items-center justify-center gap-1.5 shadow-sm">
              <span>📅</span> Add to Calendar
            </button>
          </div>

        </div>
      </section>

      {/* 2. Content Sections Splitting Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left panel (takes 8 columns) */}
          <div className="lg:col-span-8">
            {/* Featured Speakers */}
            <section className="mb-12">
              <h3 className="font-extrabold text-xl mb-6 pb-2 border-b border-slate-50">Featured Speakers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Speaker 1 */}
                <div className="border border-slate-100 p-5 rounded-2xl bg-white shadow-sm flex items-start gap-4 h-36">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-100">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Dr. Elena Volkov</h4>
                    <span className="text-[10px] text-[#006655] font-bold block mb-1">Principal Systems Engineer</span>
                    <p className="text-[10px] text-[#5c7075] leading-relaxed">Ex-Mozilla, Lead Contributor to the Rust Memory Safety Working Group.</p>
                  </div>
                </div>

                {/* Speaker 2 */}
                <div className="border border-slate-100 p-5 rounded-2xl bg-white shadow-sm flex items-start gap-4 h-36">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-100">
                    <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Marcus Thorne</h4>
                    <span className="text-[10px] text-[#006655] font-bold block mb-1">Distinguished Architect</span>
                    <p className="text-[10px] text-[#5c7075] leading-relaxed">Creator of OpenSource performance profiling tools used by Fortune 500 companies.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Agenda */}
            <section className="mb-12">
              <h3 className="font-extrabold text-xl mb-6 pb-2 border-b border-slate-50">The Workshop Agenda</h3>
              <div className="space-y-4 select-none">
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex gap-6">
                  <span className="text-xs font-bold text-[#006655] shrink-0 w-12">14:00</span>
                  <div>
                    <h5 className="font-bold text-xs mb-0.5">Modern Rust Paradigms</h5>
                    <p className="text-[11px] text-[#5c7075] leading-relaxed">Setting the stage: Why Rust in 2026? Overview of the latest stable features and system-level performance benchmarks.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex gap-6">
                  <span className="text-xs font-bold text-[#006655] shrink-0 w-12">15:15</span>
                  <div>
                    <h5 className="font-bold text-xs mb-0.5">The Ownership Deep Dive</h5>
                    <p className="text-[11px] text-[#5c7075] leading-relaxed">Breaking down lifetime elision, smart pointers, and zero-cost abstractions in complex microservice architectures.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex gap-6">
                  <span className="text-xs font-bold text-[#006655] shrink-0 w-12">16:30</span>
                  <div>
                    <h5 className="font-bold text-xs mb-0.5">Coffee & Networking Break</h5>
                    <p className="text-[11px] text-[#5c7075] leading-relaxed">Virtual breakout rooms for specific niche discussions (Embedded, WebAssembly, Game Dev).</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl flex gap-6">
                  <span className="text-xs font-bold text-[#006655] shrink-0 w-12">17:00</span>
                  <div>
                    <h5 className="font-bold text-xs mb-0.5">Advanced Concurrency Patterns</h5>
                    <p className="text-[11px] text-[#5c7075] leading-relaxed">Async/Await under the hood, Pinning, and building thread-safe shared state without the overhead.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Requirements checks */}
            <section className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 md:p-8 select-none">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                💻 Technical Requirements
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs text-[#5c7075] font-semibold">
                <div className="flex items-center gap-2">🟢 Rust 1.75+ Stable installed</div>
                <div className="flex items-center gap-2">🟢 Basic familiarity with Cargo</div>
                <div className="flex items-center gap-2">🟢 Docker Desktop (for lab exercises)</div>
                <div className="flex items-center gap-2">🟢 GitHub account for Repo access</div>
                <div className="flex items-center gap-2">🟢 VS Code with rust-analyzer</div>
                <div className="flex items-center gap-2">🟢 Stable internet connection</div>
              </div>
            </section>
          </div>

          {/* Right panel (takes 4 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Registration Form Card */}
            <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm">
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
                  <div className="bg-red-50 text-red-600 border border-red-150 p-3 rounded-xl text-[10px] leading-relaxed">
                    ⚠️ {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="bg-green-50 text-green-700 border border-green-150 p-3 rounded-xl text-[10px] leading-relaxed">
                    ✅ Registration completed successfully! Check your inbox for summit instructions.
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
            <div className="border border-slate-100 bg-slate-50/50 rounded-3xl p-6 select-none">
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
