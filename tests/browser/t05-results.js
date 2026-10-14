async (page)=>{
 const fixture=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('t05-review-fixtures'))),id=await page.evaluate(()=>sessionStorage.getItem('t05-session-id'));
 const checks=[];function check(v,label){if(!v)throw Error(label);checks.push(label);}
 await page.goto('http://localhost:8090/organize/'+id,{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Iniciar juego',exact:true}).click();await page.getByText('¿Listos para jugar?',{exact:true}).waitFor();check(true,'Start retains explicit confirmation');
 await page.getByRole('button',{name:'Iniciar juego',exact:true}).click();await page.getByRole('button',{name:'Finalizar convocatoria',exact:true}).waitFor();check(true,'Server confirms started state before lifecycle changes');
 await page.goto('http://localhost:8090/pickup/'+id,{waitUntil:'networkidle'});await page.getByText('Esta convocatoria no permite cambios de inscripción.',{exact:true}).waitFor();check(await page.getByRole('button',{name:/^(Inscribirme|Salir de la convocatoria)$/}).count()===0,'Started invitations expose no join/leave');
 await page.goto('http://localhost:8090/organize/'+id,{waitUntil:'networkidle'});await page.getByRole('button',{name:'Registrar este partido',exact:true}).click();await page.waitForURL('**/matches/create?*');
 const guests=page.getByRole('radio',{name:'Invitado',exact:true});await guests.nth(0).click();await guests.nth(1).click();
 await page.getByLabel('Lado A · participante 1 · nombre del invitado',{exact:true}).fill('Invitado de prueba A');await page.getByLabel('Lado B · participante 1 · nombre del invitado',{exact:true}).fill('Invitado de prueba B');
 await page.getByRole('button',{name:'Registrar partido',exact:true}).click();await page.waitForURL('**/matches/*');await page.getByRole('button',{name:'Registrar resultado',exact:true}).waitFor();
 const matchId=new URL(page.url()).pathname.split('/').pop();if(!/^[0-9a-f-]{36}$/.test(matchId))throw Error('Match ID missing');await page.evaluate(v=>sessionStorage.setItem('t05-match-id',v),matchId);
 check(true,'Linked match uses real same-court/format and explicit guest sides');
 await page.getByRole('button',{name:'Registrar resultado',exact:true}).click();await page.getByLabel('Resultado final del lado A',{exact:true}).fill('11');await page.getByLabel('Resultado final del lado B',{exact:true}).fill('8');
 await page.getByRole('button',{name:'Revisar resultado final',exact:true}).click();await page.getByRole('button',{name:'Confirmar resultado final',exact:true}).waitFor();check(true,'Score save retains review and confirmation');
 await page.getByRole('button',{name:'Confirmar resultado final',exact:true}).click();await page.getByRole('button',{name:'Corregir resultado',exact:true}).waitFor();await page.getByText('Revisión 1: 11 – 8',{exact:true}).waitFor();check(true,'Final score readback includes revision one history');
 await page.getByRole('button',{name:'Corregir resultado',exact:true}).click();await page.getByLabel('Resultado final del lado A',{exact:true}).fill('12');await page.getByRole('button',{name:'Revisar resultado final',exact:true}).click();await page.getByRole('button',{name:'Confirmar resultado final',exact:true}).click();await page.getByText('Revisión 2: 12 – 8',{exact:true}).waitFor();check(await page.getByText('Revisión 1: 11 – 8',{exact:true}).isVisible(),'Correction preserves the original result history');
 await page.goto('http://localhost:8090/pickup/'+id,{waitUntil:'networkidle'});await page.getByText('Esta convocatoria no permite cambios de inscripción.',{exact:true}).waitFor();check(await page.getByText('Esta convocatoria finalizó. El cierre no registra un resultado.',{exact:true}).isVisible(),'Linked invitation is closed after confirmed match score');
 await page.goto('http://localhost:8090/matches/mine',{waitUntil:'networkidle'});await page.getByRole('button',{name:'Ver partido registrado 1v1',exact:true}).waitFor();check(true,'Real recorded match appears in history');
 return {passed:checks.length,checks};
}
