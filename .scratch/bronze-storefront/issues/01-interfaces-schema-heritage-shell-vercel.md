# 01: Interfaces, schema, Heritage shell & deploy to Vercel

**What to build:** A visitor can open a live `*.vercel.app` URL on mobile or desktop and see a Heritage-themed landing page with warm parchment/bronze aesthetics, editorial storytelling about Panchaloha and lost-wax casting, a fully responsive mobile-first navigation shell (drawer/hamburger on mobile, sticky header, touch-friendly navigation across Shop, Custom Work, My Orders, Sign In), and a working `/api/health` endpoint. Under the hood, all TypeScript interfaces (`CatalogService`, `AdminService`, `StoreRepository`), Drizzle schemas for all 5 entities (`PredefinedProduct`, `PortfolioPiece`, `Order`, `CommissionInquiry`, `Customer`), the `OrderStatus` enum (`Ordered` | `Shipped`), a full in-memory `StoreRepository` implementation for tests, the `logDomainEvent()` utility, seed data constants for all 6 Predefined Products and 5 Portfolio Pieces (with AI-generated images), and the Tailwind Heritage theme config (parchment `#F5F0E8`, dark bronze `#5C4033`, accent gold `#C8A951`, serif/sans font pairing, mobile-responsive breakpoints) are defined and ready for parallel tickets. The Vercel project is connected with auto-deploy on push, and a Turso database is provisioned with connection string in env vars.

**Blocked by:** None (can start immediately).

**Status:** ready-for-human

- [x] Next.js App Router project with TypeScript bootstrapped and running locally
- [x] Tailwind CSS configured with Heritage theme extension (palette, serif/sans fonts, responsive fluid typography, mobile-first spacing)
- [x] Heritage-themed landing page with craft storytelling, responsive hero, and mobile-first layout (smooth scrolling, touch-friendly tap targets >= 44px)
- [x] Responsive navigation shell: mobile drawer/slide-out menu for small screens and editorial header for desktop
- [x] Drizzle ORM schemas defined for all 5 entities with `OrderStatus` enum
- [x] TypeScript interfaces defined for `CatalogService`, `AdminService`, and `StoreRepository`
- [x] Full in-memory `StoreRepository` implementation (all methods work, returns seed data)
- [x] `logDomainEvent(event, payload, correlationId)` utility emitting structured JSON to stdout
- [x] Seed data constants for 6 Predefined Products and 5 Portfolio Pieces with AI-generated images, descriptions, and pricing (₹800–₹4,500)
- [x] `/api/health` endpoint returning `{ "status": "ok" }`
- [x] Vercel project connected with auto-deploy on push to `main` (interactive setup wizard provided via `scripts/setup-deployment.sh`)
- [x] Turso database provisioned, `DATABASE_URL` configured in Vercel env vars (guided by `scripts/setup-deployment.sh`)
- [x] `ADMIN_EMAILS`, `ADMIN_PHONE`, `ADMIN_EMAIL` env vars configured in `.env.example`
- [x] In-memory repository smoke tests passing
- [x] Verified responsive layout across mobile viewport (375px/390px) and desktop (1280px+)
- [x] Live `*.vercel.app` URL accessible with Heritage landing page

