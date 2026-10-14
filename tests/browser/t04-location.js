// Run after t04-setup.js in the same isolated local review browser.
async (page) => {
  const checks = [];
  function check(value, label) { if (!value) throw Error(label); checks.push(label); }
  const search = () => page.getByPlaceholder('Nombre de la cancha');
  async function locate(name) {
    await page.getByRole('button', { name: `Ver cancha: ${name}`, exact: true }).click();
    await page.getByRole('button', { name: 'Ver ubicación en el mapa', exact: true }).click();
    await page.getByRole('button', { name: 'Cerrar', exact: true }).waitFor();
    await page.waitForURL('**/map');
    check(await page.getByRole('heading', { name, exact: true }).isVisible(), `${name} selected in existing preview`);
    check(await page.getByRole('button', { name: 'Cerrar', exact: true }).count() === 1, 'Exactly one compact preview');
  }
  await page.goto('http://localhost:8090/map', { waitUntil: 'networkidle' });
  await search().pressSequentially('Palermo');
  await page.waitForFunction(() => document.querySelector('input[placeholder="Nombre de la cancha"]')?.value === 'Palermo');
  await locate('Palermo');
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  check(await page.getByRole('radio', { name: 'Mapa', exact: true }).getAttribute('aria-checked') === 'true', 'Location explicitly switches list to Map');
  check(await search().inputValue() === 'Palermo', 'Compatible search is preserved');
  await page.getByRole('radio', { name: 'Listado', exact: true }).click();
  await locate('Palermo');
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  check(await page.getByRole('button', { name: 'Cerrar', exact: true }).count() === 0, 'Consumed target does not reopen closed preview');
  await page.goto('http://localhost:8090/map?focusCourtId=unknown', { waitUntil: 'networkidle' });
  await page.waitForURL('**/map');
  check(await page.getByRole('button', { name: 'Cerrar', exact: true }).count() === 0, 'Unknown target is safely consumed without invented selection');
  await page.goto('http://localhost:8090/court/9a63055d-e78b-460c-aab7-30cbb1d867d9', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Ver ubicación en el mapa', exact: true }).click();
  await page.getByRole('heading', { name: 'Palermo', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  check(await page.getByRole('radio', { name: 'Mapa', exact: true }).getAttribute('aria-checked') === 'true', 'Direct detail entry also selects Map');
  await page.getByRole('button', { name: 'Ver cancha: Palermo', exact: true }).click();
  await page.getByRole('button', { name: /^(Agregar a|Quitar de) Mis canchas$/, exact: true }).waitFor();
  const add = page.getByRole('button', { name: 'Agregar a Mis canchas', exact: true });
  if (await add.count()) await add.click();
  await page.getByRole('button', { name: 'Quitar de Mis canchas', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Ver ubicación en el mapa', exact: true }).click();
  await page.waitForURL('**/map');
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  await search().pressSequentially('Rodo');
  await page.waitForFunction(() => document.querySelector('input[placeholder="Nombre de la cancha"]')?.value === 'Rodo');
  await page.getByRole('tab', { name: 'Mis canchas', exact: true }).click();
  await page.getByRole('button', { name: 'Ver cancha: Palermo', exact: true }).click();
  await page.getByRole('button', { name: 'Ver ubicación en el mapa', exact: true }).click();
  await page.waitForURL('**/map');
  await page.getByRole('heading', { name: 'Palermo', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
  check(await search().inputValue() === '', 'My Courts target clears incompatible discovery search');
  return { passed: checks.length, checks };
}
