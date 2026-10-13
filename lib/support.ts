export function supportDraft(email: string | undefined) {
  if (!email || email.length > 254 || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) return null;
  const subject = 'BBallUY problem report';
  const body = 'What happened?\n\nSteps to reproduce:\n\nExpected result:\n\nDevice and app version (optional):\n';
  return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
export async function openSupportDraft(email: string | undefined, openURL: (url: string) => Promise<unknown>) {
  const url = supportDraft(email);
  if (!url) throw new Error('Support contact unavailable.');
  await openURL(url);
}
