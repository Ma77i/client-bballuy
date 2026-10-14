// Run after t04-setup.js in the same isolated local review browser.
async (page) => {
  const fixture = await page.evaluate(() => JSON.parse(sessionStorage.getItem('t04-review-fixtures')));
  if (!fixture || !/^http:\/\/(127\.0\.0\.1|localhost|192\.168\.1\.13):55431$/.test(fixture.origin)) throw Error('Local fixtures required');
  const court = '43fd5901-f3f6-4e5e-9ae6-d32c2dcc4764';
  const account = fixture.accounts[0];
  const checks = [];
  function check(value, label) { if (!value) throw Error(label); checks.push(label); }
  async function rows() {
    const response = await page.request.get(fixture.origin + '/rest/v1/court_memberships?user_id=eq.' + account.id + '&court_id=eq.' + court + '&select=court_id,joined_at',
      { headers: { apikey: fixture.key, Authorization: 'Bearer ' + account.token } });
    if (response.status() !== 200) throw Error('Local membership read failed');
    return await response.json();
  }
  const join = () => page.getByRole('button', { name: 'Agregar a Mis canchas', exact: true });
  const leave = () => page.getByRole('button', { name: 'Quitar de Mis canchas', exact: true });
  await page.goto('http://localhost:8090/map');
  await page.getByRole('button', { name: 'Ver cancha: Parque Rodo', exact: true }).click();
  await page.getByRole('heading', { name: 'MIS CANCHAS', exact: true }).waitFor();
  check(page.url().endsWith('/court/' + court), 'Court ID preserved from discovery');
  if ((await rows()).length) { await leave().click(); await join().waitFor(); }
  await join().click(); await leave().waitFor();
  check((await rows()).length === 1, 'Join confirmed by server row');
  await leave().click(); await join().waitFor();
  check((await rows()).length === 0, 'Leave confirmed by server absence');
  await join().click(); await leave().waitFor();
  check((await rows()).length === 1, 'Rejoin confirmed without duplicate');
  await page.getByRole('link', { name: 'Volver, back', exact: true }).click();
  await page.getByRole('tab', { name: 'Mis canchas', exact: true }).click();
  await page.getByRole('button', { name: 'Ver cancha: Parque Rodo', exact: true }).waitFor();
  check(await page.getByRole('button', { name: /^Ver cancha:/ }).count() === 1, 'My Courts shows only owned community');
  await page.getByRole('button', { name: 'Actualizar', exact: true }).click();
  await page.getByRole('button', { name: 'Actualizar', exact: true }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Ver cancha: Parque Rodo', exact: true }).click();
  await leave().waitFor();
  check(page.url().endsWith('/court/' + court), 'My Courts detail uses same ID and confirmed state');
  await leave().click(); await join().waitFor();

  const writeFailure = async route => {
    if (route.request().method() === 'POST') await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ message: 'Local test write failure' }) });
    else await route.continue();
  };
  const pattern = '**/rest/v1/court_memberships*';
  await page.route(pattern, writeFailure);
  await join().click();
  await page.getByRole('button', { name: 'Reintentar cambio', exact: true }).waitFor();
  check((await rows()).length === 0, 'Write failure does not claim joined');
  check(await join().count() === 0 && await leave().count() === 0, 'Uncertain change blocks opposite action');
  await page.unroute(pattern, writeFailure);
  await page.getByRole('button', { name: 'Reintentar cambio', exact: true }).click();
  await leave().waitFor();
  check((await rows()).length === 1, 'Same join intent retry confirms actual membership');
  await leave().click(); await join().waitFor();

  const readbackFailure = async route => {
    const url = new URL(route.request().url());
    if (route.request().method() === 'GET' && url.searchParams.get('select') === 'court_id' && url.searchParams.has('court_id'))
      await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ message: 'Local test readback failure' }) });
    else await route.continue();
  };
  await page.route(pattern, readbackFailure);
  await join().click();
  await page.getByRole('button', { name: 'Reintentar cambio', exact: true }).waitFor();
  const committed = await rows();
  check(committed.length === 1, 'Lost readback has real committed row');
  check(await leave().count() === 0, 'Readback failure is not reported as confirmed');
  await page.unroute(pattern, readbackFailure);
  await page.getByRole('button', { name: 'Reintentar cambio', exact: true }).click();
  await leave().waitFor();
  const retried = await rows();
  check(retried.length === 1 && retried[0].joined_at === committed[0].joined_at, 'Readback retry preserves original join timestamp');
  await page.getByRole('link', { name: 'Volver, back', exact: true }).click();
  await page.getByRole('tab', { name: 'Mis canchas', exact: true }).click();
  await page.getByRole('button', { name: 'Ver cancha: Parque Rodo', exact: true }).waitFor();

  const readFailure = async route => {
    if (route.request().method() === 'GET') await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ message: 'Local test read failure' }) });
    else await route.continue();
  };
  await page.route(pattern, readFailure);
  await page.getByRole('button', { name: 'Actualizar', exact: true }).click();
  await page.getByRole('button', { name: 'Reintentar', exact: true }).waitFor({ timeout: 20000 });
  check(await page.getByRole('button', { name: /^Ver cancha:/ }).count() === 0, 'Failed personal read does not present cached cards as current');
  await page.unroute(pattern, readFailure);
  await page.getByRole('button', { name: 'Reintentar', exact: true }).click();
  await page.getByRole('button', { name: 'Ver cancha: Parque Rodo', exact: true }).waitFor();
  check(true, 'Personal read retry restores owned card');
  return { passed: checks.length, checks };
}
