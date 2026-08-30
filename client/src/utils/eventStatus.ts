export type EventStatus = 'upcoming' | 'ongoing' | 'completed';

export interface EventStatusLike {
  date: string;
  time?: string;
  status: EventStatus;
  effectiveStatus?: EventStatus;
}

// The event's scheduled start time as a UTC instant, matching the server's
// computation from the stored date + "HH:MM" time string.
export const getEventStartTime = (event: EventStatusLike): number => {
  const [y, mo, d] = (event.date || '').slice(0, 10).split('-').map(Number);
  let h = 0;
  let m = 0;
  if (event.time) {
    const [hh, mm] = event.time.split(':').map(Number);
    h = hh || 0;
    m = mm || 0;
  }
  return Date.UTC(y || 0, (mo || 1) - 1, d || 1, h, m);
};

// Prefer the server-computed status, otherwise derive it from the datetime so a
// past event is never presented as "upcoming".
export const getEffectiveStatus = (event: EventStatusLike): EventStatus => {
  if (event.effectiveStatus) return event.effectiveStatus;
  if (event.status === 'completed') return 'completed';
  if (Date.now() >= getEventStartTime(event)) return 'completed';
  return event.status === 'ongoing' ? 'ongoing' : 'upcoming';
};

export const isRegistrationOpen = (event: EventStatusLike): boolean => {
  return (
    getEffectiveStatus(event) === 'upcoming' &&
    Date.now() < getEventStartTime(event)
  );
};

export const getStatusBadgeClass = (status: EventStatus): string => {
  const maps: Record<EventStatus, string> = {
    upcoming: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    ongoing: 'bg-blue-50 text-blue-600 border-blue-100',
    completed: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return maps[status];
};