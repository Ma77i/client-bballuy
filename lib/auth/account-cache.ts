import { QueryClient } from '@tanstack/react-query';

export const accountQueryKey = (owner: string | null, resource: string) =>
  ['account', owner, resource] as const;

// A fresh cache per mounted identity also isolates mutations and unscoped legacy queries.
export function createAccountCache() {
  return new QueryClient();
}

export function disposeAccountCache(client: QueryClient) {
  void client.cancelQueries();
  client.clear();
}
