import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env.local (see .env.example).",
  );
}

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const client = globalForDb.conn ?? postgres(connectionString);

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = client;
}

export const db = drizzle(client, { schema });
