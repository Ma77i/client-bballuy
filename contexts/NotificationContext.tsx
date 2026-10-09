import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { backendScope } from '@/lib/backend/supabase';
import { createNotificationStore, notificationKey, type Notification } from '@/lib/auth/notifications';

type NotificationContextType = Pick<ReturnType<typeof createNotificationStore>,
  'addNotification' | 'markAsRead' | 'markAllAsRead' | 'clearNotifications'> & {
  notifications: Notification[]; unreadCount: number;
};
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function ScopedNotifications({ owner, children }: { owner: string | null; children: ReactNode }) {
  const [store] = useState(() => createNotificationStore(AsyncStorage,
    owner ? notificationKey(backendScope, owner) : null));
  const notifications = useSyncExternalStore(store.subscribe, store.snapshot, store.snapshot);
  useEffect(() => store.start(), [store]);
  return <NotificationContext.Provider value={{ notifications,
    unreadCount: notifications.filter(row => !row.isRead).length,
    addNotification: store.addNotification, markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead, clearNotifications: store.clearNotifications,
  }}>{children}</NotificationContext.Provider>;
}
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const owner = session?.user.id ?? null;
  return <ScopedNotifications key={owner ?? 'signed-out'} owner={owner}>{children}</ScopedNotifications>;
}
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
}
