import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";
import { requireDatabaseUrl } from "@/lib/env";

let cachedDb: NeonHttpDatabase<typeof schema> | undefined;

export function getDb() {
  if (!cachedDb) {
    const sql = neon(requireDatabaseUrl());
    cachedDb = drizzle(sql, { schema });
  }

  return cachedDb;
}
