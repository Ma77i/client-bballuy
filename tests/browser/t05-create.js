// Run after t05-setup.js. Only owned synthetic identities and normal local UI writes.
async (page) => {
  const fixture = await page.evaluate(() => JSON.parse(sessionStorage.getItem('t05-review-fixtures')));
  if (!fixture || !/^http:\/\/(127\.0\.0\.1|localhost|192\.168\.1\.13):55431$/.test(fixture.origin)) throw Error('Local fixtures required');
  const checks = [];
  function check(value, label) { if (!value) throw Error(label); checks.push(label); }
  await page.goto('http://localhost:8090/play', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Organizar convocatoria', exact: true }).click();
  await page.getByRole('radio', { name: 'Palermo', exact: true }).click();
  const initialUrl=page.url(); let commands=0;
  const count = req => { if(req.url().includes('/rpc/pickup_command')) commands++; };
  page.on('request',count);
  for (const [format,capacity] of [['1v1',2],['2v2',4],['5v5',10]]) {
    await page.getByRole('radio', { name: format, exact: true }).click();
    check(await page.getByRole('radio', { name: format, exact: true }).getAttribute('aria-checked')==='true', `${format} selection immediate`);
    check(await page.getByText(`${capacity} participantes totales`, {exact:true}).isVisible(), `${format} capacity ${capacity}`);
  }
  check(page.url()===initialUrl && commands===0,'Format choices neither navigate nor submit'); page.removeListener('request',count);
  await page.getByRole('radio',{name:'1v1',exact:true}).click();
  await page.getByRole('radio',{name:'Planificar',exact:true}).click();
  await page.getByLabel('Fecha',{exact:true}).fill('2020-01-01');
  await page.getByLabel('Hora',{exact:true}).fill('18:00');
  await page.getByRole('button',{name:'Crear convocatoria',exact:true}).click();
  await page.getByText('Elegí una fecha y hora futuras.',{exact:true}).waitFor();
  check(true,'Past date remains invalid');
  const date=await page.evaluate(()=>{const d=new Date();d.setDate(d.getDate()+2);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;});
  await page.getByLabel('Fecha',{exact:true}).fill(date);
  await page.getByRole('button',{name:'Crear convocatoria',exact:true}).click();
  await page.waitForURL('**/organize/*');
  await page.getByText('Tu convocatoria está creada.',{exact:true}).waitFor();
  const sessionId = new URL(page.url()).pathname.split('/').pop();
  if (!/^[0-9a-f-]{36}$/.test(sessionId)) throw Error('Created session ID unavailable');
  await page.evaluate(id=>sessionStorage.setItem('t05-session-id',id),sessionId);
  check(true,'Create confirmed and navigated to actual owned ID');
  check(await page.getByText('1/2 lugares ocupados',{exact:true}).isVisible(),'Organizer counts once in 1v1');
  await page.goto('http://localhost:8090/play',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:/^Ver convocatoria 1v1 en Palermo: Abierta$/}).waitFor();
  check(true,'Actual invitation uses sports discovery card');
  return {passed:checks.length,checks};
}
