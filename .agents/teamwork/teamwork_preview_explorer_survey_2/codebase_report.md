# Codebase Baseline Survey Report

**Repository**: `bronze-e-commerce` (`/home/cp/Documents/bronze-e-commerce`)  
**Date**: 2026-09-25 (UTC 18:34:00Z)  
**Surveyor**: `teamwork_preview_explorer_survey_2`  
**Purpose**: Document the baseline architecture, test readiness, domain seams, and framework setup prior to the parallel implementation of Tasks 02, 03, and 04.

---

## 1. Executive Summary

- **Task 01 Status**: Completed and verified (`ready-for-human`). The core foundation is completely established: domain types, service contracts (`CatalogService`, `AdminService`, `StoreRepository`), Drizzle ORM schemas, full in-memory repository implementation with 11 passing Vitest tests, seed data (6 products, 5 portfolio pieces, real imagery), structured JSON telemetry (`logDomainEvent`), and Shopify Heritage layout/shell (`Navigation`, `Footer`, `HomePage`, `Instrument_Sans` typography, 44px tap targets).
- **Tasks 02, 03, 04 Status**: Unstarted (`ready-for-agent`), waiting for parallel workstreams. No route implementations or service implementations exist yet for `/shop`, `/custom-work`, `/admin`, or customer order tracking.
- **Baseline Quality Health**:
  - `pnpm test`: 100% passing (1 test suite, 11 tests, ~748ms).
  - `pnpm typecheck`: Clean (0 errors).
  - `pnpm build`: Clean production build (Next.js 15 App Router static generation + dynamic `/api/health`, 0 errors).
- **Working Tree**: Clean git status on `main` tracking `origin/main`.

---

## 2. Git Repository & Branch State

### Status & Branch Information
- **Current Branch**: `main`
- **Tracking**: `origin/main` (up to date)
- **Local Branches**: `main`
- **Remote Branches**: `origin/main`
- **Working Tree**: Clean (only untracked agent directory `.agents/teamwork/` and `ORIGINAL_REQUEST.md` present)

### Recent Commits (Top 5)
```
5627be0 (HEAD -> main, origin/main) feat(ui): replicate exact Shopify Heritage layout, asymmetric gallery, and borderless floating media
5e87daf docs(issue-01): mark all tasks completed and set status to ready-for-human
740e318 feat(theme): align design and color palette faithfully with shopify heritage theme demo
1175b06 feat(ci): add GitHub upload script with user-level gh cli support
29d6e8b fix(wizard): detach browser open and redirect stdin from /dev/tty to prevent terminal hang
```

---

## 3. Framework & Package Setup

### Dependencies (`package.json`)
- **Framework**: Next.js `15.1.7` (App Router)
- **UI Library**: React `19.0.0` / React DOM `19.0.0`
- **Database / ORM**:
  - `drizzle-orm`: `^0.39.3`
  - `drizzle-kit`: `^0.30.4`
  - `@libsql/client`: `^0.14.0` (libSQL / Turso SQLite driver)
- **Icons & Styling Utilities**:
  - `lucide-react`: `^0.475.0`
  - `clsx`: `^2.1.1`
  - `tailwind-merge`: `^3.0.1`
  - `tailwindcss`: `^3.4.17`
  - `postcss`: `^8.4.49`
  - `autoprefixer`: `^10.4.20`
- **Language & Testing**:
  - `typescript`: `^5.7.3`
  - `vitest`: `^3.0.5`
  - `@types/node`: `^20`
  - `@types/react`: `^19`
  - `@types/react-dom`: `^19`

### Available NPM Scripts
| Script | Command | Purpose |
|---|---|---|
| `pnpm dev` | `next dev` | Start Next.js development server |
| `pnpm build` | `next build` | Create production build |
| `pnpm start` | `next start` | Run production server |
| `pnpm typecheck` | `tsc --noEmit` | Strict TypeScript validation |
| `pnpm test` | `vitest run` | Run test suite once |
| `pnpm test:watch` | `vitest` | Run test suite in watch mode |
| `pnpm db:generate` | `drizzle-kit generate` | Generate Drizzle migrations |
| `pnpm db:push` | `drizzle-kit push` | Push schema changes directly to DB |
| `pnpm repo:upload` | `bash scripts/upload-to-github.sh` | Interactive upload helper |

---

## 4. Existing Source Code Architecture & Domain Seams

The project follows a clean architecture pattern where domain interfaces, schemas, and repositories are decoupled from presentation routes and external services.

```
src/
├── app/
│   ├── api/health/route.ts       # Health endpoint pinging LibSQL
│   ├── globals.css               # Heritage CSS variables, buttons, tap target utilities
│   ├── layout.tsx                # Instrument_Sans font, Navigation, Footer, meta
│   └── page.tsx                  # Heritage editorial landing page with 5 sections
├── components/
│   ├── Navigation.tsx            # Sticky header with drawer navigation & mobile menu
│   └── Footer.tsx                # Atelier footer with direct phone/WhatsApp/email
├── data/
│   └── seed-data.ts              # SEED_PREDEFINED_PRODUCTS (6) & SEED_PORTFOLIO_PIECES (5)
├── db/
│   └── schema.ts                 # Drizzle ORM SQLite schemas & relational queries
├── domain/
│   ├── events.ts                 # Structured telemetry & correlation ID generation
│   ├── services.ts               # CatalogService, AdminService, StoreRepository interfaces
│   └── types.ts                  # Core domain entities & DTO types
├── lib/
│   ├── config.ts                 # Central ADMIN_CONFIG (phone, email, whitelist)
│   └── utils.ts                  # cn, formatPaiseToInr, calculateShippingPaise
└── repositories/
    ├── in-memory-repository.ts   # StoreRepository in-memory implementation
    └── in-memory-repository.test.ts # Comprehensive unit tests
```

### Key Domain Seams

#### 1. Store Repository Seam (`src/domain/services.ts`, `StoreRepository`)
A pure persistence seam providing CRUD and query methods without business logic:
- **Products**: `findProductById`, `findProductBySlug`, `listProducts`, `saveProduct`, `deleteProduct`.
- **Portfolio Pieces**: `findPortfolioPieceById`, `findPortfolioPieceBySlug`, `listPortfolioPieces`, `savePortfolioPiece`, `deletePortfolioPiece`.
- **Orders**: `findOrderById`, `findOrderByCode`, `listOrdersByCustomerId`, `listAllOrders`, `saveOrder`.
- **Commission Inquiries**: `findCommissionInquiryById`, `findCommissionInquiryByCode`, `listCommissionInquiries`, `saveCommissionInquiry`.
- **Customers**: `findCustomerById`, `findCustomerByGoogleId`, `saveCustomer`.
- **Disaster Recovery**: `getSnapshotData`, `restoreSnapshotData`.

#### 2. Service Interfaces (`src/domain/services.ts`)
- `CatalogService`:
  - `getProducts(): Promise<PredefinedProduct[]>`
  - `getProductBySlug(slug: string): Promise<PredefinedProduct | null>`
  - `getProductById(id: string): Promise<PredefinedProduct | null>`
  - `getPortfolioPieces(): Promise<PortfolioPiece[]>`
  - `getPortfolioPieceBySlug(slug: string): Promise<PortfolioPiece | null>`
  - `getPortfolioPieceById(id: string): Promise<PortfolioPiece | null>`
  - `calculateShipping(subtotalPaise: number): number`
  - `createOrder(input: CreateOrderInput, correlationId?: string): Promise<Order>`
  - `getOrdersByCustomer(customerId: string): Promise<Order[]>`
  - `getOrderById(orderId: string, customerId: string): Promise<Order | null>`
  - `submitCommissionInquiry(input: SubmitCommissionInquiryInput, correlationId?: string): Promise<CommissionInquiry>`
- `AdminService`:
  - Product CRUD: `getAllProducts`, `getProductById`, `createProduct`, `updateProduct`, `deleteProduct`.
  - Portfolio CRUD: `getAllPortfolioPieces`, `getPortfolioPieceById`, `createPortfolioPiece`, `updatePortfolioPiece`, `deletePortfolioPiece`.
  - Orders: `getAllOrders`, `getOrderById`, `markOrderShipped`.
  - Commissions: `getAllCommissionInquiries`, `getCommissionInquiryById`.
  - Snapshots: `exportSnapshot`, `restoreSnapshot`.

#### 3. Database Schema (`src/db/schema.ts`)
- Table `predefined_products`: `id`, `name`, `slug`, `description`, `price_paise`, `weight`, `dimensions`, `alloy_description`, `care_guide`, `stock_quantity`, `images` (JSON array), `created_at`, `updated_at`.
- Table `portfolio_pieces`: `id`, `name`, `slug`, `description`, `reference_dimensions`, `casting_technique`, `finish_options` (JSON array), `typical_lead_time`, `images` (JSON array), `created_at`, `updated_at`.
- Table `customers`: `id`, `google_id`, `email`, `name`, `avatar_url`, `phone_number`, `created_at`.
- Table `orders`: `id`, `order_code` (unique, e.g. `ORD-1001`), `customer_id`, `items` (JSON array of `OrderItem`), `shipping_address` (JSON), `shipping_cost_paise`, `total_paise`, `status` (`'Ordered' | 'Shipped'`), `courier_tracking_url`, `created_at`, `updated_at`.
- Table `commission_inquiries`: `id`, `commission_code` (unique, e.g. `COM-1001`), `customer_id`, `item_type`, `deity_iconography`, `dimensions`, `finish_preference`, `target_date`, `phone_number`, `inspired_by_portfolio_id`, `created_at`.
- Relations configured using Drizzle relations API (`customersRelations`, `ordersRelations`, `portfolioPiecesRelations`, `commissionInquiriesRelations`).

---

## 5. Implementation Status of Tasks

### Task 01: Interfaces, schema, Heritage shell & deploy
- **Status**: Complete (`ready-for-human`).
- **Verified Deliverables**:
  - Full TypeScript domain contracts and database models.
  - In-memory repository implementation with seed data.
  - Telemetry logging utility.
  - Responsive landing page and navigation shell adhering to Heritage design tokens.
  - `/api/health` route.

### Task 02: Browse & Buy Predefined Products (Issue 02)
- **Status**: Not implemented (`ready-for-agent`).
- **Required Implementation**:
  - `CatalogService` implementation (or concrete service classes) for product querying and order placement.
  - Route `/shop`: Catalog page with responsive grid (1-2 columns mobile, 3-4 desktop).
  - Route `/shop/[slug]`: Product detail page with image gallery, specs, care guide, sticky mobile action bar.
  - Interactive cart drawer: Item addition, quantity adjustments, removal, real-time shipping computation.
  - Checkout form / modal: Recipient info, shipping address, optional phone.
  - Reference codes: Must generate `ORD-XXXX`.
  - Order confirmation & status route `/orders/[code]`.
  - Shipping rule: Free when subtotal >= ₹2,500, flat ₹150 below ₹2,500.
  - Structured log `order.created`.

### Task 03: Browse Portfolio & Commission Inquiries (Issue 03)
- **Status**: Not implemented (`ready-for-agent`).
- **Required Implementation**:
  - `CatalogService` portfolio methods and commission inquiry submission.
  - Route `/custom-work`: Showcase gallery (1 column mobile, 2-3 desktop).
  - Route `/custom-work/[slug]`: Portfolio piece details with craft specs, lead time, CTA.
  - Route `/custom-work/inquire`: Touch-friendly inquiry form capturing callback phone, dimensions, deity iconography, finish preference, optional portfolio piece pre-fill.
  - Reference codes: Must generate `COM-XXXX`.
  - Confirmation screen with 1-click WhatsApp/Email/Phone links.
  - Structured log `commission.submitted`.

### Task 04: Admin Product & Portfolio CRUD (Issue 04)
- **Status**: Not implemented (`ready-for-agent`).
- **Required Implementation**:
  - `AdminService` implementation for product and portfolio CRUD.
  - Route `/admin`: Responsive admin dashboard with mobile-friendly tabs.
  - Route `/admin/products`: Product list, creation modal/page, edit page, delete confirmation.
  - Route `/admin/portfolio`: Portfolio list, creation modal/page, edit page, delete confirmation.
  - Immediate reflection on customer storefront views.
  - Structured logs: `product.created`, `product.updated`, `product.deleted`.

---

## 6. Baseline Verification & Test Execution Results

All baseline commands were executed directly against the repository with the following verified outcomes:

### Vitest Test Suite (`pnpm test`)
```
 RUN  v3.2.7 /home/cp/Documents/bronze-e-commerce

 ✓ src/repositories/in-memory-repository.test.ts (11 tests) 31ms
   ✓ InMemoryStoreRepository seam > Predefined Products > initializes with 6 predefined products
   ✓ InMemoryStoreRepository seam > Predefined Products > finds product by slug and id
   ✓ InMemoryStoreRepository seam > Predefined Products > creates, updates, and deletes products
   ✓ InMemoryStoreRepository seam > Portfolio Pieces > initializes with 5 portfolio showcase pieces
   ✓ InMemoryStoreRepository seam > Portfolio Pieces > finds portfolio piece by slug and id
   ✓ InMemoryStoreRepository seam > Orders > saves and retrieves orders by customer and code
   ✓ InMemoryStoreRepository seam > Commission Inquiries > saves and retrieves commission inquiries
   ✓ InMemoryStoreRepository seam > Snapshot Export & Restore > exports all entities and restores faithfully
   ✓ Domain Telemetry and Utilities > formats paise into INR display strings correctly
   ✓ Domain Telemetry and Utilities > calculates shipping costs correctly (free above ₹2,500, flat ₹150 below)
   ✓ Domain Telemetry and Utilities > emits structured domain logs to stdout with correlation ID

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Duration  748ms
```
- **Exit Code**: 0

### TypeScript Typecheck (`pnpm typecheck`)
- **Command**: `tsc --noEmit`
- **Output**: Clean (0 errors, 0 warnings)
- **Exit Code**: 0

### Next.js Production Build (`pnpm build`)
- **Command**: `next build`
- **Build Output**:
  - Compiled successfully in 3.0s
  - Linting and type validity check: Passed
  - Page data collection and static generation (5/5 pages): Passed
  - Routes generated:
    - `○ /` (5.39 kB, First Load JS 111 kB)
    - `○ /_not-found` (994 B, First Load JS 103 kB)
    - `ƒ /api/health` (123 B, First Load JS 103 kB)
- **Exit Code**: 0

---

## 7. Logging & Telemetry Architecture

Defined in `src/domain/events.ts`:
- **Function**: `logDomainEvent<T>(event: DomainEventType, payload: T, correlationId?: string): DomainEventLog<T>`
- **Correlation ID Generator**: `generateCorrelationId()` yields strings of pattern `correlation-<timestamp36>-<random36>`.
- **Supported Domain Event Types**:
  - `'order.created'`
  - `'order.shipped'`
  - `'commission.submitted'`
  - `'product.created'`
  - `'product.updated'`
  - `'product.deleted'`
  - `'snapshot.exported'`
  - `'snapshot.restored'`
- **Log Format**: Single-line JSON emitted to stdout via `console.log(JSON.stringify(logEntry))`, capturing:
  ```json
  {
    "timestamp": "2026-09-25T18:32:39.882Z",
    "level": "info",
    "event": "product.created",
    "payload": { "id": "prod-test", "name": "Test" },
    "correlationId": "test-cid-1"
  }
  ```
- **Architectural Decision Alignment**: Directly complies with ADR 0002 ("Lean Observability Stack Over Custom-Built Monitoring UI") for serverless cloud execution.

---

## 8. Design System & Styling Architecture

The project faithfully matches the **Shopify Heritage** theme aesthetics and mobile ergonomics:

### Tailwind Configuration (`tailwind.config.ts`)
- **Colors**:
  - `heritage-dark`: `#202219` (Primary background, deep charcoal olive)
  - `heritage-darker`: `#161811` (Deep footer/contrast)
  - `heritage-surface`: `#2A2C21` (Card/image container surface)
  - `heritage-moss`: `#46493C` (Accent olive background)
  - `heritage-cream`: `#F6EDDD` (Primary typography/foreground)
  - `heritage-cream-hover`: `#E1D9CB`
  - `heritage-muted`: `rgba(246, 237, 221, 0.65)`
  - `heritage-subtle`: `rgba(246, 237, 221, 0.40)`
  - `heritage-border`: `rgba(246, 237, 221, 0.18)`
  - `heritage-border-light`: `rgba(246, 237, 221, 0.10)`
- **Typography**:
  - Font: `Instrument Sans` via `next/font/google` (`--font-instrument-sans`).
  - Headings & body both bind to `Instrument Sans`.
  - Letter spacing: `display` (`-0.03em`), `subheading` (`0.12em`).
- **Interactive Controls & Accessibility**:
  - `button-primary`: Pill rounded (`rounded-full`), cream background, dark text, `min-height: 44px`.
  - `button-secondary`: Pill rounded, bordered (`border-heritage-border`), `min-height: 44px`.
  - `tap-target`: `min-height: 44px; min-width: 44px;` complying with mobile accessibility guidelines.
- **Icons**: Lucide React (`lucide-react`) used uniformly across navigation, footer, and interactive elements.
- **Imagery**: Seed images stored locally in `public/images/products/` and `public/images/portfolio/` with Next.js image optimization support.

---

## 9. Seams & Guidance for Parallel Implementation Streams

To prevent collisions across parallel workstreams for Tasks 02, 03, and 04:

1. **Shared Service Implementation vs In-Memory Seam**:
   - `InMemoryStoreRepository` is already shared and tested.
   - For services, implementers can either create a unified service instance or concrete service factories (e.g., `DefaultCatalogService`, `DefaultAdminService`) in `src/domain/` or `src/lib/services/` that consume `StoreRepository`.
   - Consider a singleton repository provider (e.g., `getStoreRepository()`) that defaults to `InMemoryStoreRepository` when no SQLite `DATABASE_URL` is set, making both local development and unit tests effortless.

2. **Route Boundaries**:
   - **Task 02 owns**:
     - `src/app/shop/` (catalog and detail pages)
     - `src/app/orders/` (order tracking)
     - Cart drawer component and checkout flow
   - **Task 03 owns**:
     - `src/app/custom-work/` (gallery, piece detail, and inquiry form)
   - **Task 04 owns**:
     - `src/app/admin/` (admin dashboard, product CRUD, portfolio CRUD)
   - **Shared Components**:
     - Navigation links and cart icon hook in `src/components/Navigation.tsx`. Each stream should coordinate or keep navigation hooks modular.

3. **Telemetry & Validation**:
   - All server actions or API endpoints must import `logDomainEvent` and `generateCorrelationId` from `@/domain/events`.
   - Validate payloads defensively and emit logs on mutations with consistent event names:
     - Task 02: `order.created`
     - Task 03: `commission.submitted`
     - Task 04: `product.created`, `product.updated`, `product.deleted`
