// Isolated browser transport simulation: no backend request or persisted QA account.
// Run with Playwright browser_run_code_unsafe against the existing local Metro.
async (page) => {
  const context = await page.context().browser().newContext({ reducedMotion: 'reduce', viewport: { width: 402, height: 874 } });
  const review = await context.newPage();
  review.setDefaultTimeout(12000);
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
  async function shot(name){await review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/map-preview-evidence/'+name+'.png'});}
  async function preview(){await review.goto('http://localhost:8090/map?focusCourtId='+court.id+'&focusCourtRequest='+Date.now());await review.getByRole('button',{name:'Ampliar',exact:true}).waitFor();}
  try {
    await review.goto('http://localhost:8090/signin',{waitUntil:'domcontentloaded',timeout:45000});await review.getByText('Comprobando tu sesión',{exact:true}).waitFor({state:'hidden'});
    await review.getByRole('button',{name:'Mostrar contraseña',exact:true}).click();await review.getByRole('button',{name:'Ocultar contraseña',exact:true}).click();
    await review.getByRole('textbox',{name:'Correo electrónico',exact:true}).pressSequentially(user.email,{delay:10});await review.locator('input[aria-label="Contraseña"]').fill('IsolatedOnly7!');
    await review.getByRole('button',{name:'Iniciar sesión',exact:true}).click();await review.waitForURL('**/map');
    await review.getByText('1 cancha',{exact:true}).waitFor();await review.getByText(/Actividad comprobada:/).waitFor();
    checks.push('list retains count and activity timestamp');
    await review.getByRole('radio',{name:'Mapa',exact:true}).click();await review.getByText('El mapa interactivo está disponible en la app móvil. Explorá las canchas en el listado.',{exact:true}).waitFor();await shot('web-map-fallback');
    checks.push('List to Map preserves web fallback and cards, without importing native map');
    await preview();await shot('compact-preview-web');
    const box=await review.getByRole('button',{name:'Ver cancha',exact:true}).boundingBox();if(!box||box.height<48)throw Error('Small primary target');
    if(await review.getByText('Ilustración · No es una foto',{exact:true}).count())throw Error('Repeated media caption');
    await review.getByRole('button',{name:'Ampliar',exact:true}).click();await review.getByText('Iluminación: Sin registrar',{exact:true}).waitFor();await shot('expanded-preview-web');
    await review.getByRole('button',{name:'Contraer',exact:true}).click();if(await review.getByText('Iluminación: Sin registrar',{exact:true}).count())throw Error('Collapse failed');
    checks.push('real shared preview expands and collapses through accessible secondary control; lighting remains truthful');
    await review.getByRole('button',{name:'Cerrar',exact:true}).click();if(await review.getByRole('button',{name:'Ampliar',exact:true}).count())throw Error('Close failed');
    await preview();await review.getByRole('button',{name:'Ver cancha',exact:true}).click();await review.waitForURL('**/court/'+court.id);checks.push('close and existing real court navigation work');
    await review.setViewportSize({width:320,height:650});await preview();await shot('compact-preview-narrow-web');
    if(await review.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Horizontal overflow');checks.push('narrow preview remains within viewport');
    return{checks,mode:'actual shared UI with isolated synthetic auth/REST; native map, marker, gestures and safe-area screenshots require iPhone'};
  }catch(error){throw Error(String(error)+' | '+review.url()+' | '+(await review.locator('body').innerText()).slice(0,1200));}finally{await context.close();}
}
