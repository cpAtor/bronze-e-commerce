Status: ready-for-agent

## Problem Statement

A bronze craftsperson who sells ready-made artisanal bronze wares (mugs, water bottles, water pots, jewellery, urli, pooja sets) and accepts bespoke temple idol and accessory commissions has no online presence. Customers cannot browse or purchase Predefined Products, and temple committees cannot submit Commission Inquiries. The Admin manages everything through phone calls and paper notes with no catalog, order tracking, or disaster recovery.

## Solution

A self-hosted, Heritage-themed e-commerce storefront and Admin dashboard that serves two distinct flows:

1. **Predefined Product checkout** — Customers browse a curated catalog of 6 bronze items, add them to a cart, and place an Order with flat-rate shipping. They see their Order Status (`Ordered` or `Shipped` with courier tracking link) and contact the Admin via pre-filled WhatsApp/Email/Phone links for any questions.
2. **Custom temple commission intake** — Customers browse a Portfolio of 5 showcase pieces, then submit a Commission Inquiry form capturing specs and a phone number for callback. Follow-up happens entirely via WhatsApp, Email, or Phone — not through in-platform messaging.

The Admin manages everything from a `/admin` dashboard: catalog and portfolio CRUD, marking Orders as Shipped with tracking links, reviewing incoming Commission Inquiries for callback, and one-click Store Snapshot export/restore for disaster recovery.

Both roles authenticate via Google OAuth. Admin is distinguished by an `ADMIN_EMAILS` environment variable whitelist.

## User Stories

### Customer — Browsing & Discovery

1. As a Customer, I want to see a Heritage-themed landing page with warm bronze/parchment aesthetics and editorial storytelling about Panchaloha and lost-wax casting, so that I trust the craftsmanship before browsing.
2. As a Customer, I want to browse a categorized catalog of Predefined Products with AI-generated studio-lit images, weights, dimensions, alloy descriptions, and prices in ₹ INR, so that I can evaluate items before buying.
3. As a Customer, I want to view a detailed Predefined Product page with multiple images, a care guide, and an "Add to Cart" button, so that I can inspect an item fully before purchasing.
4. As a Customer, I want to browse a Portfolio of past and representative custom bronze temple works with reference dimensions, casting technique descriptions, and finish options, so that I understand the range of bespoke capabilities.
5. As a Customer, I want to view a detailed Portfolio Piece page with multiple images and a "Request Custom Quote" call-to-action, so that I can be inspired to commission similar work.

### Customer — Cart & Checkout

6. As a Customer, I want to add one or more Predefined Products to a cart with quantity selection, so that I can buy multiple items in one Order.
7. As a Customer, I want to see my cart with line items, quantities, unit prices, subtotal, and shipping cost (₹0 above ₹2,500 or flat ₹150 below), so that I know the total before checkout.
8. As a Customer, I want to update quantities or remove items from my cart, so that I can adjust before placing an Order.
9. As a Customer, I want to enter a shipping address and optional phone number during checkout, so that the Admin knows where to ship.
10. As a Customer, I want to place an Order and receive an Order ID (`ORD-XXXX`), so that I have a reference for tracking and follow-up.
11. As a Customer, I want to see an Order confirmation page with my Order ID, items, total, and shipping address, plus pre-filled WhatsApp, Email, and Phone links to contact the Admin, so that I can reach out immediately if needed.

### Customer — Order Tracking

12. As a Customer, I want to view my Order history in a "My Orders" dashboard showing all my Orders with their current Order Status (`Ordered` or `Shipped`), so that I can track fulfillment at a glance.
13. As a Customer, I want to view a single Order's detail page showing items, shipping address, Order Status, and (when shipped) a clickable courier tracking link, so that I can track my package.
14. As a Customer, I want to see pre-filled WhatsApp, Email, and Phone links on every Order detail page (pre-loaded with my Order ID), so that I can contact the Admin through my preferred channel.

### Customer — Commission Inquiries

15. As a Customer, I want to submit a Commission Inquiry form capturing item type, deity/iconography, dimensions, finish preference (antique patina or mirror polish), target date, and my phone number for callback, so that the Admin can reach me to discuss the commission.
16. As a Customer, I want to optionally pre-fill the Commission Inquiry form from a specific Portfolio Piece, so that the Admin knows which showcase item inspired my request.
17. As a Customer, I want to receive a Commission Inquiry reference code (`COM-XXXX`) after submission with pre-filled WhatsApp, Email, and Phone links, so that I can follow up with the Admin about my specific inquiry.

### Customer — Authentication & Account

18. As a Customer, I want to sign in with my Google account, so that I don't need to remember a password.
19. As a Customer, I want to sign out, so that I can secure my account on shared devices.
20. As a Customer, I want to optionally add a phone number to my profile, so that the Admin can reach me via WhatsApp or SMS.

### Admin — Catalog & Portfolio Management

21. As an Admin, I want to view a list of all Predefined Products with name, price, stock status, and thumbnail, so that I can manage the catalog at a glance.
22. As an Admin, I want to create a new Predefined Product with name, description, price (₹), weight, dimensions, alloy description, care guide, stock quantity, and one or more images, so that Customers can discover and buy it.
23. As an Admin, I want to edit any Predefined Product's details (name, description, price, stock, images), so that I can update pricing or swap AI starter images with real photographs.
24. As an Admin, I want to delete a Predefined Product, so that discontinued items no longer appear in the storefront.
25. As an Admin, I want to view a list of all Portfolio Pieces with name, category, and thumbnail, so that I can manage the custom work showcase.
26. As an Admin, I want to create a new Portfolio Piece with name, description, reference dimensions, casting technique, finish options, typical lead time, and one or more images, so that Customers can see what I offer for custom commissions.
27. As an Admin, I want to edit or delete any Portfolio Piece, so that I can keep the showcase current.

### Admin — Order Management

28. As an Admin, I want to view a list of all Orders with Order ID, Customer name, date, total, and current Order Status, so that I can manage fulfillment.
29. As an Admin, I want to view a single Order's full detail (items, quantities, shipping address, Customer email, optional phone), so that I can prepare the shipment.
30. As an Admin, I want to mark an Order as `Shipped` with a courier tracking URL, so that the Customer sees the tracking link on their Order detail page.

### Admin — Commission Inquiry Review

31. As an Admin, I want to view a list of all Commission Inquiries with reference code, Customer name, item type, phone number, and date, so that I can see who to call back.
32. As an Admin, I want to view a single Commission Inquiry's full detail (all submitted specs, Customer contact details, inspired-by Portfolio Piece), so that I can prepare before calling the Customer back.

### Admin — Disaster Recovery & System Health

33. As an Admin, I want to export a Store Snapshot (a single downloadable JSON file containing all Predefined Products, Portfolio Pieces, Orders, and Commission Inquiries), so that I have a complete backup.
34. As an Admin, I want to restore from a Store Snapshot file with a confirmation prompt, so that I can recover from data loss.
35. As an Admin, I want to see a system health indicator on the `/admin` dashboard (database connectivity, last backup timestamp), so that I know the system is operational.

### Admin — Authentication

36. As an Admin, I want to sign in with my Google account and be routed to `/admin` if my email is in the `ADMIN_EMAILS` whitelist, so that I can manage the store securely.

### Storefront — Heritage Visual Identity & Starter Content

37. As a visitor (before login), I want to see the Heritage-themed storefront with warm parchment backgrounds, dark bronze accents, editorial serif typography, and museum-lit product photography, so that the site communicates artisanal quality.
38. As a visitor, I want the storefront to be seeded with 6 AI-generated Predefined Products (Bronze Kalash, Water Bottle, Mug, Jewellery Set, Urli, Pooja Set) with realistic studio photography, descriptions, and mid-range artisan pricing (₹800–₹4,500), so that the site is immediately usable.
39. As a visitor, I want the storefront to be seeded with 5 AI-generated Portfolio Pieces (Nataraja Murti, Prabhavali Arch, Deepastambha Lamp, Ghanta & Kalasham, Deity Kavacham) with showcase photography and craft descriptions, so that the custom commission capability is visible.

### Observability

40. As the system, I want to emit structured JSON log entries for every domain event (order.created, order.shipped, commission.submitted, product.created, product.updated, product.deleted, snapshot.exported, snapshot.restored) with a correlation ID, timestamp, and relevant payload, so that the hosting provider's log viewer is searchable.
41. As an external uptime monitor, I want a `/api/health` endpoint that returns HTTP 200 with `{ "status": "ok", "db": "connected" }` when the database is reachable and HTTP 503 otherwise, so that UptimeRobot or BetterStack can alert the Admin on downtime.

## Implementation Decisions

### Architecture — Three-Layer Service Split

- **`CatalogService`** (Customer-facing): browse Products and Portfolio (read-only), place Orders, view own Orders and Order Status (scoped by Google account ID), submit Commission Inquiries. This service has no methods for editing Products, updating Order Status, or viewing other Customers' data.
- **`AdminService`** (Admin-facing): full CRUD on Predefined Products and Portfolio Pieces, read all Orders, mark Orders as Shipped with tracking URL, read all Commission Inquiries, export and restore Store Snapshots.
- **`StoreRepository`** (shared data access): pure persistence — save, load, query, delete. No business rules, no access control. This is the single adapter that swaps from Turso/SQLite to Postgres by changing one file.

The service layer enforces access boundaries by interface shape: `CatalogService` physically lacks mutation methods on Products, so a Customer-facing route cannot accidentally call them.

### Tech Stack

- **Framework**: Next.js (App Router, React Server Components) with TypeScript
- **Styling**: Tailwind CSS — Heritage theme implemented as a Tailwind theme config (warm parchment palette, dark bronze accents, serif editorial font pairing)
- **ORM**: Drizzle ORM over SQLite
- **Database**: Turso (managed edge SQLite, free tier: 9GB storage, 500M row reads/month)
- **Hosting**: Vercel free tier (100GB bandwidth/month, serverless functions, automatic HTTPS), deployed from ticket 01 with auto-deploy on every push
- **Auth**: NextAuth.js with Google OAuth provider. Admin role determined by `ADMIN_EMAILS` env var whitelist. Added as a late-stage security overlay (ticket 07).

### Data Model (Entities)

- **PredefinedProduct**: id, name, slug, description, pricePaise (integer), weight, dimensions, alloyDescription, careGuide, stockQuantity, images (JSON array of URLs), createdAt, updatedAt
- **PortfolioPiece**: id, name, slug, description, referenceDimensions, castingTechnique, finishOptions (JSON), typicalLeadTime, images (JSON array of URLs), createdAt, updatedAt
- **Order**: id, orderCode (ORD-XXXX), customerId, items (JSON: productId, quantity, unitPricePaise), shippingAddress (JSON), shippingCostPaise, totalPaise, status (enum: Ordered | Shipped), courierTrackingUrl (nullable), createdAt, updatedAt
- **CommissionInquiry**: id, commissionCode (COM-XXXX), customerId, itemType, deityIconography, dimensions, finishPreference, targetDate, phoneNumber, inspiredByPortfolioId (nullable), createdAt
- **Customer**: id, googleId, email, name, avatarUrl, phoneNumber (nullable), createdAt

### Order Status (enum)

`Ordered` → `Shipped` (with `courierTrackingUrl`)

### Communication Model

All Customer ↔ Admin communication happens **off-platform** via pre-filled links:
- **WhatsApp**: `https://wa.me/<ADMIN_PHONE>?text=<encoded message with Order/Commission ref>`
- **Email**: `mailto:<ADMIN_EMAIL>?subject=<ref>&body=<context>`
- **Phone**: `tel:<ADMIN_PHONE>`

Environment variables: `ADMIN_PHONE`, `ADMIN_EMAIL`.

No in-platform messaging, no Order Inquiries, no Commission Stage management. The platform captures the initial request and tracks simple Order Status; all follow-up is human-to-human via WhatsApp/Email/Phone.

### Shipping Logic

- If cart subtotal ≥ ₹2,500 (250000 paise): shipping = ₹0
- Otherwise: flat ₹150 (15000 paise)

### Structured Logging

A `logDomainEvent(event, payload, correlationId)` utility writes JSON to stdout. Built into every feature ticket, not a separate concern. No custom dashboard — the hosting provider's log viewer (Vercel Logs) is the consumption surface.

### Disaster Recovery

- **Nightly automated backup**: A cron job (GitHub Actions or Vercel Cron) calls an internal snapshot export endpoint, serializes the database to JSON, and uploads to Cloudflare R2 or Backblaze B2 (free 10GB).
- **Manual export/restore**: Admin can trigger export and upload a snapshot file from `/admin` for instant restore with a confirmation prompt.

### Starter Content & AI Images

- 6 Predefined Products and 5 Portfolio Pieces seeded into the database on first run (or via a seed script).
- All product and portfolio images are AI-generated, styled to match the Heritage aesthetic (warm directional lighting, dark stone/teakwood backdrops, authentic patina and polished bronze textures).

## Testing Decisions

### What Makes a Good Test

Tests verify **external behavior through the service interfaces**, not internal implementation details. A test should describe a business scenario a Customer or Admin would recognize, not an internal database query shape.

### Two Testing Seams

1. **`CatalogService` seam** — Tests exercise Customer-facing operations backed by an in-memory `StoreRepository`. Scenarios: browsing Products, placing an Order with shipping calculation, viewing scoped Order history, submitting Commission Inquiries, and verifying that Product/Order mutation methods do not exist on this interface.
2. **`AdminService` seam** — Tests exercise Admin operations backed by the same in-memory `StoreRepository`. Scenarios: full Product and Portfolio CRUD, marking Orders as Shipped with tracking URL, reading Commission Inquiries, Store Snapshot export and restore round-trip.

### No Prior Art

This is a greenfield codebase. The two service-level test suites establish the testing pattern for all future code.

## Out of Scope

- **Payment gateway integration**: Orders are created and tracked, but actual payment processing (Razorpay, Stripe, UPI) is deferred. Payment confirmation is manual.
- **SMS / WhatsApp OTP authentication**: Deferred. Phone number is an optional profile/form field, not an auth method.
- **Automated notifications**: No transactional emails or SMS on Order Status changes. Customers check status on the site or contact Admin via WhatsApp/Email/Phone.
- **In-platform messaging**: No Order Inquiry submission/reply system. No Commission Stage management. All follow-up happens off-platform via WhatsApp, Email, or Phone.
- **Inventory enforcement**: Stock quantity is displayed but not enforced at checkout. Admin manages stock manually.
- **Search / filtering**: No full-text search or faceted filtering. The catalog is small enough to browse directly.
- **Multi-language / i18n**: English only, with Hindi/Tamil bronze terminology in descriptions.
- **Mobile app**: Web only, responsive design.
- **Commission pricing / invoicing**: Commission Inquiries capture specs for manual quoting via callback. No automated pricing or invoice generation.

## Further Notes

- All prices are stored in **paise** (integer) to avoid floating-point rounding errors. Display formatting divides by 100 and prefixes with ₹.
- The Heritage visual identity (warm parchment `#F5F0E8`, dark bronze `#5C4033`, accent gold `#C8A951`, serif heading font, sans-serif body font) is captured as a Tailwind theme extension, making it trivial to adjust later.
- The `StoreRepository` seam is designed so that migrating from Turso to self-hosted Postgres or PlanetScale requires changing only the repository adapter.
- AI-generated starter images should be replaced with real product photography as stock becomes available. The Admin dashboard's Product/Portfolio edit flow supports image upload and replacement.
