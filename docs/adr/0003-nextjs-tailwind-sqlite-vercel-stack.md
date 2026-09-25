# Next.js + TypeScript + Tailwind + SQLite/Drizzle on Vercel Free + Turso Free

We chose Next.js (App Router, React Server Components) with TypeScript, Tailwind CSS for Heritage-themed styling, Drizzle ORM over SQLite (via Turso managed edge SQLite on the free tier), deployed to Vercel's free tier. This gives a type-safe full-stack app with zero monthly hosting cost, automatic HTTPS, preview deploys, and a clean `StoreRepository` persistence seam that can swap from Turso to self-hosted SQLite or Postgres by changing one adapter file.

## Considered Options

- **SvelteKit**: Smaller bundles but smaller ecosystem and fewer managed-SQLite hosting options at the free tier.
- **Astro + React Islands**: Excellent for static content but less natural for the interactive Admin dashboard and cart flows.
- **Railway / Fly.io / VPS**: Persistent-disk hosting that simplifies SQLite (no Turso adapter) but introduces monthly costs (\$4–6/mo) and server management.
