# 01: Interfaces, schema, Heritage shell & deploy to Vercel

**What to build:** A visitor can open a live `*.vercel.app` URL on mobile or desktop and see a Heritage-themed landing page with warm parchment/bronze aesthetics, editorial storytelling about Panchaloha and lost-wax casting, a fully responsive mobile-first navigation shell (drawer/hamburger on mobile, sticky header, touch-friendly navigation across Shop, Custom Work, My Orders, Sign In), and a working `/api/health` endpoint. Under the hood, all TypeScript interfaces (`CatalogService`, `AdminService`, `StoreRepository`), Drizzle schemas for all 5 entities (`PredefinedProduct`, `PortfolioPiece`, `Order`, `CommissionInquiry`, `Customer`), the `OrderStatus` enum (`Ordered` | `Shipped`), a full in-memory `StoreRepository` implementation for tests, the `logDomainEvent()` utility, seed data constants for all 6 Predefined Products and 5 Portfolio Pieces (with AI-generated images), and the Tailwind Heritage theme config (parchment `#F5F0E8`, dark bronze `#5C4033`, accent gold `#C8A951`, serif/sans font pairing, mobile-responsive breakpoints) are defined and ready for parallel tickets. The Vercel project is connected with auto-deploy on push, and a Turso database is provisioned with connection string in env vars.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Next.js App Router project with TypeScript bootstrapped and running locally
- [ ] Tailwind CSS configured with Heritage theme extension (palette, serif/sans fonts, responsive fluid typography, mobile-first spacing)
- [ ] Heritage-themed landing page with craft storytelling, responsive hero, and mobile-first layout (smooth scrolling, touch-friendly tap targets >= 44px)
- [ ] Responsive navigation shell: mobile drawer/slide-out menu for small screens and editorial header for desktop
- [ ] Drizzle ORM schemas defined for all 5 entities with `OrderStatus` enum
- [ ] TypeScript interfaces defined for `CatalogService`, `AdminService`, and `StoreRepository`
- [ ] Full in-memory `StoreRepository` implementation (all methods work, returns seed data)
- [ ] `logDomainEvent(event, payload, correlationId)` utility emitting structured JSON to stdout
- [ ] Seed data constants for 6 Predefined Products and 5 Portfolio Pieces with AI-generated images, descriptions, and pricing (₹800–₹4,500)
- [ ] `/api/health` endpoint returning `{ "status": "ok" }`
- [ ] Vercel project connected with auto-deploy on push to `main`
- [ ] Turso database provisioned, `DATABASE_URL` configured in Vercel env vars
- [ ] `ADMIN_EMAILS`, `ADMIN_PHONE`, `ADMIN_EMAIL` env vars configured
- [ ] In-memory repository smoke tests passing
- [ ] Verified responsive layout across mobile viewport (375px/390px) and desktop (1280px+)
- [ ] Live `*.vercel.app` URL accessible with Heritage landing page
