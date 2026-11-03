import {neon} from '@neondatabase/serverless';
import {createAuth,isConfigured} from '../../../lib/auth';
import {dayKey,puzzleFor,isCorrect,normalize} from '../../../public/puzzles.js';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
async function handle(req:Request){
 const path=new URL(req.url).pathname;
 if(path==='/api/config')return json({configured:isConfigured(),google:Boolean(process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET)});
 if(!isConfigured())return json({error:'Accounts are not connected yet.'},503);
 let connection:ReturnType<typeof createAuth>|undefined;
 try{
 connection=createAuth();const {auth}=connection;
 if(path.startsWith('/api/auth/'))return await auth.handler(req);
 const sql=neon(process.env.DATABASE_URL!);const day=dayKey();
 if(path==='/api/leaderboard'&&req.method==='GET'){
 const scores=await sql`SELECT u.name, jsonb_array_length(r.guesses) AS attempts FROM crux_runs r JOIN "user" u ON u.id=r.user_id WHERE r.day=${day} AND r.solved=true ORDER BY jsonb_array_length(r.guesses),r.completed_at LIMIT 50`;
 return json({day,scores});}
 const session=await auth.api.getSession({headers:req.headers});
 if(!session)return json({error:'Please sign in.'},401);
 if(path==='/api/progress'&&req.method==='GET'){
 const rows=await sql`SELECT guesses,solved FROM crux_runs WHERE user_id=${session.user.id} AND day=${day}`;
 return json({day,state:rows[0]||{guesses:[],solved:false}});}
 if(path==='/api/guess'&&req.method==='POST'){
 if(req.headers.get('origin')!==new URL(process.env.BETTER_AUTH_URL!).origin)return json({error:'Invalid origin.'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'JSON required.'},415);
 const bodyText=await req.text();if(bodyText.length>1024)return json({error:'Guess too long.'},413);
 const body=JSON.parse(bodyText);const guess=typeof body.guess==='string'?body.guess.trim():'';
 if(!normalize(guess)||guess.length>60)return json({error:'Enter a climbing term.'},400);
 const correct=isCorrect(guess,puzzleFor(day).answer);const normalized=normalize(guess);
 // Atomic upsert locks a user's daily run, so simultaneous guesses cannot lose attempts.
 const rows=await sql`INSERT INTO crux_runs(user_id,day,guesses,normalized_guesses,solved,completed_at) VALUES (${session.user.id},${day},${JSON.stringify([guess])}::jsonb,${JSON.stringify([normalized])}::jsonb,${correct},CASE WHEN ${correct} THEN now() ELSE NULL END) ON CONFLICT(user_id,day) DO UPDATE SET guesses=CASE WHEN crux_runs.solved OR crux_runs.normalized_guesses ? ${normalized} THEN crux_runs.guesses ELSE crux_runs.guesses || EXCLUDED.guesses END, normalized_guesses=CASE WHEN crux_runs.solved OR crux_runs.normalized_guesses ? ${normalized} THEN crux_runs.normalized_guesses ELSE crux_runs.normalized_guesses || EXCLUDED.normalized_guesses END, solved=crux_runs.solved OR EXCLUDED.solved,completed_at=COALESCE(crux_runs.completed_at,EXCLUDED.completed_at) RETURNING guesses,solved`;
 return json({day,state:rows[0]});}
 return json({error:'Not found.'},404);
 }catch{return json({error:'Connection unavailable. Please try again.'},503)}finally{if(connection)await connection.close().catch(()=>{});}
}
export const GET=handle;export const POST=handle;
