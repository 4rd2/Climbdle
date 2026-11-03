import {neon} from '@neondatabase/serverless';
import {readdir,readFile} from 'node:fs/promises';
if(!process.env.DATABASE_URL)throw new Error('Set DATABASE_URL as a server environment variable before running migrations.');
const sql=neon(process.env.DATABASE_URL);
await sql`CREATE TABLE IF NOT EXISTS crux_schema_migrations(name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
const files=(await readdir(new URL('../drizzle-auth/',import.meta.url))).filter(n=>n.endsWith('.sql')).sort().map(n=>['auth/'+n,new URL('../drizzle-auth/'+n,import.meta.url)]);
files.push(['game/001-game.sql',new URL('../sql/001-game.sql',import.meta.url)]);
for(const [name,url] of files){
 const done=await sql`SELECT name FROM crux_schema_migrations WHERE name=${name}`;if(done.length)continue;
 const statements=(await readFile(url,'utf8')).replaceAll('--> statement-breakpoint','').split(';').map(s=>s.trim()).filter(Boolean);
 await sql.transaction([...statements.map(s=>sql.query(s)),sql`INSERT INTO crux_schema_migrations(name) VALUES (${name})`]);
 console.log('Applied '+name);
}
console.log('Neon schema is ready.');
