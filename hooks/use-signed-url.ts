// hooks/use-signed-url.ts
import { useEffect, useState } from 'react';
import { getSignedUrl } from '@/lib/backend/storage';

export function useSignedUrl(storagePath?: string | null, ttl = 3600) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!storagePath) { if (alive) setUrl(null); return; }
      const signed = await getSignedUrl(storagePath, ttl);
      if (alive) setUrl(signed);
    })();
    return () => { alive = false; };
  }, [storagePath, ttl]);

  return url;
}
