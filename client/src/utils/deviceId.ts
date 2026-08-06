const DEVICE_ID_KEY = 'guildcode_device_id';

// Holds the id for the lifetime of the page so anonymous actions stay
// consistent even when localStorage is unavailable (e.g. private browsing).
let cachedDeviceId: string | null = null;

const generateFallbackId = (): string =>
  `device-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

// Persistent anonymous identifier so public actions (e.g. liking a project)
// work without requiring an account. Never throws: crypto.randomUUID is only
// available in secure contexts (HTTPS/localhost), so guard it explicitly and
// fall back to a non-crypto id on insecure origins (e.g. phone on a LAN IP).
export const getDeviceId = (): string => {
  if (cachedDeviceId) return cachedDeviceId;

  let id = '';
  try {
    id = localStorage.getItem(DEVICE_ID_KEY) || '';
  } catch {
    id = '';
  }

  if (!id) {
    try {
      id =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : generateFallbackId();
    } catch {
      id = generateFallbackId();
    }
    try {
      localStorage.setItem(DEVICE_ID_KEY, id);
    } catch {
      // storage unavailable — keep the in-memory id for this session
    }
  }

  cachedDeviceId = id;
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
