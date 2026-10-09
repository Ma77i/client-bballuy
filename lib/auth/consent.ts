type Storage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
};
type Consent = { tos: true; privacy: true; version: string; acceptedAt: string };

// Development acknowledgements retain the sync contract, with a distinct version.
export async function saveDevelopmentConsent(storage: Pick<Storage, 'setItem'>,
  termsAcknowledged: boolean, privacyAcknowledged: boolean) {
  if (!termsAcknowledged || !privacyAcknowledged) throw new Error('Both acknowledgements are required.');
  const draft: Consent = { tos: true, privacy: true, version: 'dev-preview-1',
    acceptedAt: new Date().toISOString() };
  await storage.setItem('pendingConsent', JSON.stringify(draft));
}
type ConsentRow = {
  user_id: string; tos_version: string; privacy_version: string;
  accepted_at: string; source: string;
};

function parse(raw: string): Consent {
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || !('tos' in value) || value.tos !== true ||
      !('privacy' in value) || value.privacy !== true ||
      !('version' in value) || typeof value.version !== 'string' || !value.version.trim() ||
      !('acceptedAt' in value) || typeof value.acceptedAt !== 'string' ||
      !Number.isFinite(Date.parse(value.acceptedAt))) throw new Error('Invalid consent');
  return value as Consent;
}

export function createConsentSync(storage: Storage, scope: string,
  write: (row: ConsentRow) => PromiseLike<{ error: unknown }>) {
  const key = (email: string) => `pendingConsent:${scope}:${email.trim().toLowerCase()}`;
  return {
    async prepare(email: string) {
      try {
        const raw = await storage.getItem('pendingConsent');
        if (!raw) return;
        parse(raw);
        await storage.setItem(key(email), raw);
        // Consume the unbound draft before Auth can emit SIGNED_IN.
        if (await storage.getItem('pendingConsent') === raw) await storage.removeItem('pendingConsent');
      } catch {
        throw new Error('Unable to prepare your consent. Go back to Privacy & Terms and accept again.');
      }
    },
    async sync(userId: string, email?: string) {
      if (!email) return;
      try {
        const storageKey = key(email);
        const raw = await storage.getItem(storageKey);
        if (!raw) return;
        const consent = parse(raw);
        const { error } = await write({ user_id: userId, tos_version: consent.version,
          privacy_version: consent.version, accepted_at: consent.acceptedAt, source: 'app' });
        if (error) throw error;
        if (await storage.getItem(storageKey) === raw) await storage.removeItem(storageKey);
      } catch {
        const error = new Error('Unable to save your consent. Check your connection and retry. Your account is already created.');
        error.name = 'ConsentSyncError';
        throw error;
      }
    },
  };
}
