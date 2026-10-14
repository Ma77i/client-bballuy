import type { PublicSession } from '@/lib/pickup/discovery';

// Display copy only. The server state and eligibility rules remain in lib/pickup.
export function sessionStatus(game: { state: string; available_places: number }) {
  if (game.state === 'started') return 'Iniciada · actividad reportada';
  if (game.state === 'cancelled') return 'Cancelada';
  if (game.state === 'completed') return 'Finalizada';
  if (game.state !== 'open') return 'No disponible';
  return game.available_places === 0 ? 'Completa' : 'Abierta';
}
export function dateText(value: string | number) {
  return new Date(value).toLocaleString('es-UY', { dateStyle: 'medium', timeStyle: 'short' });
}
export function scheduleText(game: PublicSession, now = Date.now()) {
  if (game.state === 'started') return `Inicio reportado: ${dateText(game.started_at!)}`;
  if (game.timing === 'now') return 'Para jugar ahora';
  return `${Date.parse(game.scheduled_at) <= now && game.state === 'open' ? 'La hora planificada ya pasó · ' : ''}${dateText(game.scheduled_at)}`;
}
