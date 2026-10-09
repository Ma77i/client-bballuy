import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { NotificationProvider } from './NotificationContext';
import { createAccountCache, disposeAccountCache } from '@/lib/auth/account-cache';

function AccountScope({ children }: { children: ReactNode }) {
  const [client] = useState(createAccountCache);
  useEffect(() => () => disposeAccountCache(client), [client]);
  return <QueryClientProvider client={client}>
    <NotificationProvider>{children}</NotificationProvider>
  </QueryClientProvider>;
}

export default function AccountDataProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  // Remount synchronously: no frame of the previous account's local screen state.
  return <AccountScope key={session?.user.id ?? 'signed-out'}>{children}</AccountScope>;
}
