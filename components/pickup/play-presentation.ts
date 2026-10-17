import type { PublicSession } from '@/lib/pickup/discovery';
import { palette } from '../../constants/design.ts';

// Presentation only: closed states remain readable and never imply a join action.
export function sportsSessionStatus(game: Pick<PublicSession, 'state' | 'available_places'>) {
  if (game.state === 'cancelled') return { label: 'Cancelado', backgroundColor: palette.error, color: palette.lightError };
  if (game.state === 'completed') return { label: 'Finalizado', backgroundColor: palette.raised, color: palette.cream };
  if (game.state === 'started') return { label: 'Iniciado', backgroundColor: palette.legacyPrimary, color: palette.navy };
  if (!game.available_places) return { label: 'Completo', backgroundColor: palette.warning, color: palette.navy };
  return { label: 'Abierto', backgroundColor: palette.success, color: palette.navy };
}

