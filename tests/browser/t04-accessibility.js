// Presentation checks on real local account/queries; browser stress is not Dynamic Type.
async (page) => {
  const fixture = await page.evaluate(() => JSON.parse(sessionStorage.getItem('t04-review-fixtures')));
  if (!fixture) throw Error('Run local setup first');
  const checks = [];
  function check(value, label) { if (!value) throw Error(label); checks.push(label); }
  await page.goto('http://localhost:8090/my-courts');
  await page.getByRole('button', { name: 'Ver cancha: Parque Rodo', exact: true }).waitFor();
  let release, requests = 0;
  const held = new Promise(resolve => { release = resolve; });
  const handler = async route => {
    if (route.request().method() === 'GET') { requests++; await held; }
    await route.continue();
  };
  await page.route('**/rest/v1/court_memberships*', handler);
  await page.getByRole('button', { name: 'Actualizar', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('[aria-label="Actualizar"]')?.getAttribute('aria-busy') === 'true');
  check(await page.getByRole('button', { name: 'Actualizar', exact: true }).isDisabled(), 'Refresh busy state is accessible and blocks duplicate activation');
  await page.getByRole('button', { name: 'Actualizar', exact: true }).click({ force: true });
  check(requests === 1, 'Blocked refresh does not cancel/reissue the held read');
  release();
  await page.waitForFunction(() => document.querySelector('[aria-label="Actualizar"]')?.getAttribute('aria-busy') === 'false');
  await page.unroute('**/rest/v1/court_memberships*', handler);
  await page.getByRole('button', { name: 'Ver cancha: Parque Rodo', exact: true }).click();
  await page.getByRole('button', { name: 'Quitar de Mis canchas', exact: true }).click();
  await page.getByRole('button', { name: 'Agregar a Mis canchas', exact: true }).waitFor();
  let releaseWrite;
  const heldWrite = new Promise(resolve => { releaseWrite = resolve; });
  const writeHandler = async route => {
    if (route.request().method() === 'POST') await heldWrite;
    await route.continue();
  };
  await page.route('**/rest/v1/court_memberships*', writeHandler);
  await page.getByRole('button', { name: 'Agregar a Mis canchas', exact: true }).click();
  await page.getByRole('button', { name: 'Confirmando cambio', exact: true }).waitFor();
  check(await page.getByRole('button', { name: 'Confirmando cambio', exact: true }).isDisabled(), 'Membership pending is busy/disabled before server completion');
  check(await page.getByRole('button', { name: 'Quitar de Mis canchas', exact: true }).count() === 0, 'Pending membership cannot announce or offer leave');
  releaseWrite();
  await page.getByRole('button', { name: 'Quitar de Mis canchas', exact: true }).waitFor();
  await page.unroute('**/rest/v1/court_memberships*', writeHandler);
  await page.goto('http://localhost:8090/profile');
  await page.getByText('Cuenta de prueba A', { exact: true }).waitFor();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(150);
  const action = page.getByRole('button', { name: 'Mis canchas', exact: true });
  const bounds = await action.boundingBox();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down(); await page.waitForTimeout(150);
  const transform = await action.evaluate(element => getComputedStyle(element).transform);
  await page.mouse.move(0, 0); await page.mouse.up();
  check(transform === 'none' || transform.startsWith('matrix(1, 0, 0, 1,'), 'Live reduced motion prevents press scale');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 320, height: 568 });
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Narrow profile has no horizontal overflow');
  await page.getByRole('button', { name: 'Mis canchas', exact: true }).click();
  await page.getByRole('button', { name: 'Ver cancha: Parque Rodo', exact: true }).waitFor();
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Narrow My Courts reflows without fabricated facts');
  await page.getByRole('button', { name: 'Ver cancha: Parque Rodo', exact: true }).click();
  await page.getByRole('button', { name: 'Quitar de Mis canchas', exact: true }).waitFor();
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Narrow detail keeps full attributes without overflow');
  await page.setViewportSize({ width: 390, height: 844 });
  return { passed: checks.length, checks };
}
