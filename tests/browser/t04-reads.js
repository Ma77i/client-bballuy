// Real local routes with transport failures only; never modifies catalog/game data.
async (page) => {
  const checks = [];
  function check(value, label) { if (!value) throw Error(label); checks.push(label); }
  const fail = async route => route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ message: 'Local test read failure' }) });
  await page.goto('http://localhost:8090/map');
  await page.getByRole('button', { name: 'Ver cancha: Parque Rodo', exact: true }).click();
  await page.getByRole('button', { name: 'Quitar de Mis canchas', exact: true }).waitFor();
  await page.route('**/rest/v1/court_catalog*', fail);
  await page.reload();
  await page.getByRole('button', { name: 'Reintentar', exact: true }).waitFor({ timeout: 20000 });
  check(await page.getByText('No pudimos cargar esta cancha', { exact: true }).isVisible(), 'Catalog failure is readable and retryable');
  await page.unroute('**/rest/v1/court_catalog*', fail);
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await page.getByRole('button', { name: 'Quitar de Mis canchas', exact: true }).waitFor();
  check(true, 'Catalog retry restores actual detail and community');
  await page.route('**/rest/v1/court_memberships*', fail);
  await page.reload();
  await page.getByRole('button', { name: 'Reintentar consulta', exact: true }).waitFor({ timeout: 20000 });
  check(await page.getByRole('button', { name: 'Quitar de Mis canchas', exact: true }).count() === 0, 'Membership read failure blocks stale action');
  await page.unroute('**/rest/v1/court_memberships*', fail);
  await page.getByRole('button', { name: 'Reintentar consulta', exact: true }).click();
  await page.getByRole('button', { name: 'Quitar de Mis canchas', exact: true }).waitFor();
  check(true, 'Membership read retry restores confirmed state');
  await page.route('**/rest/v1/pickup_session_catalog*', fail);
  await page.reload();
  await page.getByRole('button', { name: 'Reintentar actividad', exact: true }).waitFor();
  check(await page.getByText('No pudimos comprobar la actividad. Los reportes anteriores pueden estar desactualizados.', { exact: true }).isVisible(), 'Activity failure preserves stale-report warning');
  await page.unroute('**/rest/v1/pickup_session_catalog*', fail);
  await page.getByRole('button', { name: 'Reintentar actividad', exact: true }).click();
  await page.getByRole('button', { name: 'Reintentar actividad', exact: true }).waitFor({ state: 'hidden' });
  await page.getByText('No hay partidos reportados como jugando. Esto no confirma que la cancha esté vacía.', { exact: true }).waitFor();
  check(true, 'Activity retry does not invent court emptiness');
  await page.goto('http://localhost:8090/map');
  await page.getByRole('button', { name: 'Ver cancha: Palermo', exact: true }).click();
  await page.getByText('Iluminación: Sin registrar', { exact: true }).waitFor();
  check(true, 'Unknown lighting is not fabricated');
  await page.getByRole('button', { name: 'Organizar convocatoria', exact: true }).click();
  await page.waitForURL('**/organize/create?courtId=9a63055d-e78b-460c-aab7-30cbb1d867d9');
  check(true, 'Existing organizer handoff preserves exact court ID');
  await page.getByRole('link', { name: 'Go back', exact: true }).click();
  await page.getByText('Iluminación: Sin registrar', { exact: true }).waitFor();
  check(true, 'Existing organizer back restores real court detail');
  return { passed: checks.length, checks };
}
