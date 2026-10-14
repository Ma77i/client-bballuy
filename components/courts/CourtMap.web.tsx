import { Notice } from '@/components/foundation/Primitives';
import type { CourtMapProps } from './types';
// Metro resolves this file on web; the native map package must never enter its graph.
export default function CourtMap(_props: CourtMapProps) {
  return <Notice kind="info">El mapa interactivo está disponible en la app móvil. Explorá las canchas en el listado.</Notice>;
}
