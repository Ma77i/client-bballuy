// Isolated browser transport simulation: no backend request or persisted QA account.
// Run with Playwright browser_run_code_unsafe against the existing local Metro.
async (page) => {
  const context = await page.context().browser().newContext({ viewport: { width: 402, height: 874 } });
  const review = await context.newPage();
  const checks = [];
  const court = { id: '9a63055d-e78b-460c-aab7-30cbb1d867d9', name: 'Palermo', latitude: -34.9135347,
    longitude: -56.1792215, half_court: false, lighting: null, surface: 'concreto', notes: '', created_at: '2025-12-02T20:22:51.047136-03:00' };
  const owner = '00000000-0000-4000-8000-000000000123';
  const user = { id: owner, email: 'isolated-review@example.com', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: '2026-10-15T00:00:00Z' };
  const jwt = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })) + '.' + btoa(JSON.stringify({ sub: owner, exp: Math.floor(Date.now()/1000)+3600 })) + '.review-only';
  let joined = false, readError = false, catalogError = false, activityError = false, writes = 0, slowWrite = false, writeError = false, catalogDelay = false;
  const json = (route, body, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,DELETE,OPTIONS' }, body: JSON.stringify(body) });
  await context.route('**/auth/v1/**', route => {
    if (route.request().method() === 'OPTIONS') return json(route, {});
    if (route.request().url().includes('/token')) return json(route, { access_token: jwt, refresh_token: 'review-only', token_type: 'bearer', expires_in: 3600, user });
    if (route.request().url().includes('/user')) return json(route, user);
    return json(route, {});
  });
  await context.route('**/rest/v1/**', async route => {
    const request = route.request(), url = new URL(request.url()), table = url.pathname.split('/').pop();
    if (table === 'users_public') return json(route, { id: owner, display_name: 'Isolated review', app_role: 'player' });
    if (table === 'court_catalog' && catalogDelay) await new Promise(resolve => setTimeout(resolve, 700));
    if (table === 'court_catalog') return catalogError ? json(route, {message:'Simulated read failure'}, 400) : json(route, [court]);
    if (table === 'court_memberships') {
      if (['POST','DELETE'].includes(request.method()) && slowWrite) await new Promise(resolve => setTimeout(resolve,700));
      if (['POST','DELETE'].includes(request.method()) && writeError) return json(route,{message:'Simulated write failure'},400);
      if (request.method() === 'POST') { joined = true; writes++; return json(route, null, 201); }
      if (request.method() === 'DELETE') { joined = false; writes++; return json(route, null); }
      if (readError) return json(route, {message:'Simulated read failure'},400);
      if (url.searchParams.get('select') === 'court_id') return json(route, joined ? {court_id:court.id}:null);
      return json(route, joined ? [{court_id:court.id,joined_at:'2026-10-15T00:00:00Z',court_catalog:{id:court.id,name:court.name}}] : []);
    }
    if (table === 'pickup_session_catalog') return activityError ? json(route,{message:'Simulated activity failure'},400):json(route,[]);
    if (request.method() !== 'GET') throw Error('Unexpected backend mutation');
    return json(route, []);
  });
  try {
    await review.goto('http://localhost:8090/signin');
    await review.getByText('Comprobando tu sesión', {exact:true}).waitFor({state:'hidden'});
    await review.getByRole('button', {name:'Mostrar contraseña',exact:true}).click();
    await review.getByRole('button', {name:'Ocultar contraseña',exact:true}).click();
    await review.getByRole('textbox', { name: 'Correo electrónico', exact: true }).pressSequentially(user.email, {delay:20});
    await review.locator('input[aria-label="Contraseña"]').fill('IsolatedOnly7!');
    await review.getByRole('button', {name:'Iniciar sesión',exact:true}).click();
    await review.waitForURL('**/map');
    await review.getByRole('button', {name:'Ver cancha: Palermo',exact:true}).click();
    const add = () => review.getByRole('button',{name:'Agregar a mis canchas',exact:true});
    const remove = () => review.getByRole('button',{name:'Quitar de mis canchas',exact:true});
    await add().waitFor();
    await review.getByRole('heading',{name:'Sobre la cancha',exact:true}).waitFor();
    await review.getByText('Sin partidos reportados en curso. No confirma que la cancha esté vacía.',{exact:true}).waitFor();
    if (await review.getByText('Canchas',{exact:true}).evaluateAll(es=>es.filter(e=>e.getClientRects().length && getComputedStyle(e).visibility!=='hidden').length) !== 1) throw Error('Duplicate header label');
    if (await review.getByText('Ilustración · No es una foto',{exact:true}).count()) throw Error('Visible illustration disclaimer');
    const labelColor = await review.getByText('Armar partido',{exact:true}).evaluate(e=>getComputedStyle(e).color);
    if (labelColor !== 'rgb(12, 18, 32)') throw Error('Bright orange button label must be navy for WCAG AA');
    const titles = await Promise.all(['Sobre la cancha','Actividad reportada'].map(name=>review.getByRole('heading',{name,exact:true}).boundingBox()));
    if (Math.abs(titles[0].x-titles[1].x)>1) throw Error('Section headings misaligned');
    const primaryColor = await review.getByRole('button',{name:'Armar partido',exact:true}).evaluate(e=>getComputedStyle(e).backgroundColor);
    if(primaryColor !== 'rgb(255, 138, 67)') throw Error('Primary orange does not match approved system orange');
    const secondaryColor = await add().evaluate(e=>getComputedStyle(e).backgroundColor);
    if(secondaryColor !== 'rgb(255, 247, 237)') throw Error('Save control is not secondary cream');
    checks.push('single centered header, exact orange organize CTA, secondary save control and aligned sentence-case headings');
    await review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/detail-fidelity-evidence/detail.png'});
    checks.push('seed attributes, integrated actions and separate empty-activity caveat');
    await add().click(); await remove().waitFor();
    await remove().click(); await add().waitFor();
    await add().click(); await remove().waitFor();
    if (writes !== 3) throw Error('Unexpected duplicate writes');
    checks.push('simulated add/remove/re-add, exactly three writes and confirmed readback');
    slowWrite = true; await remove().click();
    const pending = review.getByRole('button',{name:'Quitar de mis canchas',exact:true}).and(review.locator('[aria-busy="true"]'));
    await pending.waitFor(); if (await pending.isEnabled()) throw Error('Pending action not blocked');
    await add().waitFor(); slowWrite = false;
    writeError = true; await add().click();
    await review.getByRole('button',{name:'Reintentar cambio',exact:true}).waitFor();
    if (await remove().count()) throw Error('Uncertain operation exposed opposite action');
    writeError = false; await review.getByRole('button',{name:'Reintentar cambio',exact:true}).click(); await remove().waitFor();
    checks.push('pending change blocks duplicates; failed change retries same action without opposite control');
    await review.getByRole('button',{name:'Armar partido',exact:true}).click();
    await review.waitForURL('**/organize/create**');
    if (!new URL(review.url()).searchParams.get('courtId')?.includes(court.id)) throw Error('Court context lost');
    await review.goBack(); await remove().waitFor();
    checks.push('existing organizer route receives same courtId and back restores detail');
    await review.getByRole('button',{name:'Ver ubicación en el mapa',exact:true}).click();
    await review.waitForURL('**/map**');
    await review.getByRole('radio',{name:'Mapa',exact:true}).waitFor();
    await review.waitForFunction(()=>document.querySelector('[aria-label="Mapa"]')?.getAttribute('aria-checked')==='true');
    checks.push('existing location handoff selects map mode; native camera/marker not executed');
    await review.goto('http://localhost:8090/court/'+court.id); await remove().waitFor();
    readError = true; await review.reload();
    await review.getByRole('button',{name:'Reintentar consulta',exact:true}).waitFor();
    if (await remove().count()) throw Error('Stale membership action exposed');
    readError = false; await review.getByRole('button',{name:'Reintentar consulta',exact:true}).click(); await remove().waitFor();
    checks.push('membership read failure blocks action; retry restores confirmed state');
    catalogDelay = true; await review.reload(); await review.getByText('Cargando cancha',{exact:true}).waitFor();
    await remove().waitFor(); catalogDelay = false; checks.push('catalog loading state observed before ready');
    catalogError = true; await review.reload(); await review.getByRole('button',{name:'Reintentar',exact:true}).waitFor();
    catalogError = false; await review.getByRole('button',{name:'Reintentar',exact:true}).click(); await remove().waitFor();
    checks.push('catalog error/retry preserved');
    activityError = true; await review.reload(); await review.getByRole('button',{name:'Reintentar actividad',exact:true}).waitFor();
    activityError = false; await review.getByRole('button',{name:'Reintentar actividad',exact:true}).click();
    await review.getByText('Sin partidos reportados en curso. No confirma que la cancha esté vacía.',{exact:true}).waitFor();
    checks.push('activity error/retry independent from physical court info');
    await review.setViewportSize({width:320,height:874}); await remove().waitFor();
    await review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/detail-fidelity-evidence/narrow.png'});
    checks.push('narrow viewport readable rows and reachable actions; native font scaling pending');
    return { mode:'actual app with fully intercepted browser transport; no backend writes', checks };
  } catch (error) { throw new Error(String(error)+' | Review state: '+(await review.locator('body').innerText()).slice(0,1400)); } finally { await context.close(); }
}



