// Isolated browser transport simulation: no backend request or persisted QA account.
// Run with Playwright browser_run_code_unsafe against the existing local Metro.
async (page) => {
  const context = await page.context().browser().newContext({ reducedMotion: 'reduce', viewport: { width: 402, height: 874 }, locale: 'es-UY', timezoneId: 'America/Montevideo' });
  const review = await context.newPage();
  review.setDefaultTimeout(15000);
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
  const matchId='00000000-0000-4000-8000-000000000999',other='00000000-0000-4000-8000-000000000456';
  let emptyHistory=true,historyError=false,sessionError=false,emptySessions=false,loseReply=false,conflict=false;const commands=[],receipts=new Map();
  const match={id:matchId,court_id:court.id,organizer_id:owner,source_session_id:null,format:'1v1',state:'started',score_a:null,score_b:null,revision:0,created_at:new Date().toISOString(),closed_at:null};
  let roster=[{id:'00000000-0000-4000-8000-000000000001',match_id:matchId,side:'A',user_id:owner,guest_label:null,display_name:'Jugador de prueba'},
    {id:'00000000-0000-4000-8000-000000000002',match_id:matchId,side:'B',user_id:null,guest_label:'Invitado de prueba',display_name:null}];
  const history=[];
  function record(a,b){history.push({match_id:matchId,revision:match.revision+1,previous_a:match.score_a,previous_b:match.score_b,score_a:a,score_b:b,changed_at:new Date().toISOString()});Object.assign(match,{state:'completed',score_a:a,score_b:b,revision:match.revision+1,closed_at:new Date().toISOString()});}
  const games=['open','open','started','cancelled','completed'].map((state,i)=>{const format=['1v1','2v2','5v5','1v1','2v2'][i],capacity={'1v1':2,'2v2':4,'5v5':10}[format],occupied=i===1?capacity:1;return{
    id:'00000000-0000-4000-8000-00000000088'+i,court_id:court.id,organizer_id:owner,organizer_name:'Jugador de prueba',format,capacity,occupied_places:occupied,available_places:capacity-occupied,
    timing:'future',scheduled_at:new Date(Date.now()+86400000).toISOString(),started_at:state==='started'?new Date().toISOString():null,state,description:'',organizer_plays:i===0};});
  await context.route('**/rest/v1/**',async route=>{
    const request=route.request(),url=new URL(request.url()),table=url.pathname.split('/').pop();
    if(request.method()==='OPTIONS')return json(route,{});
    if(table==='pickup_command'){
      const command=request.postDataJSON();commands.push(command);
      if(command.p_expected_actor!==owner)return json(route,{code:'42501',message:'Wrong actor'},403);
      if(receipts.has(command.p_request_id))return json(route,{id:matchId});
      if(command.p_action==='score'){
        if(conflict){conflict=false;record(13,8);}
        if(command.p_data.expected_revision!==match.revision)return json(route,{code:'PT409',message:'Revision changed'},409);
        record(command.p_data.score_a,command.p_data.score_b);
      }else if(command.p_action==='create_match'){
        Object.assign(match,{state:'started',revision:0,score_a:null,score_b:null,closed_at:null,format:command.p_data.format,organizer_id:owner});history.length=0;emptyHistory=false;
        roster=command.p_data.players.map((p,i)=>({id:'00000000-0000-4000-8000-00000000000'+(i+1),match_id:matchId,side:p.side,user_id:p.user_id??null,guest_label:p.guest_label??null,display_name:p.user_id?'Jugador de prueba':null}));
      }else throw Error('Unexpected command');
      receipts.set(command.p_request_id,true);if(loseReply){loseReply=false;await new Promise(resolve=>setTimeout(resolve,700));return json(route,{message:'Simulated lost receipt'},503);}return json(route,{id:matchId});
    }
    if(request.method()!=='GET')throw Error('Unexpected mutation');
    if(table==='users_public')return json(route,{id:owner,display_name:'Jugador de prueba',app_role:'player'});
    if(table==='court_catalog')return json(route,[court]);
    if(table==='pickup_session_catalog')return sessionError?json(route,{message:'Simulated read failure'},503):json(route,emptySessions?[]:games);
    if(table==='pickup_roster')return json(route,emptySessions?[]:[{session_id:games[0].id,user_id:owner}]);
    if(table==='pickup_matches')return historyError?json(route,{message:'Simulated read failure'},503):json(route,url.searchParams.has('id')?match:emptyHistory?[]:[match]);
    if(table==='pickup_match_roster')return json(route,roster);
    if(table==='pickup_score_history')return historyError?json(route,{message:'Simulated read failure'},503):json(route,history);
    if(table==='court_memberships')return json(route,null);
    return json(route,[]);
  });
  await context.route('**/functions/v1/**',()=>{throw Error('No Edge mutations allowed');});
  async function shot(name){await review.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode().catch(()=>undefined))));await review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/t05-final-corrections-evidence/'+name+'.png'});}
  async function score(a,b){await review.getByRole('textbox',{name:'Resultado final del lado A',exact:true}).fill(String(a));await review.getByRole('textbox',{name:'Resultado final del lado B',exact:true}).fill(String(b));await review.getByRole('button',{name:'Revisar resultado final',exact:true}).click();}
  try{
    await review.goto('http://localhost:8090/signin',{waitUntil:'domcontentloaded',timeout:90000});await review.getByText('Comprobando tu sesión',{exact:true}).waitFor({state:'hidden'});
    await review.getByRole('button',{name:'Mostrar contraseña',exact:true}).waitFor({timeout:90000});await review.getByRole('button',{name:'Mostrar contraseña',exact:true}).click();await review.getByRole('button',{name:'Ocultar contraseña',exact:true}).click();
    await review.getByRole('textbox',{name:'Correo electrónico',exact:true}).pressSequentially(user.email,{delay:10});await review.locator('input[aria-label="Contraseña"]').fill('IsolatedOnly7!');await review.getByRole('button',{name:'Iniciar sesión',exact:true}).click();await review.waitForURL('**/map');
    await review.goto('http://localhost:8090/court/'+court.id);const cta=review.getByRole('button',{name:'Armar partido',exact:true});await cta.waitFor();
    const colors=await cta.evaluate(el=>({background:getComputedStyle(el).backgroundColor,label:getComputedStyle([...el.querySelectorAll('*')].find(n=>n.textContent==='Armar partido'&&n.childElementCount===0)).color}));
    if(colors.background!=='rgb(255, 138, 67)'||colors.label!=='rgb(12, 18, 32)')throw Error('Wrong contrast pair');await shot('court-contrast');checks.push('court CTA renders navy on approved orange (7.99:1)');
    await review.goto('http://localhost:8090/pickup/mine');await review.getByRole('button',{name:/Ver partido 1v1 en Palermo: Abierto/}).waitFor();
    for(const label of ['Abierto','Completo','Iniciado','Cancelado','Finalizado'])await review.getByText(label,{exact:true}).waitFor();await shot('my-games');
    if((await review.locator('body').innerText()).includes('convocatoria'))throw Error('Old personal copy');checks.push('My games sports cards show five true states and role/registration; no old terminology');
    sessionError=true;await review.reload();await review.getByRole('button',{name:'Reintentar mis partidos',exact:true}).waitFor();sessionError=false;await review.getByRole('button',{name:'Reintentar mis partidos',exact:true}).click();await review.getByText('Completo',{exact:true}).waitFor();
    emptySessions=true;await review.reload();await review.getByText('TU PRÓXIMO PARTIDO EMPIEZA ACÁ.',{exact:true}).waitFor();checks.push('personal read retry and empty state preserved');emptySessions=false;
    await review.goto('http://localhost:8090/matches/mine');await review.getByText('Todavía no registraste partidos.',{exact:true}).waitFor();await shot('history-empty');
    historyError=true;await review.reload();await review.getByRole('button',{name:'Reintentar partidos',exact:true}).waitFor();historyError=false;emptyHistory=false;await review.getByRole('button',{name:'Reintentar partidos',exact:true}).click();await review.getByText('Iniciado · resultado pendiente',{exact:true}).waitFor();await shot('history');checks.push('Spanish empty/history retry, recorded-match state and actual data');
    await review.getByRole('button',{name:'Ver partido registrado 1v1',exact:true}).click();await review.waitForURL('**/matches/'+matchId);await review.getByRole('button',{name:'Registrar resultado',exact:true}).click();await review.getByRole('button',{name:'Revisar resultado final',exact:true}).click();await review.getByText('Ingresá un número entero igual o mayor que cero.',{exact:true}).first().waitFor();
    await score(11,7);if(commands.length)throw Error('Review submitted early');loseReply=true;await review.getByRole('button',{name:'Confirmar resultado final',exact:true}).click();const sending=review.getByRole('button',{name:'Confirmar resultado final',exact:true});if(!(await sending.isDisabled())||await sending.getAttribute('aria-busy')!=='true')throw Error('Pending score not locked');checks.push('pending primary score action is busy/disabled before response');await review.getByRole('button',{name:'Reintentar comprobación',exact:true}).waitFor();await shot('result-uncertain');
    await review.getByRole('button',{name:'Reintentar comprobación',exact:true}).click();await review.getByText('Revisión 1: 11 – 7',{exact:true}).waitFor();
    if(commands.length!==2||commands[0].p_request_id!==commands[1].p_request_id||history.length!==1)throw Error('Duplicate or premature score');await shot('result-confirmed');await review.getByText('Palermo',{exact:true}).last().scrollIntoViewIfNeeded();await shot('result-summary');checks.push('score validation/review, uncertain committed response and same-UUID replay; one history row');
    await review.getByRole('button',{name:'Corregir resultado',exact:true}).click();await score(12,8);conflict=true;await review.getByRole('button',{name:'Confirmar resultado final',exact:true}).click();await review.getByText('El resultado o el partido cambiaron. Actualizá y revisá antes de guardar otra vez.',{exact:true}).waitFor();await review.getByText('Revisión 2: 13 – 8',{exact:true}).waitFor();
    await review.getByRole('button',{name:'Revisar resultado final',exact:true}).click();await review.getByRole('button',{name:'Confirmar resultado final',exact:true}).click();await review.getByText('Revisión 3: 12 – 8',{exact:true}).waitFor();await shot('result-correction');checks.push('concurrent correction conflict requires renewed review and preserves revisions 1/2/3');
    historyError=true;await review.reload();await review.getByRole('button',{name:'Reintentar partido',exact:true}).waitFor();if(await review.getByRole('button',{name:'Corregir resultado',exact:true}).count())throw Error('Unchecked edit offered');historyError=false;await review.getByRole('button',{name:'Reintentar partido',exact:true}).click();await review.getByRole('button',{name:'Corregir resultado',exact:true}).waitFor();
    match.organizer_id=other;await review.reload();await review.getByText('Revisión 3: 12 – 8',{exact:true}).waitFor();if(await review.getByRole('button',{name:'Corregir resultado',exact:true}).count())throw Error('Nonowner edit');checks.push('history read failure gates editing, retry restores it; nonowner cannot edit');
    await review.goto('http://localhost:8090/matches/create');await review.getByRole('radio',{name:'Palermo',exact:true}).click();await review.getByRole('radio',{name:/^5v5/}).click();if(await review.getByRole('textbox',{name:/nombre del invitado/}).count()!==10)throw Error('5v5 roster capacity');
    await review.getByRole('radio',{name:/^1v1/}).click();await review.getByRole('radio',{name:'Cuenta',exact:true}).first().click();await review.getByRole('button',{name:'Usar mi cuenta para Lado A · participante 1',exact:true}).click();await review.getByRole('textbox',{name:'Lado B · participante 1 · nombre del invitado',exact:true}).fill('Invitado de prueba');await review.getByRole('radio',{name:'Palermo',exact:true}).scrollIntoViewIfNeeded();await shot('register-match');
    await review.getByRole('button',{name:'Registrar partido',exact:true}).click();await review.waitForURL('**/matches/'+matchId);await review.getByText('Invitado sin cuenta',{exact:true}).waitFor();await review.getByText('Cuenta registrada',{exact:true}).waitFor();checks.push('existing registration 5v5/1v1 roster and real account/guest payload preserved');
    await review.setViewportSize({width:320,height:740});await review.getByText('Palermo',{exact:true}).last().scrollIntoViewIfNeeded();await shot('result-narrow');if(await review.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Narrow overflow');checks.push('narrow recorded detail reflows without horizontal overflow');
    return{checks,simulatedCommands:commands.length,realBackendWrites:0,mode:'real app UI, synthetic isolated auth/REST/RPC; no physical device or live permission claim'};
  }catch(error){throw Error(String(error)+' | '+review.url()+' | '+(await review.locator('body').innerText()).slice(0,1500));}finally{await context.close();}
}
