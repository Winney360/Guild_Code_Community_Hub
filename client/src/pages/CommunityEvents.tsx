import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
  isPublished: boolean;
}

export const CommunityEvents: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

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
      
      {/* Header Title */}
      <div className="mb-10 text-center flex flex-col items-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
          Community <span className="text-[#006655]">Events</span>
        </h1>
        <p className="text-[#5c7075] text-base max-w-2xl leading-relaxed text-center">
          Discover workshops, hackathons, meetups, and webinars hosted by Guild Code members worldwide.
        </p>
      </div>

      {/* Upcoming Events Grid Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 select-none">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight mb-1">Explore Listings</h2>
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
                onClick={() => navigate(`/events/${event._id}`)}
                className="border border-[#006655]/15 dark:border-[#00a88a]/20 rounded-3xl p-6 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[360px] cursor-pointer group"
              >
                <div>
                  {/* Category Tag & Mode */}
                  <div className="flex justify-between items-center mb-4 select-none">
                    <span className={`px-2 py-0.5 border text-[9px] font-bold rounded ${getEventBadgeClass(event.eventType)}`}>
                      {event.eventType.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                      {event.mode.toUpperCase()}
                    </span>
                  </div>

                  {/* Title & Date */}
                  <div className="mb-3">
                    <span className="text-[10px] text-[#006655] font-bold block mb-1">
                      {formatDate(event.date)} &bull; {event.time} {event.timezone}
                    </span>
                    <h3 className="font-extrabold text-base text-[#091e22] line-clamp-1 group-hover:text-[#006655] transition-colors">{event.title}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#5c7075] leading-relaxed line-clamp-3 mb-6">
                    {event.description}
                  </p>
                </div>

                {/* Footer registration row */}
                <div className="border-t border-[#006655]/30 dark:border-[#00a88a]/40 pt-4 mt-auto flex items-center justify-between text-[10px] text-[#5c7075] select-none font-semibold">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {event.participants ? event.participants.length : 0} registered
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
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006655] flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
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
