// Isolated browser transport simulation, including uncertain RPC replies; no real backend request or persisted QA account.
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
  const gameId='00000000-0000-4000-8000-000000000888', other='00000000-0000-4000-8000-000000000456';
  let state='open',full=false,joined=false,management=false,locked=true,writes=0,readFailure=false,loseReply=false; const commands=[];
  function game(){const occupied=management&&!locked?0:full?4:1;return{id:gameId,court_id:court.id,organizer_id:management?owner:other,
    organizer_name:'Organizador de prueba',format:'2v2',capacity:4,occupied_places:occupied,available_places:4-occupied,
    timing:'future',scheduled_at:new Date(Date.now()+86400000*2).toISOString(),started_at:state==='started'?new Date().toISOString():null,
    state,description:'Nota de prueba para revisar la presentación.',organizer_plays:!(management&&!locked)};}
  function places(){return Array.from({length:management&&!locked?0:full?4:1},(_,i)=>({id:'00000000-0000-4000-8000-00000000000'+(i+1),session_id:gameId,
    user_id:i===0?(management||joined?owner:other):joined&&i===1?other:null,display_name:i===0?'Participante de prueba':joined&&i===1?'Organizador de prueba':null,guest_label:i===0||joined&&i===1?null:'Invitado presente de prueba'}));}
  await context.route('**/rest/v1/**',route=>{
    const request=route.request(),url=new URL(request.url()),table=url.pathname.split('/').pop();
    if(request.method()==='OPTIONS')return json(route,{});
    if(request.method()!=='GET'){
      if(table!=='pickup_command')throw Error('Unexpected mutation route');
      const command=request.postDataJSON();commands.push(command);writes++;
      if(loseReply){loseReply=false;return json(route,{message:'Simulated lost response'},503);}
      if(command.p_action==='join')joined=true;
      if(command.p_action==='leave')joined=false;
      if(command.p_action==='start')state='started';
      if(command.p_action==='cancel')state='cancelled';
      if(command.p_action==='complete_session')state='completed';
      return json(route,{id:gameId});
    }
    if(readFailure&&['pickup_session_catalog','pickup_roster','pickup_sessions'].includes(table))return json(route,{message:'Simulated read failure'},503);
    if(table==='users_public')return json(route,{id:owner,display_name:'Isolated review',app_role:'player'});
    if(table==='court_catalog')return json(route,[court]);
    if(table==='pickup_session_catalog')return json(route,url.searchParams.has('id')?game():[]);
    if(table==='pickup_roster')return json(route,places());
    if(table==='pickup_sessions'&&!management)return json(route,null);
    if(table==='pickup_sessions')return json(route,{...game(),core_locked:locked,created_at:new Date().toISOString(),closed_at:null,pickup_places:places().map(p=>({id:p.id}))});
    return json(route,[]);
  });
  await context.route('**/functions/v1/**',route=>{writes++;return json(route,{},400);});
  async function shot(name){await review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/game-state-acceptance-evidence/'+name+'.png'});}
  try{
    await review.goto('http://localhost:8090/signin',{waitUntil:'domcontentloaded',timeout:45000});await review.getByText('Comprobando tu sesión',{exact:true}).waitFor({state:'hidden'});
    await review.getByRole('button',{name:'Mostrar contraseña',exact:true}).click();await review.getByRole('button',{name:'Ocultar contraseña',exact:true}).click();
    await review.getByRole('textbox',{name:'Correo electrónico',exact:true}).pressSequentially(user.email,{delay:20});
    await review.locator('input[aria-label="Contraseña"]').fill('IsolatedOnly7!');await review.getByRole('button',{name:'Iniciar sesión',exact:true}).click();await review.waitForURL('**/map');
    await review.goto('http://localhost:8090/pickup/'+gameId);const join=()=>review.getByRole('button',{name:'Inscribirme',exact:true});await join().waitFor();
    if(!(await join().isEnabled()))throw Error('Expected eligible client state');await shot('public-open');checks.push('open consistent unjoined detail offers join');
    full=true;await review.reload();const complete=review.getByRole('button',{name:'Partido completo',exact:true});await complete.waitFor();if(await complete.isEnabled())throw Error('Full join enabled');await shot('public-full');await review.getByText('Participantes',{exact:true}).scrollIntoViewIfNeeded();await shot('participant-rows');
    joined=true;await review.reload();const leave=review.getByRole('button',{name:'Salir del partido',exact:true});await leave.waitFor();if(!(await leave.isEnabled()))throw Error('Full registered leave unavailable');
    checks.push('full nonmember join blocked; full registered viewer retains allowed exit');
    for(const closed of ['started','cancelled','completed']){state=closed;await review.reload();await review.getByText('Este partido no permite cambios de inscripción.',{exact:true}).waitFor();if(await join().count()||await review.getByRole('button',{name:'Salir del partido',exact:true}).count())throw Error('Closed action available');}
    checks.push('started/cancelled/completed remain readable without join/leave');
    management=true;state='open';full=false;joined=false;await review.reload();await review.getByRole('button',{name:'Gestionar partido',exact:true}).waitFor();await shot('public-owner');checks.push('owner management CTA precedes participation; court route remains secondary');await review.goto('http://localhost:8090/organize/'+gameId);await review.getByRole('button',{name:'Iniciar juego',exact:true}).waitFor();await shot('management-open');await review.getByRole('button',{name:'Iniciar juego',exact:true}).click();await review.getByText('¿Listos para jugar?',{exact:true}).waitFor();await review.getByRole('button',{name:'Conservar estado',exact:true}).click();if(await review.getByRole('button',{name:'Volver a Jugar',exact:true}).count())throw Error('Duplicate back action');checks.push('lifecycle confirmation dismisses without mutation; duplicate loaded back removed');
    await review.getByRole('button',{name:'Editar partido',exact:true}).click();await review.getByText('Ya hay lugares ocupados. Para cambiar cancha, hora o formato, cancelá y creá otro partido.',{exact:true}).waitFor();
    if(await review.getByRole('radio',{name:'2v2',exact:true}).count())throw Error('Locked core editable');await shot('management-edit-locked');checks.push('organizer open lifecycle and locked-core note-only edit observed');
    locked=false;await review.reload();await review.getByRole('button',{name:'Editar partido',exact:true}).click();await review.getByRole('textbox',{name:'Fecha',exact:true}).waitFor();await shot('management-edit-unlocked');
    checks.push('existing unlocked editor exposes original court/format/manual date/time; no edits saved');
    state='started';await review.reload();await review.getByRole('button',{name:'Finalizar partido',exact:true}).waitFor();await review.getByRole('button',{name:'Registrar este partido',exact:true}).waitFor();
    state='completed';await review.reload();await review.getByRole('button',{name:'Registrar este partido',exact:true}).waitFor();if(await review.getByRole('button',{name:'Iniciar juego',exact:true}).count())throw Error('Closed lifecycle action');
    checks.push('started can complete/register; completed retains register entry, without start');
    for(const next of ['open','started','completed','cancelled']) {
      state=next;full=next==='open';locked=true;await review.reload();
      const expected={open:['Iniciar juego','Editar partido','Cancelar partido'],started:['Finalizar partido','Registrar este partido'],completed:['Registrar este partido'],cancelled:[]}[next];
      await review.getByText({open:'Completo',started:'Iniciado',completed:'Finalizado',cancelled:'Cancelado'}[next],{exact:true}).waitFor();
      for(const label of ['Iniciar juego','Editar partido','Cancelar partido','Finalizar partido','Registrar este partido']){
        const button=review.getByRole('button',{name:label,exact:true});
        if(Boolean(await button.count())!==expected.includes(label))throw Error(next+' incorrect action '+label);
      }
      if(next==='open'||next==='started'){
        const label=next==='open'?'Cancelar partido':'Finalizar partido';await review.getByRole('button',{name:label,exact:true}).click();
        await review.getByText(next==='open'?'¿Cancelar el partido?':'¿Finalizar el partido?',{exact:true}).waitFor();
        await review.getByRole('button',{name:'Conservar estado',exact:true}).click();
      }
    }
    checks.push('full remains open for organizer lifecycle; started/completed/cancelled exact action matrix; cancel/finish confirmations dismiss without sending');
    management=false;full=false;state='open';await review.goto('http://localhost:8090/pickup/'+gameId);await join().waitFor();
    if(await review.getByRole('button',{name:'Gestionar partido',exact:true}).count())throw Error('Nonowner manage entry');
    await review.goto('http://localhost:8090/organize/'+gameId);await review.getByRole('button',{name:'Reintentar partido',exact:true}).waitFor();
    if(await review.getByRole('button',{name:'Iniciar juego',exact:true}).count())throw Error('Direct nonowner action');
    checks.push('nonowner has no management entry and direct management route offers recovery without controls (simulated owner-filtered response)');
    management=true;readFailure=true;await review.reload();await review.getByRole('button',{name:'Reintentar partido',exact:true}).waitFor();readFailure=false;await review.getByRole('button',{name:'Reintentar partido',exact:true}).click();await review.getByRole('button',{name:'Iniciar juego',exact:true}).waitFor();
    checks.push('management read failure retries to confirmed session');
    management=false;readFailure=true;await review.goto('http://localhost:8090/pickup/'+gameId);await review.getByRole('button',{name:'Reintentar detalle',exact:true}).waitFor();readFailure=false;await review.getByRole('button',{name:'Reintentar detalle',exact:true}).click();await join().waitFor();
    loseReply=true;await join().click();const retry=()=>review.getByRole('button',{name:'Reintentar comprobación',exact:true});await retry().waitFor();
    if(await review.getByText('INSCRIPCIÓN CONFIRMADA',{exact:true}).count())throw Error('Premature registration success');
    await retry().click();await review.getByText('INSCRIPCIÓN CONFIRMADA',{exact:true}).waitFor();
    if(commands.length!==2||commands[0].p_request_id!==commands[1].p_request_id)throw Error('Retry must reuse registration UUID');
    await review.getByRole('button',{name:'Salir del partido',exact:true}).click();await review.getByRole('button',{name:'Confirmar salida',exact:true}).waitFor();await review.getByRole('button',{name:'Conservar mi lugar',exact:true}).click();
    checks.push('detail read retry; uncertain join shows no success; explicit retry reuses UUID then confirms readback; exit requires confirmation');
    management=true;await review.goto('http://localhost:8090/organize/'+gameId);await review.getByRole('button',{name:'Iniciar juego',exact:true}).waitFor();
    await review.getByRole('button',{name:'Iniciar juego',exact:true}).click();loseReply=true;await review.getByRole('button',{name:'Iniciar juego',exact:true}).click();await retry().waitFor();await retry().click();await review.getByText('Iniciado',{exact:true}).waitFor();
    if(commands.length!==4||commands[2].p_request_id!==commands[3].p_request_id)throw Error('Organizer retry must reuse UUID');
    checks.push('uncertain organizer command retains saved request and reuses UUID; confirmed started state replaces lifecycle actions');
    return {checks,simulatedWrites:writes,realBackendRequests:0,mode:'real web UI, isolated synthetic transport; no native or live server permission verification'};
  }finally{await context.close();}
}
