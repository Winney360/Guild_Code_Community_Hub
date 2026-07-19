import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
  isPublished: boolean;
}

export const CommunityEvents: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 4,
    minutes: 28,
    seconds: 40,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data.data);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();

    // Timer countdown ticker simulation
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        clearInterval(interval);
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getEventBadgeClass = (type: string) => {
    const maps: Record<string, string> = {
      workshop: 'bg-[#4285F4]/10 text-[#4285F4] border-[#4285F4]/20',
      hackathon: 'bg-[#e6f7f8] text-[#006655] border-[#006655]/20',
      meetup: 'bg-[#FBBC05]/10 text-[#a87f04] border-[#FBBC05]/20',
      webinar: 'bg-[#ea4335]/10 text-[#ea4335] border-[#ea4335]/20',
      training: 'bg-purple-50 text-purple-600 border-purple-150',
    };
    return maps[type] || 'bg-slate-150 text-slate-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-sans text-[#091e22]">
      
      {/* 1. Next Major Event (Hero Card Banner) */}
      <section className="bg-gradient-to-br from-[#e6f7f8] via-[#eef9fa] to-white border border-slate-100 rounded-3xl p-8 md:p-12 mb-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-sm relative overflow-hidden select-none">
        
        {/* Left Side: Major Details */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-[#006655]/10 rounded-full text-[10px] font-bold text-[#006655] shadow-sm mb-4">
            🌟 Next Major Event
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Global Hackathon <br />
            <span className="text-[#006655]">Summer '26</span>
          </h1>
          <p className="text-[#5c7075] text-sm md:text-base mb-8 leading-relaxed">
            Join 5,000+ developers worldwide to build the future of decentralized protocols. $100k in prizes, mentorship from industry legends, and fast-track membership application review.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-[#006655] hover:bg-[#004d40] text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm text-xs">
              Register Now
            </button>
            <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm text-xs">
              Add to Calendar
            </button>
          </div>
        </div>

        {/* Right Side: Countdown Timer */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-md w-full max-w-sm flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Starts In</span>
          <div className="grid grid-cols-4 gap-4 text-center w-full">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-[#091e22]">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[9px] font-bold text-[#5c7075] uppercase mt-1">Days</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-[#091e22]">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[9px] font-bold text-[#5c7075] uppercase mt-1">Hrs</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-[#091e22]">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[9px] font-bold text-[#5c7075] uppercase mt-1">Min</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-red-500 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[9px] font-bold text-[#5c7075] uppercase mt-1">Sec</span>
            </div>
          </div>
        </div>

      </section>

      {/* 2. Upcoming Events Grid Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 select-none">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Upcoming Events</h2>
            <p className="text-[#5c7075] text-xs">Explore workshops, keynotes, and mixers hosted by the community.</p>
          </div>
          
          {/* Grid/Calendar toggle buttons */}
          <div className="bg-slate-100 border border-slate-200/50 p-1 rounded-xl flex gap-1 text-[10px] font-bold">
            <button className="bg-white px-3 py-1.5 rounded-lg shadow-sm text-slate-700">Grid</button>
            <button className="px-3 py-1.5 rounded-lg text-slate-500 cursor-not-allowed">Calendar</button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs text-[#5c7075] font-semibold">Loading events...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="border border-slate-100 rounded-3xl p-6 bg-white shadow-sm hover:shadow transition-shadow flex flex-col justify-between h-[360px]"
              >
                <div>
                  {/* Category Tag & Mode */}
                  <div className="flex justify-between items-center mb-4 select-none">
                    <span className={`px-2 py-0.5 border text-[9px] font-bold rounded ${getEventBadgeClass(event.eventType)}`}>
                      {event.eventType.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      🛰️ {event.mode.toUpperCase()}
                    </span>
                  </div>

                  {/* Title & Date */}
                  <div className="mb-3">
                    <span className="text-[10px] text-[#006655] font-bold block mb-1">
                      {formatDate(event.date)} &bull; {event.time}
                    </span>
                    <Link to={`/events/${event._id}`} className="hover:underline">
                      <h3 className="font-extrabold text-base text-[#091e22] line-clamp-1 hover:text-[#006655] transition-colors">{event.title}</h3>
                    </Link>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#5c7075] leading-relaxed line-clamp-3 mb-6">
                    {event.description}
                  </p>
                </div>

                {/* Footer registration row */}
                <div className="border-t border-slate-50 pt-4 mt-auto flex items-center justify-between text-[10px] text-[#5c7075] select-none font-semibold">
                  <span>
                    👥 {event.participants ? event.participants.length : 0} registered
                  </span>
                  <Link
                    to={`/events/${event._id}`}
                    className="bg-[#006655] hover:bg-[#004d40] text-white py-1.5 px-4 rounded-lg font-bold text-xs"
                  >
                    Register
                  </Link>
                </div>
              </div>
            ))}

            {/* Custom Static Card: Host Your Own Event */}
            <div className="border border-dashed border-slate-200 rounded-3xl p-6 bg-slate-50/20 text-center flex flex-col items-center justify-center h-[360px]">
              <span className="text-3xl block mb-4">📅</span>
              <h3 className="font-bold text-base mb-1">Host Your Own Event?</h3>
              <p className="text-xs text-[#5c7075] max-w-xs mb-6">
                Submit a proposal to share your expertise or coordinate a local meet with the Guild Code community.
              </p>
              <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 px-5 rounded-xl transition-all shadow-sm">
                Submit Proposal
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 3. Stay Ahead of Curve Newsletter Banner */}
      <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 select-none shadow-md">
        <div className="max-w-md">
          <h3 className="text-2xl font-extrabold mb-2">Stay Ahead of the Curve</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Get early access to workshop registrations and exclusive community announcements delivered directly to your inbox.
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-3 flex-col sm:flex-row">
          <input
            type="email"
            placeholder="dev@guildcode.com"
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#006655] w-full sm:w-64"
          />
          <button className="bg-[#006655] hover:bg-[#004d40] text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm text-xs shrink-0 text-center">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};
export default CommunityEvents;
