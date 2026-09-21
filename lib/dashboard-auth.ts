import "server-only";

import { headers } from "next/headers";

import { authUser } from "@/db/schema";
import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function isDashboardAuthenticated() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  return Boolean(session?.user);
}

export async function requireDashboardAuthentication() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized dashboard action");
  return session.user;
}

export async function hasAdminUser(): Promise<boolean> {
  const [row] = await getDb().select({ id: authUser.id }).from(authUser).limit(1);
  return Boolean(row);
}
