import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

// Use NEXT_PUBLIC_BETTER_AUTH_URL if set, otherwise fall back to NEXT_PUBLIC_SITE_URL.
// This must match BETTER_AUTH_URL on the server exactly (same www/non-www).
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL,
  plugins: [usernameClient()],
});
