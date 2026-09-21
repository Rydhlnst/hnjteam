import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";

import { authAccount, authSession, authUser, authVerification } from "@/db/schema";
import { getDb } from "@/lib/db";

// Lazy singleton — defers DB access until first request, so Next.js can build without DATABASE_URL.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _auth: any;

export function getAuth() {
  if (!_auth) {
    const baseUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    // Accept both www and non-www variants so CORS doesn't block the setup/login forms.
    const trustedOrigins = Array.from(new Set([
      baseUrl,
      baseUrl.replace("://www.", "://"),
      baseUrl.replace("://", "://www."),
      process.env.NEXT_PUBLIC_SITE_URL,
    ].filter(Boolean) as string[]));

    _auth = betterAuth({
      baseURL: baseUrl,
      trustedOrigins,
      database: drizzleAdapter(getDb(), {
        provider: "pg",
        schema: {
          user: authUser,
          session: authSession,
          account: authAccount,
          verification: authVerification,
        },
      }),
      emailAndPassword: { enabled: true },
      plugins: [username()],
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return _auth;
}
