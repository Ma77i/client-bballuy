export type MediaSource = number | { uri: string };
export function usableMediaSource(source?: MediaSource): MediaSource | undefined {
  if (typeof source === 'number') return Number.isInteger(source) && source > 0 ? source : undefined;
  const uri = typeof source?.uri === 'string' ? source.uri.trim() : undefined;
  return uri ? { uri } : undefined;
}
