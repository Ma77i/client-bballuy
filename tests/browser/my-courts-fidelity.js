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
  let joined = true, readError = false, catalogError = false, activityError = false, writes = 0, slowWrite = false, writeError = false, catalogDelay = false;
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
      if (slowWrite) await new Promise(resolve=>setTimeout(resolve,700));
      if (readError) return json(route, {message:'Simulated read failure'},400);
      if (url.searchParams.get('select') === 'court_id') return json(route, joined ? {court_id:court.id}:null);
      return json(route, joined ? [{court_id:court.id,joined_at:'2026-10-15T00:00:00Z',court_catalog:{id:court.id,name:court.name}}] : []);
    }
    if (table === 'pickup_session_catalog') return activityError ? json(route,{message:'Simulated activity failure'},400):json(route,[]);
    if (request.method() !== 'GET') throw Error('Unexpected backend mutation');
    return json(route, []);
  });
  try {
    await review.goto('http://localhost:8091/signin');
    await review.getByText('Comprobando tu sesión',{exact:true}).waitFor({state:'hidden'});
    await review.getByRole('button',{name:'Mostrar contraseña',exact:true}).click();
    await review.getByRole('button',{name:'Ocultar contraseña',exact:true}).click();
    await review.getByRole('textbox',{name:'Correo electrónico',exact:true}).pressSequentially(user.email,{delay:20});
    await review.locator('input[aria-label="Contraseña"]').fill('IsolatedOnly7!');
    await review.getByRole('button',{name:'Iniciar sesión',exact:true}).click();
    await review.waitForURL('**/map');
    await review.goto('http://localhost:8091/my-courts');
    const card=()=>review.getByRole('button',{name:'Ver cancha: Palermo',exact:true});
    const refresh=()=>review.getByRole('button',{name:'Actualizar Mis canchas',exact:true});
    await card().waitFor();
    if(await review.getByRole('button',{name:/Ver cancha:/}).count()!==1)throw Error('Unexpected saved rows');
    if(await review.getByRole('button',{name:'Actualizar',exact:true}).count())throw Error('Oversized refresh still present');
    const image=await card().locator('img').evaluateAll(es=>es.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})));
    if(!image.some(i=>i.w===116&&i.h===116))throw Error('Shared illustrated card not used');
    if((await card().innerText()).includes('concreto')||(await card().innerText()).includes('Actividad'))throw Error('Unavailable facts invented');
    await review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/my-courts-fidelity-evidence/populated.png'});
    checks.push('one server-bound saved row; shared116 pt card, real name, no invented facts/activity');
    const hit=await refresh().boundingBox();if(hit.width<48||hit.height<48)throw Error('Refresh target too small');
    checks.push('header refresh target at least48 pt; old large button removed');
    await card().click();await review.waitForURL('**/court/'+court.id);await review.getByRole('heading',{name:'Sobre la cancha',exact:true}).waitFor();
    await review.goBack();await card().waitFor();checks.push('saved card opens unchanged detail with exact ID; back restores saved list');
    slowWrite=true;await refresh().click();await review.waitForFunction(()=>document.querySelector('[aria-label="Actualizar Mis canchas"]')?.getAttribute('aria-busy')==='true');
    if(await refresh().isEnabled())throw Error('Busy refresh did not block repeated press');
    await review.waitForFunction(()=>document.querySelector('[aria-label="Actualizar Mis canchas"]')?.getAttribute('aria-busy')==='false');slowWrite=false;
    checks.push('refresh busy feedback and duplicate press block observed');
    joined=false;await refresh().click();await review.getByRole('heading',{name:'Tu próxima cancha te espera',exact:true}).waitFor();
    if(await review.getByRole('button',{name:/Ver cancha:/}).count())throw Error('Stale saved row remained');
    const large=await review.locator('img').evaluateAll(es=>es.some(e=>e.getBoundingClientRect().width===220&&e.getBoundingClientRect().height===220));
    if(!large)throw Error('Missing large empty illustration');
    await review.getByText('Guardá tus canchas favoritas para encontrarlas acá',{exact:true}).waitFor();
    const cta=review.getByRole('button',{name:'Explorar canchas',exact:true});
    if(await cta.evaluate(e=>getComputedStyle(e).backgroundColor)!=='rgb(255, 138, 67)')throw Error('Empty CTA orange mismatch');
    if(await review.getByText('Explorar canchas',{exact:true}).evaluate(e=>getComputedStyle(e).color)!=='rgb(12, 18, 32)')throw Error('Empty CTA text must be navy');
    await review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/my-courts-fidelity-evidence/empty.png'});
    await review.getByRole('button',{name:'Explorar canchas',exact:true}).click();await review.waitForURL('**/map');checks.push('empty state uses220 pt original art and existing exploration navigation');
    await review.goto('http://localhost:8091/my-courts');await refresh().waitFor();readError=true;await refresh().click();
    await review.getByText('No pudimos cargar tus canchas',{exact:true}).waitFor();
    if(await review.getByRole('heading',{name:'Tu próxima cancha te espera',exact:true}).count())throw Error('Error misrepresented as empty');
    readError=false;joined=true;await review.getByRole('button',{name:'Reintentar',exact:true}).click();await card().waitFor();checks.push('read failure is distinct from empty; retry restores confirmed simulated rows');
    slowWrite=true;await review.reload();await review.getByText('Cargando tus canchas',{exact:true}).waitFor();await card().waitFor();slowWrite=false;checks.push('initial loading observed and recovers to saved rows');
    await review.emulateMedia({reducedMotion:'reduce'});await review.setViewportSize({width:320,height:874});await card().waitFor();
    const bounds=await card().evaluate(e=>({client:e.clientWidth,scroll:e.scrollWidth}));if(bounds.scroll>bounds.client)throw Error('Narrow card overflow');
    checks.push('narrow viewport render with reduced-motion preference remains usable');
    if(writes!==0)throw Error('Unexpected membership write');
    return {mode:'actual app with simulated browser transport and exact seed court; no backend writes',checks,refreshHit:hit};
  } catch(error){throw new Error(String(error)+' | Isolated review: '+(await review.locator('body').innerText()).slice(0,1000));}
  finally {await context.close();}
}

