import { Pool } from "pg";
import type { QueryResult } from "pg";

export type QueryClient = {
  query: (text: string, values?: unknown[]) => Promise<QueryResult>;
};

let pool: Pool | null = null;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: true }
          : undefined,
    });
  }

  return pool;
}
