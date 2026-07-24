import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface EventType {
  _id: string;
  title: string;
  eventType: 'workshop' | 'hackathon' | 'meetup' | 'webinar' | 'training';
  date: string;
  time: string;
  mode: 'online' | 'physical' | 'hybrid';
  participants: Array<{ name: string; email: string }>;
  maxParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchDashboardEvents = async () => {
      try {
        const res = await fetch('/api/events/dashboard');
        if (res.ok) {
          const data = await res.json();
          setEvents(data.data);
          setFilteredEvents(data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardEvents();
  }, []);

  // Search filter
  useEffect(() => {
    if (!search.trim()) {
      setFilteredEvents(events);
      return;
    }
    const q = search.toLowerCase();
    const result = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.eventType.toLowerCase().includes(q) ||
        e.mode.toLowerCase().includes(q)
    );
    setFilteredEvents(result);
  }, [search, events]);

  const getStatusBadge = (status: string) => {
    const maps: Record<string, string> = {
      upcoming: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      ongoing: 'bg-blue-50 text-blue-600 border-blue-100',
      completed: 'bg-slate-100 text-slate-500 border-slate-200',
    };
    return `px-2 py-0.5 border text-[9px] font-bold rounded-lg ${maps[status] || 'bg-slate-150 text-slate-650'}`;
  };

  const getBadgeClass = (type: string) => {
    const maps: Record<string, string> = {
      workshop: 'bg-[#4285F4]/10 text-[#4285F4]',
      hackathon: 'bg-[#e6f7f8] text-[#006655]',
      meetup: 'bg-[#FBBC05]/10 text-[#a87f04]',
      webinar: 'bg-[#ea4335]/10 text-[#ea4335]',
    };
    return `px-2 py-0.5 text-[9px] font-bold rounded uppercase ${maps[type] || 'bg-slate-100 text-slate-600'}`;
  };

  const calculateTotalRegistrations = () => {
    return events.reduce((sum, e) => sum + (e.participants ? e.participants.length : 0), 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-[#5c7075] font-semibold">Loading events dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Event Management</h1>
          <p className="text-xs text-[#5c7075]">Manage, schedule, and analyze all platform-wide developer events.</p>
        </div>

        <Link
          to="/dashboard/events/new"
          className="bg-[#006655] hover:bg-[#004d40] text-white py-2.5 px-6 rounded-xl font-bold text-xs transition-colors shadow-sm"
        >
          + Create Event
        </Link>
      </div>

      {/* Stats Cards Row (matching AdminPanel-EventManagement.png layouts) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
        {/* Card 1 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Total Registrations</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">{calculateTotalRegistrations().toLocaleString()}</span>
        </div>

        {/* Card 2 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Upcoming Events</span>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">
            {events.filter((e) => e.status === 'upcoming').length}
          </span>
        </div>

        {/* Card 3 */}
        <div className="border border-slate-100 bg-white rounded-3xl p-6 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-[#5c7075] uppercase tracking-wider">Conversion Rate</span>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">&bull; High</span>
          </div>
          <span className="text-2xl font-extrabold block leading-tight">18.4%</span>
        </div>
      </div>

      {/* Table view */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        {/* Search & Filter Header bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="p-16 text-center select-none flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#006655] flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-extrabold text-base mb-1">No events scheduled</h3>
            <p className="text-xs text-[#5c7075]">When you create community events, workshops, or mixers, they will list here.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs font-medium text-[#5c7075]">
            <thead className="bg-slate-50 border-b border-slate-100 text-[#091e22] font-bold select-none text-[10px] uppercase">
              <tr>
                <th className="p-4 pl-6">Event Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Registrations</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEvents.map((event) => (
                <tr key={event._id} className="hover:bg-slate-50/30 transition-colors">
                  {/* Title */}
                  <td className="p-4 pl-6 font-bold text-[#091e22]">
                    <Link to={`/events/${event._id}`} className="hover:underline hover:text-[#006655]">
                      {event.title}
                    </Link>
                  </td>

                  {/* Type */}
                  <td className="p-4 select-none">
                    <span className={getBadgeClass(event.eventType)}>{event.eventType}</span>
                  </td>

                  {/* Date */}
                  <td className="p-4">
                    <span className="font-bold block text-[#091e22]">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-[10px] text-slate-400">{event.time}</span>
                  </td>

                  {/* Status */}
                  <td className="p-4 select-none">
                    <span className={getStatusBadge(event.status)}>{event.status.toUpperCase()}</span>
                  </td>

                  {/* Registrations */}
                  <td className="p-4">
                    <div className="flex items-center gap-2 select-none">
                      <span className="font-bold text-[#091e22]">
                        {event.participants ? event.participants.length : 0}
                      </span>
                      <span className="text-slate-400">/ {event.maxParticipants || '∞'}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right select-none">
                    <Link to={`/dashboard/events/edit/${event._id}`} className="text-slate-400 hover:text-[#006655] font-bold text-xs" title="Edit">
                      ✏️ Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};
export default MyEvents;
