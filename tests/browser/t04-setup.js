// Invoke with the Playwright browser_run_code tool against the local Expo web app.
// Synthetic credentials remain only in the isolated review browser; never returned.
async (page) => {
  await page.goto('http://localhost:8090/signin');
  const probe = await page.evaluate(() => ({ email: `t04-probe-${crypto.randomUUID()}@example.invalid`, password: crypto.randomUUID() + 'Aa1!' }));
  const request = page.waitForRequest(req => req.url().includes('/auth/v1/token'));
  await page.getByPlaceholder('your@email.com').fill(probe.email);
  await page.getByPlaceholder('Enter your password').fill(probe.password);
  await page.getByText('Sign In', { exact: true }).click();
  const loginRequest = await request;
  const origin = new URL(loginRequest.url()).origin;
  if (!/^http:\/\/(127\.0\.0\.1|localhost|192\.168\.1\.13):55431$/.test(origin)) throw Error('Local backend required');
  const key = loginRequest.headers().apikey;
  if (!key) throw Error('Local public key unavailable');
  const accounts = [];
  for (const name of ['Cuenta de prueba A', 'Cuenta de prueba B']) {
    const account = await page.evaluate(() => ({ email: `t04-${crypto.randomUUID()}@example.invalid`, password: crypto.randomUUID() + 'Aa1!' }));
    const response = await page.request.post(origin + '/auth/v1/signup', {
      headers: { apikey: key }, data: { ...account, data: { display_name: name } },
    });
    if (response.status() !== 200) throw Error('Local fixture signup failed');
    const data = await response.json();
    if (!data.access_token || !data.user?.id) throw Error('Local signup must return a session');
    accounts.push({ ...account, token: data.access_token, id: data.user.id });
  }
  await page.evaluate(data => sessionStorage.setItem('t04-review-fixtures', JSON.stringify(data)), { origin, key, accounts });
  await page.goto('http://localhost:8090/signin');
  await page.getByPlaceholder('your@email.com').fill(accounts[0].email);
  await page.getByPlaceholder('Enter your password').fill(accounts[0].password);
  await page.getByText('Sign In', { exact: true }).click();
  await page.waitForURL('**/map', { timeout: 20000 });
  await page.getByRole('button', { name: 'Ver cancha: Parque Rodo', exact: true }).waitFor();
  return { localFixtureAccountsCreated: 2, signedIn: true, catalogLoaded: true };
}
