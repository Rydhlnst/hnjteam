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
    _auth = betterAuth({
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
