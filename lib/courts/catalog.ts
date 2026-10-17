import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../backend/database.types';
export type CatalogRow = Database['public']['Views']['court_catalog']['Row'];
export type Court = CatalogRow & { id: string; name: string; latitude: number; longitude: number };
export type Coordinate = { latitude: number; longitude: number };
export function validCoordinate(point: Coordinate) {
  return Number.isFinite(point.latitude) && Math.abs(point.latitude) <= 90 &&
    Number.isFinite(point.longitude) && Math.abs(point.longitude) <= 180;
}
export function validateCatalog(rows: CatalogRow[]): Court[] {
  const seen = new Set<string>();
  return rows.map(row => {
    if (!row.id || !row.name?.trim() || row.latitude === null || row.longitude === null ||
      !validCoordinate({ latitude: row.latitude, longitude: row.longitude }) || seen.has(row.id)) {
      throw new Error('The court catalog contains invalid data.');
    }
    seen.add(row.id);
    return { ...row, id: row.id, name: row.name, latitude: row.latitude, longitude: row.longitude };
  });
}
export function filterCourts(courts: Court[], search: string) {
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const term = normalize(search.trim());
  return courts.filter(court => normalize(court.name).includes(term));
}
export function catalogRegion(points: Coordinate[]) {
  if (!points.length) return { latitude: -34.9, longitude: -56.16, latitudeDelta: 0.1, longitudeDelta: 0.1 };
  const latitudes = points.map(p => p.latitude); const longitudes = points.map(p => p.longitude);
  const south = Math.min(...latitudes), north = Math.max(...latitudes);
  const west = Math.min(...longitudes), east = Math.max(...longitudes);
  return { latitude: (south + north) / 2, longitude: (west + east) / 2,
    latitudeDelta: Math.max(0.04, (north - south) * 1.9), longitudeDelta: Math.max(0.04, (east - west) * 1.9) };
}
export async function loadCatalog(client: SupabaseClient<Database>, signal?: AbortSignal) {
  let query = client.from('court_catalog').select('id,name,latitude,longitude,half_court,lighting,surface,notes,created_at').order('name');
  if (signal) query = query.abortSignal(signal);
  const { data, error } = await query;
  if (error) throw error;
  return validateCatalog(data ?? []);
}
