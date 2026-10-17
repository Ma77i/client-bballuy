// Isolated browser transport simulation: no backend request or persisted QA account.
// Run with Playwright browser_run_code_unsafe against the existing local Metro.
async (page) => {
  const context = await page.context().browser().newContext({ viewport: { width: 402, height: 874 }, locale: 'es-UY', timezoneId: 'America/Montevideo' });
  const review = await context.newPage();
  const checks = [];
  const owner = '00000000-0000-4000-8000-000000000123';
  let displayName='Jugador de prueba'; let logoutFailure=true, logoutCalls=0;
  const user = { id: owner, email: 'isolated-review@example.com', aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {}, created_at: '2026-10-15T00:00:00Z' };
  const jwt = () => btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })) + '.' + btoa(JSON.stringify({ sub: owner, exp: Math.floor(Date.now()/1000)+3600 })) + '.review-only';
  const json = (route, body, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin':'*', 'access-control-allow-headers':'*', 'access-control-allow-methods':'GET,POST,DELETE,OPTIONS' }, body: JSON.stringify(body) });
  await context.route('**/auth/v1/**', route => {
    if (route.request().method() === 'OPTIONS') return json(route, {});
    if (route.request().url().includes('/token')) return json(route, { access_token: jwt(), refresh_token: 'review-only', token_type: 'bearer', expires_in: 3600, user });
    if (route.request().url().includes('/logout')) {logoutCalls++;return logoutFailure?json(route,{message:'Simulated logout failure'},503):json(route,{});}
    if (route.request().url().includes('/user')) return json(route, user);
    return json(route, {});
  });
  await context.route('**/rest/v1/**',route=>{
    if(route.request().method()==='OPTIONS')return json(route,{});
    if(route.request().method()!=='GET')throw Error('Unexpected data mutation');
    const table=new URL(route.request().url()).pathname.split('/').pop();
    if(table==='users_public')return json(route,{id:user.id,display_name:displayName,app_role:'player'});
    return json(route,[]);
  });
  async function signin(){
    await review.goto('http://localhost:8090/signin',{waitUntil:'domcontentloaded',timeout:45000});
    await review.getByText('Comprobando tu sesión',{exact:true}).waitFor({state:'hidden'});
    await review.getByRole('button',{name:'Mostrar contraseña',exact:true}).click();await review.getByRole('button',{name:'Ocultar contraseña',exact:true}).click();
    await review.getByRole('textbox',{name:'Correo electrónico',exact:true}).pressSequentially(user.email ?? 'no-email-fixture@example.com',{delay:10});
    await review.locator('input[aria-label="Contraseña"]').fill('IsolatedOnly7!');await review.getByRole('button',{name:'Iniciar sesión',exact:true}).click();await review.waitForURL('**/map');
    await review.goto('http://localhost:8090/profile');await review.getByText(displayName,{exact:true}).waitFor();
  }
  async function shot(name){await review.screenshot({path:'C:/Users/user/Documents/code/mobileApps/bball/client-bballuy/specs/003-arcade-ux-ui/profile-fidelity-evidence/'+name+'.png',fullPage:true});}
  async function bounds(){return review.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth}));}
  try{
    await signin();await review.getByText(user.email,{exact:true}).waitFor();
    if(await review.getByText('TU PERFIL',{exact:true}).count())throw Error('Duplicate content heading');
    for(const label of ['Mis canchas','Cerrar sesión']){const box=await review.getByRole('button',{name:label,exact:true}).boundingBox();if(!box||box.height<48)throw Error('Small touch target');}
    await shot('profile');checks.push('single header, actual account identity, decorative player and secondary actions with 48-unit targets');
    await review.getByRole('button',{name:'Mis canchas',exact:true}).click();await review.waitForURL('**/my-courts');await review.goto('http://localhost:8090/profile');
    checks.push('My Courts navigation preserved');
    const report=review.getByRole('button',{name:'Reportar un problema',exact:true});
    if(await report.count()){
      await review.evaluate(()=>{window.open=()=>{throw Error('Simulated mail handoff failure');};});
      await report.click();await review.getByRole('button',{name:'Reintentar reporte',exact:true}).waitFor();
      await review.getByText('No pudimos abrir tu app de correo. Reintentá o usá el contacto indicado.',{exact:true}).waitFor();
      await review.evaluate(()=>{window.open=()=>null;});await review.getByRole('button',{name:'Reintentar reporte',exact:true}).click();await report.waitFor();
      checks.push('configured support failure and retry preserved; no mail sent');
    }else checks.push('support absent under current configuration; UI handoff not exercised');
    await review.getByRole('button',{name:'Cerrar sesión',exact:true}).click();await review.getByRole('button',{name:'Reintentar cierre de sesión',exact:true}).waitFor();
    await review.getByText(displayName,{exact:true}).waitFor();logoutFailure=false;await review.getByRole('button',{name:'Reintentar cierre de sesión',exact:true}).click();await review.waitForURL('**/signin');
    checks.push('logout failure retains account; retry signs out and redirects');
    const previous=displayName;user.id='00000000-0000-4000-8000-000000000777';displayName='Otra cuenta con nombre largo para comprobar el ajuste de la ficha';user.email='another-account-with-long-email@example.com';
    await signin();if(await review.getByText(previous,{exact:true}).count())throw Error('Previous identity leaked');
    await review.setViewportSize({width:320,height:740});await shot('profile-small');let b=await bounds();if(b.width>b.viewport)throw Error('Horizontal overflow');
    checks.push('account switch replaces identity; long name and email at 320 width without horizontal overflow');
    await review.getByRole('button',{name:'Cerrar sesión',exact:true}).click();await review.waitForURL('**/signin');user.email=undefined;await signin();await review.getByText(displayName,{exact:true}).waitFor();if(await review.getByText('another-account-with-long-email@example.com',{exact:true}).count())throw Error('Stale email');
    await shot('profile-no-email');checks.push('missing email omitted on fresh authenticated session');
    return {checks,logoutCalls,mode:'actual web UI with isolated synthetic auth/REST, not physical native validation'};
  }finally{await context.close();}
}
