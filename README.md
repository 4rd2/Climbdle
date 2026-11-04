# Climbdle
Daily Climbing Games to improve climbing terminology and understanding.

# Climbdle: Neon + Better Auth

Firebase has been removed. The site now has a server, Better Auth session-cookie authentication, and Neon PostgreSQL storage. Guest play works without configuration. Daily rollover is midnight America/New_York, including daylight saving time.

## Activate after creating Neon

1. Create a Neon project and obtain its PostgreSQL connection string. Store it as the server secret `DATABASE_URL`; never put it in browser JavaScript or commit it.
2. Generate a random secret with at least 32 characters and store it as `BETTER_AUTH_SECRET`.
3. Set `BETTER_AUTH_URL` to `https://crux-daily-climbing.pointypearl8.chatgpt.site` (or the final hosting origin).
4. With `DATABASE_URL` available in your local shell, run `node scripts/migrate-neon.mjs` once. This applies the included Better Auth and game SQL migrations transactionally and records them so reruns skip applied migrations.
5. Set the same three server variables in the hosting environment and redeploy. Do not expose a migration endpoint on the website.
6. Test account creation, sign-in, sign-out, a completed game, and cross-device progress before inviting players.

Email/password registration and login are enabled. Optional Google login appears only when both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set; authorize `/api/auth/callback/google` on the final origin as the Google OAuth redirect URI. Email verification and password recovery need an email delivery service and are not enabled in this initial integration.

The current Sites preview remains owner-private behind its existing access gate. Better Auth accounts are a separate application layer; this update does not change site sharing.

## Data model and behavior

Better Auth owns user, account, session, verification and rateLimit tables. `crux_runs` stores a user's daily attempts and completion. An atomic PostgreSQL upsert serializes concurrent attempts. The server obtains the user ID from the session, selects the current New York date and checks each answer; clients cannot supply an attempt count or a completed score. Equal scores share a leaderboard rank.

Guest and signed-in runs remain separate. Guest progress stays in local storage. The initial 31-term bank repeats, and is included in client code for guest play, so this is a casual game rather than a cheat-resistant competition.

## Development

Use Node 22.13 or later. Run `npm ci`, `npm test`, and `npm run dev`. Run `npm run build` for the Workers deployment. Keep secrets in environment variables or ignored local env files. Use `npx drizzle-kit generate --config drizzle.auth.config.ts` to generate future auth-schema migrations, then review them before running the migration script.

Live Neon and Better Auth flows cannot be verified until a database and secrets are configured.

References: https://better-auth.com/docs/installation and https://neon.com/docs/serverless/serverless-driver

## Username sign-in

Login uses a unique, case-insensitive username and password. New accounts choose a username (3–30 letters, numbers, or underscores) and still supply an email during registration. Existing users select “Already have an account without a username?”, sign in with their original email and password, and choose a username. Their user ID and game progress are retained.

Before deploying username support, run `node scripts/migrate-neon.mjs` with `DATABASE_URL` configured. This applies `drizzle-auth/0001_username.sql`, adding nullable username fields and a unique index without changing existing passwords. Do not deploy the username plugin before this migration has succeeded.
