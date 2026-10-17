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
  let sessionsError = false, sessionDelay = false;
  const fixtures = ['1v1','2v2','5v5'].map((format,index)=>({id:'00000000-0000-4000-8000-00000000000'+(index+1),court_id:court.id,organizer_id:owner,organizer_name:'Organizador de prueba',format,capacity:[2,4,10][index],occupied_places:index===1?4:1,available_places:[1,0,9][index],timing:index===2?'future':'now',scheduled_at:new Date(Date.now()+86400000).toISOString(),started_at:null,state:'open',description:'',organizer_plays:true}));
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
    if (table === 'pickup_session_catalog') {
      if(sessionDelay) await new Promise(resolve=>setTimeout(resolve,1200));
      return sessionsError ? json(route,{message:'Simulated session failure'},400) : json(route,fixtures);
    }
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
    await review.goto('http://localhost:8091/play');
    const cards=()=>review.getByRole('button',{name:/Ver partido .* en Palermo:/});
    await cards().first().waitFor();
    if(await cards().count()!==3)throw Error('Expected three transport fixtures');
    if((await review.locator('body').innerText()).toLowerCase().includes('convocatoria'))throw Error('Old terminology remains');
    await review.getByRole('heading',{name:'ENCONTRÁ TU PARTIDO',exact:true}).waitFor();
    await review.getByText('Completo',{exact:true}).waitFor();
    const leftArt=await cards().first().locator('img').boundingBox();if(leftArt.width<100)throw Error('Illustration too small');
    const dock=review.getByRole('button',{name:'Armar partido',exact:true});const before=await dock.boundingBox();
    if(before.height<48)throw Error('Dock touch too small');
    await review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/play-fidelity-evidence/list.png'});
    await cards().last().scrollIntoViewIfNeeded();const after=await dock.boundingBox();
    if(Math.abs(before.y-after.y)>1)throw Error('Dock scrolls with list');
    checks.push('three horizontal illustrated server-fixture cards, actual capacity/full labels, fixed dock >=48 pt');
    await review.getByRole('button',{name:'Formato: Todos',exact:true}).click();
    await review.getByRole('radio',{name:'2v2',exact:true}).waitFor();
    await review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/play-fidelity-evidence/filters.png'});
    await review.getByRole('radio',{name:'2v2',exact:true}).focus();
    await review.keyboard.press('Space');
    await review.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Formato: 2v2');
    if(await cards().count()!==1)throw Error('Format filter failed');
    await review.getByRole('button',{name:'Cancha: Todas',exact:true}).click();
    await review.getByRole('radio',{name:'Palermo',exact:true}).click();
    if(await cards().count()!==1)throw Error('Court filter failed');
    checks.push('compact selectors filter immediately without navigation or mutations');
    await dock.click();await review.waitForURL('**/organize/create?**');
    if(!review.url().includes('format=2v2')||!review.url().includes(court.id))throw Error('Create filters lost');
    await review.goBack();await review.getByRole('button',{name:'Jugar ahora',exact:true}).click();await review.waitForURL('**/organize/quick?**');
    if(!review.url().includes('format=2v2')||!review.url().includes(court.id))throw Error('Quick filters lost');
    await review.goBack();await review.getByRole('button',{name:'Mis partidos',exact:true}).click();await review.waitForURL('**/pickup/mine');
    await review.goBack();await review.getByRole('button',{name:'Historial',exact:true}).click();await review.waitForURL('**/matches/mine');await review.goBack();
    checks.push('existing create/quick routes receive filters; personal/history destinations remain accessible');
    fixtures.splice(0);await review.reload();await review.getByText('El próximo partido puede ser tuyo',{exact:true}).waitFor();
    await review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/play-fidelity-evidence/empty.png'});
    sessionsError=true;await review.reload();await review.getByRole('button',{name:'Reintentar partidos',exact:true}).waitFor();
    if(await review.getByText('El próximo partido puede ser tuyo',{exact:true}).count())throw Error('Error presented as empty');
    await review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/play-fidelity-evidence/error.png'});
    sessionsError=false;await review.getByRole('button',{name:'Reintentar partidos',exact:true}).click();await review.getByText('El próximo partido puede ser tuyo',{exact:true}).waitFor();
    checks.push('empty is distinct from read error; retry recovers');
    sessionDelay=true;await review.reload();await review.getByText('Cargando partidos',{exact:true}).waitFor();await review.getByText('El próximo partido puede ser tuyo',{exact:true}).waitFor();
    checks.push('loading observed before confirmed empty');
    await review.emulateMedia({reducedMotion:'reduce'});await review.setViewportSize({width:320,height:874});
    const bounds=await review.locator('body').evaluate(e=>({client:e.clientWidth,scroll:e.scrollWidth}));if(bounds.scroll>bounds.client)throw Error('Narrow overflow');
    await review.getByRole('button',{name:'Formato: Todos',exact:true}).click();await review.getByRole('button',{name:'Cerrar selector de formato',exact:true}).click();
        await review.evaluate(()=>{for(const e of document.querySelectorAll('div[dir="auto"]')){const s=getComputedStyle(e);e.style.fontSize=parseFloat(s.fontSize)*2+'px';e.style.lineHeight=parseFloat(s.lineHeight)*2+'px';}});
    const enlarged=await review.locator('body').evaluate(e=>({client:e.clientWidth,scroll:e.scrollWidth}));if(enlarged.scroll>enlarged.client)throw Error('Enlarged text overflow');
    await review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/play-fidelity-evidence/text-stress.png'});
    if(writes!==0)throw Error('Unexpected write');
    checks.push('320 pt reduced-motion render and explicit selector dismissal; no backend writes');
    return {checks,mode:'actual web app, isolated simulated transport; not native or remote acceptance',dock:before};
  }catch(error){throw new Error(String(error)+' | '+(await review.locator('body').innerText()).slice(0,1300));}
  finally{await context.close();}
}


