// Isolated browser transport simulation: no backend request or persisted QA account.
// Run with Playwright browser_run_code_unsafe against the existing local Metro.
async (page) => {
  const context = await page.context().browser().newContext({ viewport: { width: 402, height: 874 }, locale: 'es-UY', timezoneId: 'America/Montevideo' });
  const review = await context.newPage();
  const checks = [];
  const court = { id: '9a63055d-e78b-460c-aab7-30cbb1d867d9', name: 'Palermo', latitude: -34.9135347,
    longitude: -56.1792215, half_court: false, lighting: null, surface: 'concreto', notes: '', created_at: '2025-12-02T20:22:51.047136-03:00' };
  const owner = '00000000-0000-4000-8000-000000000123';
  const user = { id: owner, email: 'isolated-review@example.com', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: '2026-10-15T00:00:00Z' };
  const jwt = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })) + '.' + btoa(JSON.stringify({ sub: owner, exp: Math.floor(Date.now()/1000)+3600 })) + '.review-only';
  const json = (route, body, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,DELETE,OPTIONS' }, body: JSON.stringify(body) });
  await context.route('**/auth/v1/**', route => {
    if (route.request().method() === 'OPTIONS') return json(route, {});
    if (route.request().url().includes('/token')) return json(route, { access_token: jwt, refresh_token: 'review-only', token_type: 'bearer', expires_in: 3600, user });
    if (route.request().url().includes('/user')) return json(route, user);
    return json(route, {});
  });
  let catalogError=false, catalogDelay=false, reject=false, failRead=false, slow=false, slowRead=false;
  const calls=[], rows=new Map();
  const gameId='00000000-0000-4000-8000-000000000777';
  await context.route('**/rest/v1/**',async route=>{
    const request=route.request(),url=new URL(request.url()),table=url.pathname.split('/').pop();
    if(request.method()==='OPTIONS')return json(route,{});
    if(table==='users_public')return json(route,{id:owner,display_name:'Isolated review',app_role:'player'});
    if(table==='court_catalog'){
      if(catalogDelay)await new Promise(resolve=>setTimeout(resolve,900));
      return catalogError?json(route,{message:'Simulated catalog error'},400):json(route,[court]);
    }
    if(table==='pickup_command'){
      const body=request.postDataJSON();calls.push(body);
      if(body.p_action!=='create_session')throw Error('Unexpected mutation');
      if(slow)await new Promise(resolve=>setTimeout(resolve,900));
      if(reject)return json(route,{code:'PT400',message:'Simulated rejection'},400);
      if(!rows.has(body.p_request_id)){
        const data=body.p_data,capacity={'1v1':2,'2v2':4,'5v5':10}[data.format];
        rows.set(body.p_request_id,{id:gameId,organizer_id:owner,court_id:data.court_id,format:data.format,capacity,
          timing:data.timing,scheduled_at:data.scheduled_at??new Date().toISOString(),description:data.description,
          organizer_plays:data.organizer_plays,core_locked:true,state:'open',created_at:new Date().toISOString(),
          started_at:null,closed_at:null,pickup_places:Array.from({length:data.present_count},(_,i)=>({id:'fixture-place-'+i}))});
      }
      return json(route,{id:gameId});
    }
    if(table==='pickup_sessions'){
      if(slowRead)await new Promise(resolve=>setTimeout(resolve,900));
      if(failRead)return json(route,{message:'Simulated readback failure'},400);
      return json(route,url.searchParams.has('id')?[...rows.values()].at(-1)??null:[]);
    }
    if(request.method()!=='GET')throw Error('Unexpected backend mutation');
    return json(route,[]);
  });
  await context.route('**/functions/v1/**',route=>{throw Error('Unexpected Edge Function request');});
  const capture=name=>review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/organize-usability-evidence/'+name+'.png',fullPage:true});
  const radio=name=>review.getByRole('radio',{name,exact:true});
  const cta=()=>review.getByRole('button',{name:'Armar partido',exact:true});
  const picker=()=>review.getByRole('button',{name:/^Cancha:/});
  async function chooseCourt(){await picker().click();await radio('Palermo').click();await review.getByRole('button',{name:'Cerrar selector de cancha',exact:true}).waitFor({state:'hidden'});}
  try{
    await review.goto('http://localhost:8092/signin');
    await review.getByText('Comprobando tu sesión',{exact:true}).waitFor({state:'hidden'});
    await review.getByRole('button',{name:'Mostrar contraseña',exact:true}).click();
    await review.getByRole('button',{name:'Ocultar contraseña',exact:true}).click();
    await review.getByRole('textbox',{name:'Correo electrónico',exact:true}).pressSequentially(user.email,{delay:20});
    await review.locator('input[aria-label="Contraseña"]').fill('IsolatedOnly7!');
    await review.getByRole('button',{name:'Iniciar sesión',exact:true}).click();await review.waitForURL('**/map');
    await review.goto('http://localhost:8092/organize/create');await picker().waitFor();
    if(await radio('2v2').getAttribute('aria-checked')!=='true')throw Error('Default format changed');
    if(await cta().count())throw Error('Initial timing became preselected');
    for(const format of ['1v1','2v2','5v5']){
      await radio(format).click();if(await radio(format).getAttribute('aria-checked')!=='true')throw Error('Selection not immediate');
      const hit=await radio(format).boundingBox();if(hit.width<48||hit.height<48)throw Error('Format touch target');
    }
    for(const places of [2,4,10])await review.getByText(places+' lugares',{exact:true}).waitFor();
    if(calls.length||!review.url().endsWith('/organize/create'))throw Error('Format caused side effect');
    await radio('Jugar ahora').click();await review.getByText('Elegí una cancha disponible.',{exact:true}).waitFor();
    await chooseCourt();await capture('initial');
    await radio('Jugar ahora').click();await review.waitForURL('**/organize/quick?**');
    if(!review.url().includes('format=5v5')||!review.url().includes(court.id))throw Error('Quick route lost selections');
    await review.goBack();await review.waitForURL('**/organize/create');
    checks.push('default2v2, immediate1v1/2v2/5v5 radio selection with >=48 pt targets and no request/navigation; missing court blocks quick route');
    await radio('Planificar').click();
    if(await radio('Planificar').getAttribute('aria-checked')!=='true')throw Error('Planning selection missing');
    if(await review.getByRole('textbox',{name:'Personas ya presentes',exact:true}).count())throw Error('Present count in future mode');
    await review.locator('input[type="date"]').fill('2020-01-01');
    await review.getByText('Elegí hoy o una fecha futura.',{exact:true}).waitFor();if(calls.length)throw Error('Past date sent');
    const date=new Date(Date.now()+86400000*3), future=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
    await review.locator('input[type="date"]').fill(future);
    await review.locator('input[type="time"]').fill('18:00');
    await radio('Solo organizo').click();await review.getByText('10 lugares disponibles · 10 en total',{exact:true}).waitFor();
    await review.getByRole('textbox',{name:'Descripción (opcional)',exact:true}).fill('');
    await review.getByRole('heading',{name:'ARMAR PARTIDO',exact:true}).scrollIntoViewIfNeeded();await capture('planned');
    await review.getByText('5v5 · 10 lugares en total',{exact:true}).waitFor();
    await review.getByText('Armar un partido no reserva la cancha.',{exact:true}).waitFor();
    const color=await cta().evaluate(e=>getComputedStyle(e).backgroundColor);if(color!=='rgb(255, 138, 67)')throw Error('CTA orange mismatch');
    await cta().scrollIntoViewIfNeeded();await capture('planned-submit');
    checks.push('planned fields only after selection, past picker date blocked, solo organizer does not occupy a place; exact orange CTA');
    reject=true;await cta().click();await review.getByRole('alert').filter({hasText:'No pudimos completar la comprobación.'}).last().waitFor();reject=false;
    failRead=true;slow=true;await cta().click();await review.waitForFunction(()=>document.querySelector('[aria-label="Armar partido"]')?.getAttribute('aria-busy')==='true');
    await cta().evaluate(e=>e.click());if(await cta().isEnabled())throw Error('Busy submit enabled');
    const retry=review.getByRole('button',{name:'Reintentar comprobación',exact:true});await retry.waitFor();
    if(!review.url().includes('/organize/create'))throw Error('Navigated before readback');
    if(calls.length!==2)throw Error('Duplicate operation during busy');
    if(await radio('1v1').isEnabled())throw Error('Uncertain input editable');
    await capture('pending');
    failRead=false;slow=false;slowRead=true;await retry.click();
    await review.waitForFunction(()=>document.querySelector('[aria-label="Reintentar comprobación"]')?.getAttribute('aria-busy')==='true');
    if(!review.url().includes('/organize/create'))throw Error('Success shown before readback');
    await review.waitForURL('**/organize/'+gameId+'?created=1');slowRead=false;
    if(calls.length!==3||calls[1].p_request_id!==calls[2].p_request_id)throw Error('Replay changed request UUID');
    if(calls[2].p_data.timing!=='future'||calls[2].p_data.present_count!==0||calls[2].p_data.format!=='5v5')throw Error('Planned payload changed');
    checks.push('server rejection recoverable; busy blocks duplicate; uncertain readback freezes fields and retains UUID; confirmed planned creation navigates only after readback');
    await review.goto('http://localhost:8092/organize/quick');await picker().waitFor();
    if(await review.locator('input[type="date"]').count())throw Error('Quick exposes future date');
    await chooseCourt();await radio('Solo organizo').click();
    const count=review.getByRole('textbox',{name:'Personas ya presentes',exact:true});if(await count.inputValue()!=='0')throw Error('Organizer count incorrect');
    await radio('Juego').click();if(await count.inputValue()!=='1')throw Error('Playing organizer not counted once');
    await count.fill('5');await cta().click();await review.getByRole('alert').filter({hasText:/Elegí/}).first().waitFor();if(calls.length!==3)throw Error('Invalid present count submitted');
    await count.fill('2');await review.getByRole('heading',{name:'ARMAR PARTIDO',exact:true}).scrollIntoViewIfNeeded();await capture('quick');
    await cta().scrollIntoViewIfNeeded();await capture('quick-submit');
    await review.getByText('2v2 · 4 lugares en total',{exact:true}).waitFor();
    await review.getByRole('textbox',{name:'Descripción (opcional)',exact:true}).focus();
    await review.setViewportSize({width:402,height:500});await cta().scrollIntoViewIfNeeded();
    const hit=await cta().boundingBox();if(hit.y<0||hit.y+hit.height>500)throw Error('CTA inaccessible under resized viewport');
    await capture('keyboard-resize');await review.setViewportSize({width:402,height:874});
    await cta().click();await review.waitForURL('**/organize/'+gameId+'?created=1');
    if(calls.at(-1).p_data.timing!=='now'||calls.at(-1).p_data.present_count!==2||calls.at(-1).p_data.format!=='2v2')throw Error('Quick payload changed');
    checks.push('quick accepts actual court selection, no date/time, existing organizer/present bounds; confirmed immediate creation');
    catalogError=true;await review.goto('http://localhost:8092/organize/create');await review.getByRole('button',{name:'Reintentar canchas',exact:true}).waitFor();
    catalogError=false;await review.getByRole('button',{name:'Reintentar canchas',exact:true}).click();await picker().waitFor();
    catalogDelay=true;await review.reload();await review.getByText('Cargando canchas',{exact:true}).waitFor();await picker().waitFor();catalogDelay=false;
    await review.emulateMedia({reducedMotion:'reduce'});await review.setViewportSize({width:320,height:874});
    await radio('1v1').click();await radio('Planificar').click();
    const bounds=await review.locator('body').evaluate(e=>({client:e.clientWidth,scroll:e.scrollWidth}));if(bounds.scroll>bounds.client)throw Error('Narrow overflow');
    await capture('narrow');
    await review.evaluate(()=>{for(const e of document.querySelectorAll('div[dir="auto"]')){const s=getComputedStyle(e);e.style.fontSize=parseFloat(s.fontSize)*2+'px';e.style.lineHeight=parseFloat(s.lineHeight)*2+'px';}});
    const enlarged=await review.locator('body').evaluate(e=>({client:e.clientWidth,scroll:e.scrollWidth}));if(enlarged.scroll>enlarged.client)throw Error('Text stress overflow');
    await capture('text-stress');
    checks.push('catalog loading/error/retry, narrow viewport and reduced-motion rendering');
    return {checks,mode:'Actual Expo web, isolated simulated transport only; zero real backend writes',calls:calls.length};
  }catch(error){throw Error(String(error)+' | '+(await review.locator('body').innerText()).slice(0,1800));}
  finally{await context.close();}
}



