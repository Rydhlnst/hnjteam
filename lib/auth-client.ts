import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

// No baseURL — the client uses relative paths (/api/auth/...) so requests always go
// to the same origin as the page, avoiding CORS issues with www vs non-www.
export const authClient = createAuthClient({
  plugins: [usernameClient()],
});
