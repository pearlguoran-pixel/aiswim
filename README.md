# ICS Eagle Rays — Swim Team Website

Next.js (TypeScript, App Router) website for the International Community School Bangkok swim team.

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Hosting**: Vercel (recommended)
- **Database** *(coming soon)*: Neon (Serverless Postgres) + Drizzle ORM

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout + global metadata
│   ├── globals.css       # Brand tokens (navy, gold) + resets
│   ├── page.tsx          # Home page (server component)
│   └── page.module.css
├── components/
│   ├── Navbar.tsx / .module.css
│   ├── Hero.tsx / .module.css
│   ├── CountdownBar.tsx / .module.css   ← client component (live timer)
│   ├── MeetsList.tsx / .module.css      ← left column
│   ├── DatesList.tsx / .module.css      ← right column
│   └── ShieldLogo.tsx
└── lib/
    ├── types.ts           # Shared TypeScript types
    └── data.ts            # Static meet + dates data (replace with DB queries)
```

## Updating content

All meet and dates data lives in `src/lib/data.ts`. Edit the `meets` and `dates` arrays directly until the database layer is wired up.

To change the next-meet countdown target, update `NEXT_MEET_DATE`, `NEXT_MEET_NAME`, and `NEXT_MEET_DETAIL` at the top of `src/lib/data.ts`.

## Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo directly in the Vercel dashboard — it will auto-deploy on every push to `main`.

## Environment variables

Create a `.env.local` file for secrets (never commit this):

```env
# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Coach passcode (admin login)
COACH_PASSCODE=your-passcode-here

# Database (Neon) — add when ready
DATABASE_URL=postgresql://...

# AI (Groq) — add when ready
GROQ_API_KEY=your-groq-key-here
```

## Roadmap

- [ ] Records screen (filterable matrix)
- [ ] Swimmer profile pages (PB chart, meets analytics)
- [ ] Smart Roster (Male/Female toggle, filter sidebar)
- [ ] Coaches grid
- [ ] Admin: Data Import dashboard (PDF/CSV/Excel)
- [ ] Admin: AI Relay & Lineup Analyzer
- [ ] NextAuth passcode login
- [ ] Neon DB + Drizzle ORM wiring
