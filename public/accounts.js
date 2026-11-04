// Better Auth's same-origin endpoints use HttpOnly session cookies.
export async function request(path,body){const r=await fetch(path,{method:body===undefined?'GET':'POST',credentials:'same-origin',headers:body===undefined?{}:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});const data=await r.json();if(!r.ok)throw new Error(data.message||data.error||'Please try again.');return data}
export const getConfig=()=>request('/api/config');
export const getSession=()=>request('/api/auth/get-session');
export const signIn=(username,password)=>request('/api/auth/sign-in/username',{username,password});
export const signInEmail=(email,password)=>request('/api/auth/sign-in/email',{email,password});
export const setUsername=username=>request('/api/auth/update-user',{username});
export const signUp=(username,email,password)=>request('/api/auth/sign-up/email',{name:username,username,email,password});
export const signOut=()=>request('/api/auth/sign-out',{});
export const googleSignIn=()=>request('/api/auth/sign-in/social',{provider:'google',callbackURL:location.origin});
