// Run after setup/community in the same local review browser. Never sends email.
async (page) => {
  const fixture = await page.evaluate(() => JSON.parse(sessionStorage.getItem('t04-review-fixtures')));
  if (!fixture || !/^http:\/\/(127\.0\.0\.1|localhost|192\.168\.1\.13):55431$/.test(fixture.origin)) throw Error('Local fixtures required');
  const checks = [];
  function check(value, label) { if (!value) throw Error(label); checks.push(label); }
  async function login(account) {
    await page.getByPlaceholder('your@email.com').fill(account.email);
    await page.getByPlaceholder('Enter your password').fill(account.password);
    await page.getByText('Sign In', { exact: true }).click();
    await page.waitForURL('**/map', { timeout: 20000 });
  }
  await page.goto('http://localhost:8090/profile');
  await page.getByText('Cuenta de prueba A', { exact: true }).waitFor();
  check(await page.getByRole('button', { name: 'Mis canchas', exact: true }).isVisible(), 'Profile preserves My Courts action');

  if (await page.getByRole('button', { name: 'Reportar un problema', exact: true }).count()) {
    await page.evaluate(() => {
      window.__t04OriginalOpen = window.open;
      window.open = () => { throw Error('Local test composer failure'); };
    });
    await page.getByRole('button', { name: 'Reportar un problema', exact: true }).click();
    await page.getByRole('button', { name: 'Reintentar reporte', exact: true }).waitFor();
    check(await page.getByText('No pudimos abrir tu app de correo. Reintentá o usá el contacto indicado.', { exact: true }).isVisible(), 'Report failure exposes safe retry and fallback');
    await page.evaluate(() => {
      window.open = url => {
        const value = new URL(String(url));
        const body = value.searchParams.get('body') ?? '';
        window.__t04DraftCheck = { mailto: value.protocol === 'mailto:', automaticAccountData: /token|user_id|session_id|Cuenta de prueba|attachment/i.test(body) };
        return null;
      };
    });
    await page.getByRole('button', { name: 'Reintentar reporte', exact: true }).click();
    await page.getByRole('button', { name: 'Reportar un problema', exact: true }).waitFor();
    const draft = await page.evaluate(() => {
      const result = window.__t04DraftCheck;
      window.open = window.__t04OriginalOpen;
      delete window.__t04OriginalOpen; delete window.__t04DraftCheck;
      return result;
    });
    check(draft.mailto && !draft.automaticAccountData, 'Report draft contains no automatic account data; no email sent');
  } else check(true, 'Unconfigured support correctly absent');

  const logoutFailure = async route => route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify({ message: 'Local test logout failure' }) });
  await page.route('**/auth/v1/logout*', logoutFailure);
  await page.getByRole('button', { name: 'Cerrar sesión', exact: true }).click();
  await page.getByRole('button', { name: 'Reintentar cierre de sesión', exact: true }).waitFor();
  check(await page.getByText('Cuenta de prueba A', { exact: true }).isVisible(), 'Logout failure retains actual account and recovery');
  await page.unroute('**/auth/v1/logout*', logoutFailure);
  await page.getByRole('button', { name: 'Reintentar cierre de sesión', exact: true }).click();
  await page.waitForURL('**/signin', { timeout: 20000 });
  check(await page.getByText('Cuenta de prueba A', { exact: true }).count() === 0, 'Successful retry removes prior profile');
  await login(fixture.accounts[1]);
  await page.getByRole('tab', { name: 'Mis canchas', exact: true }).click();
  await page.getByRole('heading', { name: 'Todavía no agregaste canchas', exact: true }).waitFor();
  check(await page.getByRole('button', { name: /^Ver cancha:/ }).count() === 0, 'Account B cannot see account A communities');
  await page.getByRole('tab', { name: 'Perfil', exact: true }).click();
  await page.getByText('Cuenta de prueba B', { exact: true }).waitFor();
  check(await page.getByText('Cuenta de prueba A', { exact: true }).count() === 0, 'Account B profile never shows account A name');
  await page.getByRole('button', { name: 'Cerrar sesión', exact: true }).click();
  await page.waitForURL('**/signin', { timeout: 20000 });
  await login(fixture.accounts[0]);
  await page.getByRole('tab', { name: 'Mis canchas', exact: true }).click();
  await page.getByRole('button', { name: 'Ver cancha: Parque Rodo', exact: true }).waitFor();
  check(await page.getByRole('button', { name: /^Ver cancha:/ }).count() === 1, 'Returning to A restores server community without B leakage');
  await page.getByRole('tab', { name: 'Perfil', exact: true }).click();
  await page.getByText('Cuenta de prueba A', { exact: true }).waitFor();
  check(await page.getByText('Cuenta de prueba B', { exact: true }).count() === 0, 'Returning to A restores correct actual profile');
  return { passed: checks.length, checks };
}
