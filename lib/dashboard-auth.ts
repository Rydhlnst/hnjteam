import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const DASHBOARD_COOKIE = "hnj_dashboard_session";
const SESSION_MAX_AGE = 60 * 60 * 12;

function getCredentials() {
  const password = process.env.DASHBOARD_PASSWORD;
  const sessionSecret = process.env.DASHBOARD_SESSION_SECRET;

  if (!password || !sessionSecret) return null;
  return { password, sessionSecret };
}

function isEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function getSessionValue() {
  const credentials = getCredentials();
  if (!credentials) return null;

  return createHmac("sha256", credentials.sessionSecret)
    .update(credentials.password)
    .digest("base64url");
}

export function hasDashboardCredentials() {
  return Boolean(getCredentials());
}

export async function isDashboardAuthenticated() {
  const expectedSession = getSessionValue();
  if (!expectedSession) return false;

  const cookieStore = await cookies();
  const currentSession = cookieStore.get(DASHBOARD_COOKIE)?.value;
  return Boolean(currentSession && isEqual(currentSession, expectedSession));
}

export async function requireDashboardAuthentication() {
  if (!(await isDashboardAuthenticated())) throw new Error("Unauthorized dashboard action");
}

export async function createDashboardSession(password: string) {
  const credentials = getCredentials();
  const sessionValue = getSessionValue();
  if (!credentials || !sessionValue || !isEqual(password, credentials.password)) return false;

  const cookieStore = await cookies();
  cookieStore.set(DASHBOARD_COOKIE, sessionValue, {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: "/dashboard",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return true;
}

export async function clearDashboardSession() {
  const cookieStore = await cookies();
  cookieStore.delete(DASHBOARD_COOKIE);
}
