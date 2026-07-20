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
    const configs: Record<string, { label: string; icon: string; badgeClass: string; iconClass: string }> = {
      project_mention: {
        label: 'PROJECT MENTION',
        icon: '@',
        badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        iconClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      },
      application_update: {
        label: 'APPLICATION UPDATE',
        icon: '↑',
        badgeClass: 'bg-blue-50 text-blue-600 border-blue-100',
        iconClass: 'bg-blue-50 text-blue-600 border-blue-100',
      },
      collaboration_request: {
        label: 'COLLABORATION REQUEST',
        icon: '🤝',
        badgeClass: 'bg-purple-50 text-purple-600 border-purple-100',
        iconClass: 'bg-purple-50 text-purple-600 border-purple-100',
      },
      system_announcement: {
        label: 'SYSTEM ANNOUNCEMENT',
        icon: '📢',
        badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
        iconClass: 'bg-slate-50 text-slate-650 border-slate-200',
      },
      event_update: {
        label: 'EVENT UPDATE',
        icon: '📅',
        badgeClass: 'bg-amber-50 text-amber-600 border-amber-100',
        iconClass: 'bg-amber-50 text-amber-600 border-amber-100',
      },
      application_received: {
        label: 'APPLICATION RECEIVED',
        icon: '🤝',
        badgeClass: 'bg-purple-50 text-purple-600 border-purple-100',
        iconClass: 'bg-purple-50 text-purple-600 border-purple-100',
      },
      application_accepted: {
        label: 'APPLICATION ACCEPTED',
        icon: '🎉',
        badgeClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        iconClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      },
      application_rejected: {
        label: 'APPLICATION REJECTED',
        icon: '❌',
        badgeClass: 'bg-red-50 text-red-600 border-red-100',
        iconClass: 'bg-red-50 text-red-600 border-red-100',
      },
      collab_closed: {
        label: 'COLLABORATION CLOSED',
        icon: '🔒',
        badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
        iconClass: 'bg-slate-50 text-slate-650 border-slate-200',
      },
    };
    return configs[type] || {
      label: 'ALERT',
      icon: '🔔',
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
            className="flex items-center gap-1 text-[#006655] hover:underline font-bold text-xs"
          >
            <span>✓</span> Mark all as read
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

      {/* Notification List cards */}
      {filteredNotifications.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-3xl p-16 text-center bg-white shadow-sm select-none">
          <span className="text-4xl block mb-4">🔔</span>
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
