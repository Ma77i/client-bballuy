export type Notification = {
  id: string;
  type: 'event_invitation' | 'event_reminder' | 'chat_message' | 'team_update' | 'player_statistic';
  title: string; message: string; timestamp: Date; isRead: boolean;
  data?: Record<string, unknown>;
};
type Storage = { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void> };
const storageQueues = new WeakMap<Storage, Map<string, Promise<void>>>();
const types = new Set(['event_invitation', 'event_reminder', 'chat_message', 'team_update', 'player_statistic']);
export const notificationKey = (backend: string, owner: string) => `notifications:v1:${backend}:${owner}`;

function decode(raw: string | null): Notification[] {
  if (!raw) return [];
  const rows: unknown = JSON.parse(raw);
  if (!Array.isArray(rows)) throw new Error('Invalid notifications');
  return rows.map((row: unknown) => {
    if (!row || typeof row !== 'object' || !('id' in row) || typeof row.id !== 'string' ||
      !('type' in row) || typeof row.type !== 'string' || !types.has(row.type) ||
      !('title' in row) || typeof row.title !== 'string' ||
      !('message' in row) || typeof row.message !== 'string' ||
      !('isRead' in row) || typeof row.isRead !== 'boolean' ||
      !('timestamp' in row) || typeof row.timestamp !== 'string' || !Number.isFinite(Date.parse(row.timestamp))) {
      throw new Error('Invalid notification');
    }
    return { ...row, timestamp: new Date(row.timestamp) } as Notification;
  });
}

export function createNotificationStore(storage: Storage, key: string | null) {
  let rows: Notification[] = [];
  let active = false;
  let ready = false;
  let revision = 0;
  let queues = storageQueues.get(storage);
  if (!queues) { queues = new Map(); storageQueues.set(storage, queues); }
  const queue = queues;
  const pendingWrites = () => key ? queue.get(key) ?? Promise.resolve() : Promise.resolve();
  const listeners = new Set<() => void>();
  const publish = () => listeners.forEach(listener => listener());
  function update(change: (current: Notification[]) => Notification[]) {
    if (!key || !active || !ready) return;
    rows = change(rows); publish();
    const serialized = JSON.stringify(rows);
    // Preserve ordering even when the storage adapter completes writes slowly.
    const write = pendingWrites().then(() => storage.setItem(key, serialized))
      .catch(() => { console.error('Unable to save notifications.'); });
    queue.set(key, write);
    void write.then(() => { if (queue.get(key) === write) queue.delete(key); });
  }
  return {
    snapshot: () => rows,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    start() {
      active = true; ready = false; const version = ++revision;
      if (key) void pendingWrites().then(() => storage.getItem(key)).then(raw => {
        if (!active || revision !== version) return;
        rows = decode(raw); ready = true; publish();
      }).catch(() => { if (active && revision === version) console.error('Unable to load notifications.'); });
      return () => { active = false; ready = false; revision++; };
    },
    addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) {
      update(current => [{ ...notification, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: new Date(), isRead: false }, ...current]);
    },
    markAsRead(id: string) { update(current => current.map(row => row.id === id ? { ...row, isRead: true } : row)); },
    markAllAsRead() { update(current => current.map(row => ({ ...row, isRead: true }))); },
    clearNotifications() { update(() => []); },
    flushed: pendingWrites,
  };
}
