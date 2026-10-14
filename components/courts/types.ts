import type { Court, Coordinate } from '@/lib/courts/catalog';
import type { Ref } from 'react';
export type MapFocusHandle = { focusMarker(id: string): boolean };
export type MapRegion = Coordinate & { latitudeDelta: number; longitudeDelta: number };
export type CourtMapProps = { courts: Court[]; location: Coordinate | null; onSelect: (id: string) => void;
  selectedId: string | null; camera: MapRegion | null; onCamera(region: MapRegion): void; onDismiss(): void; focused?: boolean;
  focusRef?: Ref<MapFocusHandle>; focusRegion?: MapRegion | null; onFocusRegionApplied?(): void };
