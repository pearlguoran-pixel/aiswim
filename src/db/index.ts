import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add it to your .env.local (locally) or in the Vercel project's Environment Variables (in production)."
  );
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
