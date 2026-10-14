async (page) => {
  const fixture=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('t05-review-fixtures'))), id=await page.evaluate(()=>sessionStorage.getItem('t05-session-id'));
  if(!fixture||!/^http:\/\/(127\.0\.0\.1|localhost|192\.168\.1\.13):55431$/.test(fixture.origin))throw Error('Local fixtures required');
  const checks=[];function check(v,label){if(!v)throw Error(label);checks.push(label);}
  await page.goto('http://localhost:8090/profile',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Cerrar sesión',exact:true}).click();await page.waitForURL('**/signin');
  await page.getByPlaceholder('tu@correo.com').fill(fixture.accounts[1].email);await page.getByPlaceholder('Ingresá tu contraseña').fill(fixture.accounts[1].password);await page.getByRole('button',{name:'Iniciar sesión',exact:true}).click();await page.waitForURL('**/map');
  await page.goto('http://localhost:8090/pickup/'+id,{waitUntil:'networkidle'});const join=()=>page.getByRole('button',{name:'Inscribirme',exact:true});const retry=page.getByRole('button',{name:'Reintentar comprobación',exact:true});
  await page.getByRole('button',{name:/^(Inscribirme|Salir de la convocatoria|Reintentar comprobación)$/,exact:true}).waitFor();
  if(await retry.count())await retry.click();
  const existing=page.getByRole('button',{name:'Salir de la convocatoria',exact:true});
  if(await existing.count()){await existing.click();await page.getByRole('button',{name:'Confirmar salida',exact:true}).click();}
  await join().waitFor();
  let release,entered;const gate=new Promise(resolve=>release=resolve), started=new Promise(resolve=>entered=resolve);const watchdog=setTimeout(()=>release(),10000);let writes=0;const requestIds=[];
  const hold=async route=>{const body=route.request().postDataJSON();if(body.p_action==='join'){writes++;requestIds.push(body.p_request_id);entered();await gate;}await route.continue();};
  const pattern='**/rest/v1/rpc/pickup_command';await page.route(pattern,hold);
  const readFailure=async route=>{if(new URL(route.request().url()).searchParams.get('id')==='eq.'+id)await route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({message:'Local readback failure'})});else await route.continue();};
  await page.route('**/rest/v1/pickup_session_catalog*',readFailure);
  await join().click();await started;await page.getByRole('heading',{name:'Comprobando inscripción',exact:true}).waitFor();
  check(await join().isDisabled(),'Join is busy/disabled before server response');await join().click({force:true});check(writes===1,'Duplicate pending press sends one request');
  check(await page.getByText('INSCRIPCIÓN CONFIRMADA',{exact:true}).count()===0,'Pending join cannot show confirmed registration');
  release();clearTimeout(watchdog);await page.getByRole('button',{name:'Reintentar comprobación',exact:true}).waitFor();
  check(await page.getByText('INSCRIPCIÓN CONFIRMADA',{exact:true}).count()===0,'Committed write with lost readback remains uncertain');
  check(await page.getByRole('button',{name:'Salir de la convocatoria',exact:true}).count()===0,'Uncertainty blocks opposite action');
  await page.unroute('**/rest/v1/pickup_session_catalog*',readFailure);await page.unroute(pattern,hold);
  const replay= req=>{if(req.url().includes('/rpc/pickup_command')&&req.postDataJSON().p_action==='join')requestIds.push(req.postDataJSON().p_request_id);};page.on('request',replay);
  await page.getByRole('button',{name:'Reintentar comprobación',exact:true}).click();await page.getByRole('button',{name:'Salir de la convocatoria',exact:true}).waitFor();page.removeListener('request',replay);
  check(requestIds.length===2&&requestIds[0]===requestIds[1],'Uncertain retry reuses the same request UUID');
  check(await page.getByText('INSCRIPCIÓN CONFIRMADA',{exact:true}).isVisible(),'Registration appears only after confirmed readback');
  await page.getByRole('button',{name:'Salir de la convocatoria',exact:true}).click();await page.getByRole('button',{name:'Confirmar salida',exact:true}).waitFor();check(true,'Leave keeps explicit confirmation');
  await page.getByRole('button',{name:'Confirmar salida',exact:true}).click();await join().waitFor();
  await page.waitForFunction(()=>{const b=document.querySelector('[role="button"][aria-label="Inscribirme"]');return b && !b.hasAttribute('disabled') && b.getAttribute('aria-disabled')!=='true';});
  check(!await join().isDisabled(),'Confirmed leave releases the place');
  await join().click();await page.getByRole('button',{name:'Salir de la convocatoria',exact:true}).waitFor();check(true,'Rejoin succeeds with actual remaining capacity');
  await page.goto('http://localhost:8090/pickup/mine',{waitUntil:'networkidle'});await page.getByRole('button',{name:/^Ver convocatoria 1v1 en Palermo: Completa$/}).waitFor();check(true,'Full card appears in actual personal sessions');
  await page.goto('http://localhost:8090/profile',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Cerrar sesión',exact:true}).click();await page.waitForURL('**/signin');await page.getByPlaceholder('tu@correo.com').fill(fixture.accounts[0].email);await page.getByPlaceholder('Ingresá tu contraseña').fill(fixture.accounts[0].password);await page.getByRole('button',{name:'Iniciar sesión',exact:true}).click();await page.waitForURL('**/map');
  return {passed:checks.length,checks};
}
