const { test } = require('node:test');
const assert = require('node:assert/strict');
const { sessionStatus, scheduleText } = require('../components/pickup/presentation.ts');
const { errorText } = require('../components/pickup/error-copy.ts');

test('display status distinguishes full/open from lifecycle-closed invitations', () => {
  assert.equal(sessionStatus({ state: 'open', available_places: 0 }), 'Completa');
  assert.equal(sessionStatus({ state: 'open', available_places: 1 }), 'Abierta');
  assert.equal(sessionStatus({ state: 'started', available_places: 0 }), 'Iniciada · actividad reportada');
  assert.equal(sessionStatus({ state: 'cancelled', available_places: 0 }), 'Cancelada');
  assert.equal(sessionStatus({ state: 'completed', available_places: 0 }), 'Finalizada');
  assert.equal(sessionStatus({ state: 'unknown', available_places: 1 }), 'No disponible');
});
test('planned time copy does not claim an open invitation automatically started', () => {
  const game = { state: 'open', timing: 'future', scheduled_at: '2026-10-13T18:00:00Z', started_at: null };
  assert.match(scheduleText(game, Date.parse('2026-10-14T18:00:00Z')), /La hora planificada ya pasó/);
  assert.equal(game.state, 'open');
});
test('Spanish error copy retains uncertain replay, changed-state and bounded-count guidance', () => {
  assert.match(errorText('Your change may be saved. Retry to confirm your current place.'), /puede estar guardado.*comprobación/);
  assert.match(errorText('Places or game status changed. Refresh before trying again.'), /cambiaron.*Actualizá/);
  assert.equal(errorText('Choose 1–10 players, including you if playing.'), 'Elegí entre 1 y 10 participantes, incluyéndote si jugás.');
  assert.equal(errorText('No pudimos cargar las canchas.'), 'No pudimos cargar las canchas.');
});
