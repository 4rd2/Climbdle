import {betterAuth} from 'better-auth';
import {drizzleAdapter} from 'better-auth/adapters/drizzle';
import {drizzle} from 'drizzle-orm/neon-serverless';
import {Pool} from '@neondatabase/serverless';
import * as schema from './auth-schema';
export function isConfigured(){return Boolean(process.env.DATABASE_URL&&process.env.BETTER_AUTH_SECRET&&process.env.BETTER_AUTH_URL)}
export function createAuth(){
 if(!isConfigured())throw new Error('Accounts are not configured');
 const pool=new Pool({connectionString:process.env.DATABASE_URL!});
 const db=drizzle(pool,{schema});
 const auth=betterAuth({database:drizzleAdapter(db,{provider:'pg',schema,transaction:true}),secret:process.env.BETTER_AUTH_SECRET,baseURL:process.env.BETTER_AUTH_URL,trustedOrigins:[process.env.BETTER_AUTH_URL!],emailAndPassword:{enabled:true,minPasswordLength:10},rateLimit:{enabled:true,storage:'database'},socialProviders:process.env.GOOGLE_CLIENT_ID&&process.env.GOOGLE_CLIENT_SECRET?{google:{clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET}}:{}});
 return {auth,close:()=>pool.end()};
}
