CREATE TABLE "user" (
 "id" text PRIMARY KEY NOT NULL,
 "name" text NOT NULL,
 "email" text NOT NULL UNIQUE,
 "emailVerified" boolean DEFAULT false NOT NULL,
 "image" text,
 "createdAt" timestamp DEFAULT now() NOT NULL,
 "updatedAt" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE "session" (
 "id" text PRIMARY KEY NOT NULL,
 "expiresAt" timestamp NOT NULL,
 "token" text NOT NULL UNIQUE,
 "createdAt" timestamp DEFAULT now() NOT NULL,
 "updatedAt" timestamp DEFAULT now() NOT NULL,
 "ipAddress" text,
 "userAgent" text,
 "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);
CREATE INDEX "session_user_idx" ON "session"("userId");
CREATE TABLE "account" (
 "id" text PRIMARY KEY NOT NULL,
 "accountId" text NOT NULL,
 "providerId" text NOT NULL,
 "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
 "accessToken" text,
 "refreshToken" text,
 "idToken" text,
 "accessTokenExpiresAt" timestamp,
 "refreshTokenExpiresAt" timestamp,
 "scope" text,
 "password" text,
 "createdAt" timestamp DEFAULT now() NOT NULL,
 "updatedAt" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX "account_user_idx" ON "account"("userId");
CREATE TABLE "verification" (
 "id" text PRIMARY KEY NOT NULL,
 "identifier" text NOT NULL,
 "value" text NOT NULL,
 "expiresAt" timestamp NOT NULL,
 "createdAt" timestamp DEFAULT now() NOT NULL,
 "updatedAt" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");
CREATE TABLE "rateLimit" (
 "id" text PRIMARY KEY NOT NULL,
 "key" text NOT NULL UNIQUE,
 "count" integer NOT NULL,
 "lastRequest" bigint NOT NULL
);
