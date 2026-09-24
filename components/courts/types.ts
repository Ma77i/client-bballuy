import type { Court, Coordinate } from '@/lib/courts/catalog';
export type CourtMapProps = { courts: Court[]; location: Coordinate | null; onSelect: (id: string) => void };
