const DEVICE_ID_KEY = 'guildcode_device_id';

// Persistent anonymous identifier so public actions (e.g. liking a project)
// work without requiring an account.
export const getDeviceId = (): string => {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `device-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
};

// Identity used to read/mirror likes in UI state: a registered user's id, or
// the device-scoped id stored on the server for anonymous visitors.
export const getLikerId = (userId?: string | null): string => {
  if (userId) return userId;
  return `device:${getDeviceId()}`;
};

export const isLikedBy = (
  likes: unknown[] | undefined | null,
  likerId: string | undefined | null
): boolean => {
  if (!likerId) return false;
  return (likes || []).some((id: any) => id.toString() === likerId);
};
