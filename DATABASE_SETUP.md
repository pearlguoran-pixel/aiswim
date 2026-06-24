# Database Setup — Neon + Drizzle

This guide walks through creating the tables in your Neon database now that it's connected to Vercel.

## 1. Add the new files to your project

Copy these into your existing project, preserving the folder structure:

src/db/schema.ts
src/db/index.ts
src/db/seed.ts
drizzle.config.ts
.env.local.example
```

## 2. Install the new dependencies

```bash
npm install
```

This pulls in `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit`, `tsx`, and `dotenv` (all already added to `package.json`).

## 3. Get your connection string

1. Go to your project on [vercel.com](https://vercel.com) → **Storage** tab → your Neon database.
2. Copy the `DATABASE_URL` value (the pooled connection string works fine).

   Alternatively, in the Neon dashboard: **Connection Details** → copy the connection string.

## 4. Create your local env file

```bash
cp .env.local.example .env.local
```

Open `.env.local` and paste in your real `DATABASE_URL`. Leave the other fields blank for now — they're for later steps (auth, AI).

## 5. Push the schema to Neon

This is the actual "create the tables" step. Drizzle Kit reads `src/db/schema.ts` and creates matching tables in your database:

```bash
npm run db:push
```

You'll see a prompt confirming the tables to be created — say yes. This creates:

- `swimmers`
- `meets`
- `race_results`
- `school_records`
- `coaches`
- `calendar_events`

plus the enums (`school_section`, `stroke_type`, `gender_type`, `course_type`).

> **`db:push` vs. migrations:** `db:push` syncs your schema directly to the database — fast and great for this early stage. Once the schema stabilizes, switch to `npm run db:generate` (creates a SQL migration file) + `npm run db:migrate` (applies it) for a proper, version-controlled migration history.

## 6. (Optional) Seed starter data

To populate `meets` and `calendar_events` with the same data currently hardcoded on the home page:

```bash
npm run db:seed
```

## 7. Verify in Drizzle Studio

```bash
npm run db:studio
```

This opens a browser-based GUI where you can see and edit all your tables directly.

## 8. Add the env var to Vercel

So production also has access to the database:

1. Vercel project → **Settings** → **Environment Variables**.
2. Add `DATABASE_URL` (it may already be there automatically since you connected Neon through Vercel — double check).
3. Redeploy if you add it manually.

## Next steps

Once tables exist, the home page can be switched from the static `src/lib/data.ts` arrays to live queries against `meets` and `calendar_events` — happy to wire that up next.
