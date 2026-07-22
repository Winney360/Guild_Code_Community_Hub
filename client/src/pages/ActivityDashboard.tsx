import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface NotificationType {
  _id: string;
  type: 'application_received' | 'application_accepted' | 'application_rejected' | 'collab_closed' | 'application_update' | 'project_mention' | 'system_announcement' | 'collaboration_request' | 'event_update';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export const ActivityDashboard: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'applications' | 'mentions' | 'system'>('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.data);
          setFilteredNotifications(data.data);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Handle Tab filter updates
  useEffect(() => {
    if (filterTab === 'all') {
      setFilteredNotifications(notifications);
      return;
    }

    const result = notifications.filter((item) => {
      if (filterTab === 'applications') {
        return (
          item.type === 'application_update' ||
          item.type === 'collaboration_request' ||
          item.type === 'application_received' ||
          item.type === 'application_accepted' ||
          item.type === 'application_rejected'
        );
      }
      if (filterTab === 'mentions') {
        return item.type === 'project_mention';
      }
      if (filterTab === 'system') {
        return item.type === 'system_announcement' || item.type === 'event_update' || item.type === 'collab_closed';
      }
      return true;
    });

    setFilteredNotifications(result);
  }, [filterTab, notifications]);

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
      });
      if (res.ok) {
        // Update local state reactively
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
      });
      if (res.ok) {
        // Update local state
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getTimeElapsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMin / 60);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} mins ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getNotificationConfig = (type: string) => {
    const configs: Record<string, { label: string; icon: React.ReactNode; badgeClass: string; iconClass: string }> = {
      project_mention: {
        label: 'PROJECT MENTION',
        icon: <span className="text-xs font-extrabold select-none">@</span>,
        badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        iconClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      },
      application_update: {
        label: 'APPLICATION UPDATE',
        icon: (
          <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
        ),
        badgeClass: 'bg-blue-50 text-blue-600 border-blue-100',
        iconClass: 'bg-blue-50 text-blue-600 border-blue-100',
      },
      collaboration_request: {
        label: 'COLLABORATION REQUEST',
        icon: (
          <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        ),
        badgeClass: 'bg-purple-50 text-purple-600 border-purple-100',
        iconClass: 'bg-purple-50 text-purple-600 border-purple-100',
      },
      system_announcement: {
        label: 'SYSTEM ANNOUNCEMENT',
        icon: (
          <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
          </svg>
        ),
        badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
        iconClass: 'bg-slate-50 text-slate-650 border-slate-200',
      },
      event_update: {
        label: 'EVENT UPDATE',
        icon: (
          <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        ),
        badgeClass: 'bg-amber-50 text-amber-600 border-amber-100',
        iconClass: 'bg-amber-50 text-amber-600 border-amber-100',
      },
      application_received: {
        label: 'APPLICATION RECEIVED',
        icon: (
          <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        ),
        badgeClass: 'bg-purple-50 text-purple-600 border-purple-100',
        iconClass: 'bg-purple-50 text-purple-600 border-purple-100',
      },
      application_accepted: {
        label: 'APPLICATION ACCEPTED',
        icon: (
          <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        ),
        badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        iconClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      },
      application_rejected: {
        label: 'APPLICATION REJECTED',
        icon: (
          <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        badgeClass: 'bg-red-50 text-red-600 border-red-100',
        iconClass: 'bg-red-50 text-red-600 border-red-100',
      },
      collab_closed: {
        label: 'COLLABORATION CLOSED',
        icon: (
          <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        ),
        badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
        iconClass: 'bg-slate-50 text-slate-650 border-slate-200',
      },
    };
    return configs[type] || {
      label: 'ALERT',
      icon: (
        <svg className="w-4.5 h-4.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      ),
      badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
      iconClass: 'bg-slate-50 text-slate-600 border-slate-200',
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <svg className="animate-spin h-8 w-8 text-[#006655]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-xs text-[#5c7075] font-semibold">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-[#091e22]">
      
      {/* Title */}
      <div className="flex justify-between items-center select-none">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Notifications</h1>
          <p className="text-xs text-[#5c7075]">Stay updated with your latest activities and system alerts.</p>
        </div>

        {/* Mark all as read */}
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 text-[#006655] hover:underline font-bold text-xs"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Tabs (matching designs/NotificationCenter.png) */}
      <div className="flex border-b border-slate-100 select-none">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-colors ${
            filterTab === 'all'
              ? 'border-[#006655] text-[#006655]'
              : 'border-transparent text-[#5c7075] hover:text-[#091e22]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterTab('applications')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-colors ${
            filterTab === 'applications'
              ? 'border-[#006655] text-[#006655]'
              : 'border-transparent text-[#5c7075] hover:text-[#091e22]'
          }`}
        >
          Application Updates
        </button>
        <button
          onClick={() => setFilterTab('mentions')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-colors ${
            filterTab === 'mentions'
              ? 'border-[#006655] text-[#006655]'
              : 'border-transparent text-[#5c7075] hover:text-[#091e22]'
          }`}
        >
          Project Mentions
        </button>
        <button
          onClick={() => setFilterTab('system')}
          className={`px-5 py-2.5 font-bold text-xs border-b-2 transition-colors ${
            filterTab === 'system'
              ? 'border-[#006655] text-[#006655]'
              : 'border-transparent text-[#5c7075] hover:text-[#091e22]'
          }`}
        >
          System Announcements
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-3xl p-16 text-center bg-white shadow-sm select-none flex flex-col items-center">
          <div className="bg-slate-50 text-slate-400 p-4 rounded-full border border-slate-100 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </div>
          <h3 className="font-extrabold text-base mb-1">All caught up!</h3>
          <p className="text-xs text-[#5c7075]">You have no notifications in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((item) => {
            const config = getNotificationConfig(item.type);
            return (
              <div
                key={item._id}
                onClick={() => handleMarkAsRead(item._id)}
                className={`border border-slate-100 rounded-3xl p-6 shadow-sm flex gap-5 items-start bg-white transition-all cursor-pointer hover:border-slate-200 ${
                  !item.read ? 'ring-1 ring-emerald-500/10' : ''
                }`}
              >
                {/* Left Type Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border select-none ${config.iconClass}`}>
                  {config.icon}
                </div>

                {/* Body Details */}
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1 select-none">
                    <span className={`px-2 py-0.5 border text-[8px] font-extrabold rounded-lg tracking-wider ${config.badgeClass}`}>
                      {config.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 font-semibold">{getTimeElapsed(item.createdAt)}</span>
                      {!item.read && (
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" title="Unread"></span>
                      )}
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-xs text-[#091e22] mb-1">{item.title}</h4>
                  <p className="text-xs text-[#5c7075] leading-relaxed mb-3">{item.message}</p>

                  {item.link && (
                    <Link
                      to={item.link}
                      className="text-[#006655] hover:underline font-bold text-[10px] inline-flex items-center gap-1 select-none"
                    >
                      View Details &rarr;
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
export default ActivityDashboard;
