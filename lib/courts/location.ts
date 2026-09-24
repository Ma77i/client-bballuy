import type { Coordinate } from './catalog';
export type LocationResult = { point: Coordinate; message: null } | { point: null; message: string };
export async function locateUser(requestPermission: () => Promise<{ granted: boolean }>,
  getPosition: () => Promise<{ coords: Coordinate }>): Promise<LocationResult> {
  try {
    if (!(await requestPermission()).granted) return { point: null, message: 'Location permission was not granted. You can still browse all courts.' };
    const { coords } = await getPosition();
    if (!Number.isFinite(coords.latitude) || Math.abs(coords.latitude) > 90 ||
      !Number.isFinite(coords.longitude) || Math.abs(coords.longitude) > 180) throw new Error('Invalid location');
    return { point: { latitude: coords.latitude, longitude: coords.longitude }, message: null };
  } catch {
    return { point: null, message: 'Location is unavailable. You can still browse all courts.' };
  }
}
