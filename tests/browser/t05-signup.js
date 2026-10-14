// Continue from t05-accessibility.js's actual consent -> signup screen.
async(page)=>{
 const f=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('t05-review-fixtures')));
 if(!f||!/^http:\/\/(127\.0\.0\.1|localhost|192\.168\.1\.13):55431$/.test(f.origin))throw Error('Local fixture guard required');
 await page.getByRole('button',{name:'Crear cuenta',exact:true}).click();await page.getByText('El nombre debe tener al menos 2 caracteres.',{exact:true}).waitFor();
 const input=await page.evaluate(()=>({email:`t05-${crypto.randomUUID()}@example.invalid`,password:crypto.randomUUID()+'Aa1!'}));
 await page.getByLabel('Nombre visible',{exact:true}).fill('Cuenta de prueba C');await page.getByLabel('Correo electrónico',{exact:true}).fill(input.email);await page.getByLabel('Contraseña',{exact:true}).fill(input.password);await page.getByLabel('Confirmar contraseña',{exact:true}).fill(input.password);
 await page.getByRole('button',{name:'Crear cuenta',exact:true}).click();await page.waitForURL('**/map');
 const token=await page.evaluate(()=>{const k=Object.keys(localStorage).find(k=>k.startsWith('sb-')&&k.endsWith('-auth-token'));return k?JSON.parse(localStorage.getItem(k)).access_token:null;});
 const user=await page.request.get(f.origin+'/auth/v1/user',{headers:{apikey:f.key,Authorization:'Bearer '+token}});if(user.status()!==200)throw Error('New signup account read failed');const u=await user.json();if(u.email!==input.email||!/^[0-9a-f-]{36}$/.test(u.id))throw Error('New signup ownership mismatch');f.accounts.push({...input,id:u.id,token});await page.evaluate(v=>sessionStorage.setItem('t05-review-fixtures',JSON.stringify(v)),f);
 await page.getByRole('tab',{name:'Perfil',exact:true}).click();await page.getByText('Cuenta de prueba C',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Mis canchas',exact:true}).click();await page.getByRole('heading',{name:'Todavía no agregaste canchas',exact:true}).waitFor();
 return {passed:3,checks:['Spanish signup retains field validation','Real signup after recorded development consent reaches original discovery','New C profile and My Courts are isolated from A/B']};
}
