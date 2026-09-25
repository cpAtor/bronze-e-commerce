# Architecture Seams and Parallel Execution Boundaries Report

**Target Tasks:**
- Task 02: Browse & Buy Predefined Products (`task/02-browse-buy`)
- Task 03: Browse Portfolio & Request Commission (`task/03-portfolio-commission`)
- Task 04: Admin Product & Portfolio CRUD (`task/04-admin-crud`)

**Author:** teamwork_preview_explorer_survey_3  
**Date:** 2026-09-25T18:35:00Z  
**Status:** Complete  

---

## 1. Executive Summary

This investigation analyzed the codebase structure, interfaces, database schema, git workflow, and runtime environment for the parallel execution of Tasks 02, 03, and 04.

### Key Conclusions:
1. **Database Schema & StoreRepository Seams Are Already Complete**:
   - `src/db/schema.ts` already defines all 5 tables (`predefinedProducts`, `portfolioPieces`, `customers`, `orders`, `commissionInquiries`). **Zero schema changes are needed by any task.** By declaring `src/db/schema.ts` read-only, schema merge conflicts are completely eliminated.
   - `StoreRepository` in `src/domain/services.ts` and `InMemoryStoreRepository` in `src/repositories/in-memory-repository.ts` already implement all queries and mutations required by Tasks 02, 03, and 04.
   - **Action needed**: Establish a singleton repository factory (`src/repositories/index.ts`) on `main` before branching so server actions, route handlers, and tests share an in-memory instance without ad-hoc instantiation.

2. **CatalogService and AdminService Modularization**:
   - If Task 02 and Task 03 both implement `CatalogService` in a single shared file, they will directly collide with git merge conflicts.
   - **Recommended architecture**: Modularize implementations into separate, disjoint files:
     - `src/services/product-catalog.service.ts` (100% owned by Task 02)
     - `src/services/portfolio-catalog.service.ts` (100% owned by Task 03)
     - `src/services/admin.service.ts` (100% owned by Task 04)
     - `src/services/catalog.service.ts` (Composite facade implementing `CatalogService` by delegating to the product and portfolio services).
   - Resolve method naming discrepancies between ticket 01 interfaces (`getProducts`, `createOrder`) and ticket 02/03 specs (`browseProducts`, `placeOrder`) via method aliases.

3. **Branch Isolation and Pre-Branch Baseline**:
   - The 3 branches (`task/02-browse-buy`, `task/03-portfolio-commission`, `task/04-admin-crud`) must be branched from a shared baseline commit on `main`.
   - Update `src/components/Navigation.tsx` on `main` before branching so navigation routes (`/shop`, `/custom-work`, `/orders`, `/admin`) are pre-wired, preventing competing edits to `Navigation.tsx`.
   - The file ownership matrix across routes (`/shop`, `/custom-work`, `/admin`), components, and service files is **100% disjoint**.

4. **Shared Types & DTO Placement**:
   - Consolidate all domain types, DTOs, and input interfaces into `src/domain/types.ts`.
   - Add missing `CartItem` type and make `customerId` optional in `CreateOrderInput` and `SubmitCommissionInquiryInput` (with optional guest contact fields) to support unauthenticated checkout and inquiry submission prior to Google OAuth implementation in Issue 07.

5. **Visual Screenshot Verification Tooling**:
   - Audited environment: `/usr/bin/firefox` is installed and verified working in headless mode. Chrome/Chromium and pre-installed Playwright/Puppeteer packages are absent. Chrome DevTools MCP is not configured.
   - Verified command: Running headless Firefox with an ephemeral profile (`firefox --headless --profile $(mktemp -d) --screenshot <output> --window-size <w,h> <url>`) captures pixel-perfect PNGs for 375px, 390px, and 1280px viewports.
   - Images can be inspected directly by agents using the built-in `view_file` tool.
   - Concrete screenshot capture script provided (`scripts/capture-screenshots.sh`).

---

## 2. StoreRepository and Database Schema Seam (Question 1)

### 2.1 Current State Analysis
- **Database Schema (`src/db/schema.ts`)**:
  - Contains full Drizzle SQLite definitions for all 5 core entities:
    - `predefinedProducts`: id, name, slug, description, pricePaise, weight, dimensions, alloyDescription, careGuide, stockQuantity, images, createdAt, updatedAt
    - `portfolioPieces`: id, name, slug, description, referenceDimensions, castingTechnique, finishOptions, typicalLeadTime, images, createdAt, updatedAt
    - `customers`: id, googleId, email, name, avatarUrl, phoneNumber, createdAt
    - `orders`: id, orderCode, customerId, items, shippingAddress, shippingCostPaise, totalPaise, status, courierTrackingUrl, createdAt, updatedAt
    - `commissionInquiries`: id, commissionCode, customerId, itemType, deityIconography, dimensions, finishPreference, targetDate, phoneNumber, inspiredByPortfolioId, createdAt
  - Contains complete relations definitions (`customersRelations`, `ordersRelations`, `portfolioPiecesRelations`, `commissionInquiriesRelations`).
  - **Assessment**: The schema matches `CONTEXT.md` and `spec.md` 100%. No new tables or column alterations are needed for Tasks 02, 03, or 04.

- **StoreRepository Seam (`src/domain/services.ts` & `src/repositories/in-memory-repository.ts`)**:
  - The repository interface has methods for:
    - Products: `findProductById`, `findProductBySlug`, `listProducts`, `saveProduct`, `deleteProduct`
    - Portfolio: `findPortfolioPieceById`, `findPortfolioPieceBySlug`, `listPortfolioPieces`, `savePortfolioPiece`, `deletePortfolioPiece`
    - Orders: `findOrderById`, `findOrderByCode`, `listOrdersByCustomerId`, `listAllOrders`, `saveOrder`
    - Commissions: `findCommissionInquiryById`, `findCommissionInquiryByCode`, `listCommissionInquiries`, `saveCommissionInquiry`
    - Customers: `findCustomerById`, `findCustomerByGoogleId`, `saveCustomer`
    - Snapshot: `getSnapshotData`, `restoreSnapshotData`
  - `InMemoryStoreRepository` provides a complete working implementation seeded with 6 products and 5 portfolio pieces.

### 2.2 Seam Conflict Prevention Strategy
To ensure zero merge conflicts and seamless inter-task integration:

1. **Lock Schema and Repository Files**:
   - `src/db/schema.ts` is declared **read-only / locked**.
   - `src/repositories/in-memory-repository.ts` is declared **read-only / locked**.
   - Task branches are forbidden from modifying these files.

2. **Shared Repository Factory / Singleton (`src/repositories/index.ts`)**:
   Currently, `InMemoryStoreRepository` is only instantiated inside its test file. In Next.js server actions and API route handlers across different pages, creating `new InMemoryStoreRepository()` in each file would mean mutations made in `/admin` (Task 04) are lost and not visible in `/shop` (Task 02).
   
   **Recommendation**: Before creating task branches, add `src/repositories/index.ts` on `main`:
   ```typescript
   // src/repositories/index.ts
   import { InMemoryStoreRepository } from './in-memory-repository';
   import type { StoreRepository } from '@/domain/services';

   // Global singleton pattern for development & Next.js fast-refresh persistence
   const globalForRepo = globalThis as unknown as {
     storeRepository?: StoreRepository;
   };

   export const storeRepository: StoreRepository =
     globalForRepo.storeRepository ?? new InMemoryStoreRepository(true);

   if (process.env.NODE_ENV !== 'production') {
     globalForRepo.storeRepository = storeRepository;
   }

   export function getStoreRepository(): StoreRepository {
     return storeRepository;
   }
   ```
   Every task branch imports `getStoreRepository()` or `storeRepository` from `@/repositories`.

---

## 3. CatalogService and AdminService Modularization (Question 2)

### 3.1 The Concurrency Collision Risk
In `src/domain/services.ts`, `CatalogService` and `AdminService` are defined as interfaces. Currently, there are NO implementation classes in the repository.

If implementers follow naive patterns:
- Task 02 implementer writes `class DefaultCatalogService` in `src/domain/services.ts` implementing `browseProducts`, `getProduct`, `placeOrder`.
- Task 03 implementer writes `class DefaultCatalogService` in `src/domain/services.ts` implementing `browsePortfolio`, `getPortfolioPiece`, `submitCommissionInquiry`.
- Task 04 implementer writes `class DefaultAdminService` in `src/domain/services.ts`.

When merging, `src/domain/services.ts` will face severe 3-way merge conflicts!

### 3.2 Modularization Architecture
We isolate each domain service into dedicated, single-responsibility files under `src/services/` (or `src/domain/services/`):

```
src/
└── services/
    ├── product-catalog.service.ts     # Task 02: Browse products, get product, placeOrder, shipping
    ├── portfolio-catalog.service.ts   # Task 03: Browse portfolio, get piece, submitCommissionInquiry
    ├── admin.service.ts               # Task 04: Product & portfolio CRUD, order shipping, inquiry review
    ├── catalog.service.ts             # Composite facade implementing full CatalogService
    └── index.ts                       # Service exports & dependency wiring
```

#### Detailed Service Contracts

1. **`src/services/product-catalog.service.ts` (Task 02)**:
   ```typescript
   export class ProductCatalogService {
     constructor(private repo: StoreRepository = getStoreRepository()) {}

     async browseProducts(): Promise<PredefinedProduct[]> {
       return this.repo.listProducts();
     }
     async getProducts(): Promise<PredefinedProduct[]> {
       return this.browseProducts();
     }
     async getProduct(slug: string): Promise<PredefinedProduct | null> {
       return this.repo.findProductBySlug(slug);
     }
     async getProductBySlug(slug: string): Promise<PredefinedProduct | null> {
       return this.getProduct(slug);
     }
     async getProductById(id: string): Promise<PredefinedProduct | null> {
       return this.repo.findProductById(id);
     }
     calculateShipping(subtotalPaise: number): number {
       return calculateShippingPaise(subtotalPaise);
     }
     async placeOrder(input: CreateOrderInput, correlationId?: string): Promise<Order> {
       // Validates input, calculates totalPaise & shipping, generates ORD-XXXX,
       // calls repo.saveOrder(), emits logDomainEvent('order.created', ...)
     }
     async createOrder(input: CreateOrderInput, correlationId?: string): Promise<Order> {
       return this.placeOrder(input, correlationId);
     }
     async getOrdersByCustomer(customerId: string): Promise<Order[]> {
       return this.repo.listOrdersByCustomerId(customerId);
     }
     async getOrderById(orderId: string, customerId: string): Promise<Order | null> {
       const order = await this.repo.findOrderById(orderId);
       return order && order.customerId === customerId ? order : null;
     }
     async getOrderByCode(code: string): Promise<Order | null> {
       return this.repo.findOrderByCode(code);
     }
   }
   ```

2. **`src/services/portfolio-catalog.service.ts` (Task 03)**:
   ```typescript
   export class PortfolioCatalogService {
     constructor(private repo: StoreRepository = getStoreRepository()) {}

     async browsePortfolio(): Promise<PortfolioPiece[]> {
       return this.repo.listPortfolioPieces();
     }
     async getPortfolioPieces(): Promise<PortfolioPiece[]> {
       return this.browsePortfolio();
     }
     async getPortfolioPiece(slug: string): Promise<PortfolioPiece | null> {
       return this.repo.findPortfolioPieceBySlug(slug);
     }
     async getPortfolioPieceBySlug(slug: string): Promise<PortfolioPiece | null> {
       return this.getPortfolioPiece(slug);
     }
     async getPortfolioPieceById(id: string): Promise<PortfolioPiece | null> {
       return this.repo.findPortfolioPieceById(id);
     }
     async submitCommissionInquiry(
       input: SubmitCommissionInquiryInput,
       correlationId?: string
     ): Promise<CommissionInquiry> {
       // Validates input, generates COM-XXXX, calls repo.saveCommissionInquiry(),
       // emits logDomainEvent('commission.submitted', ...)
     }
     async getCommissionInquiryByCode(code: string): Promise<CommissionInquiry | null> {
       return this.repo.findCommissionInquiryByCode(code);
     }
   }
   ```

3. **`src/services/admin.service.ts` (Task 04)**:
   ```typescript
   export class DefaultAdminService implements AdminService {
     constructor(private repo: StoreRepository = getStoreRepository()) {}

     // Product CRUD
     async getAllProducts(): Promise<PredefinedProduct[]> { return this.repo.listProducts(); }
     async getProductById(id: string): Promise<PredefinedProduct | null> { return this.repo.findProductById(id); }
     async createProduct(input: CreateProductInput, correlationId?: string): Promise<PredefinedProduct> { ... }
     async updateProduct(id: string, input: UpdateProductInput, correlationId?: string): Promise<PredefinedProduct> { ... }
     async deleteProduct(id: string, correlationId?: string): Promise<void> { ... }

     // Portfolio CRUD
     async getAllPortfolioPieces(): Promise<PortfolioPiece[]> { return this.repo.listPortfolioPieces(); }
     async getPortfolioPieceById(id: string): Promise<PortfolioPiece | null> { return this.repo.findPortfolioPieceById(id); }
     async createPortfolioPiece(input: CreatePortfolioPieceInput, correlationId?: string): Promise<PortfolioPiece> { ... }
     async updatePortfolioPiece(id: string, input: UpdatePortfolioPieceInput, correlationId?: string): Promise<PortfolioPiece> { ... }
     async deletePortfolioPiece(id: string, correlationId?: string): Promise<void> { ... }

     // Orders & Commissions (Read & status updates)
     async getAllOrders(): Promise<Order[]> { return this.repo.listAllOrders(); }
     async getOrderById(id: string): Promise<Order | null> { return this.repo.findOrderById(id); }
     async markOrderShipped(orderId: string, courierTrackingUrl: string, correlationId?: string): Promise<Order> { ... }
     async getAllCommissionInquiries(): Promise<CommissionInquiry[]> { return this.repo.listCommissionInquiries(); }
     async getCommissionInquiryById(id: string): Promise<CommissionInquiry | null> { return this.repo.findCommissionInquiryById(id); }

     // Snapshot
     async exportSnapshot(correlationId?: string): Promise<StoreSnapshot> { return this.repo.getSnapshotData(); }
     async restoreSnapshot(snapshot: StoreSnapshot, correlationId?: string): Promise<void> { return this.repo.restoreSnapshotData(snapshot); }
   }
   ```

4. **Composite Facade (`src/services/catalog.service.ts`)**:
   ```typescript
   export class DefaultCatalogService implements CatalogService {
     constructor(
       private products = new ProductCatalogService(),
       private portfolio = new PortfolioCatalogService()
     ) {}

     // Delegated Product methods
     getProducts = () => this.products.getProducts();
     browseProducts = () => this.products.browseProducts();
     getProductBySlug = (slug: string) => this.products.getProductBySlug(slug);
     getProduct = (slug: string) => this.products.getProduct(slug);
     getProductById = (id: string) => this.products.getProductById(id);
     calculateShipping = (subtotalPaise: number) => this.products.calculateShipping(subtotalPaise);
     createOrder = (input: CreateOrderInput, cid?: string) => this.products.createOrder(input, cid);
     placeOrder = (input: CreateOrderInput, cid?: string) => this.products.placeOrder(input, cid);
     getOrdersByCustomer = (cid: string) => this.products.getOrdersByCustomer(cid);
     getOrderById = (oid: string, cid: string) => this.products.getOrderById(oid, cid);

     // Delegated Portfolio methods
     getPortfolioPieces = () => this.portfolio.getPortfolioPieces();
     browsePortfolio = () => this.portfolio.browsePortfolio();
     getPortfolioPieceBySlug = (slug: string) => this.portfolio.getPortfolioPieceBySlug(slug);
     getPortfolioPiece = (slug: string) => this.portfolio.getPortfolioPiece(slug);
     getPortfolioPieceById = (id: string) => this.portfolio.getPortfolioPieceById(id);
     submitCommissionInquiry = (input: SubmitCommissionInquiryInput, cid?: string) =>
       this.portfolio.submitCommissionInquiry(input, cid);
   }
   ```

### 3.3 Method Naming Reconciliation
Notice that `ORIGINAL_REQUEST.md` and issue specs 02 and 03 refer to `browseProducts`, `getProduct`, `placeOrder`, `browsePortfolio`, `getPortfolioPiece`, while `src/domain/services.ts` interfaces originally wrote `getProducts`, `getProductBySlug`, `createOrder`, `getPortfolioPieces`, `getPortfolioPieceBySlug`.
By providing both the primary name and alias in the service implementation and interface definitions, both contracts are 100% satisfied without breaking any existing or future call sites.

---

## 4. Git Branching & Isolation Topology (Question 3)

### 4.1 Branch Creation Strategy
All 3 task branches MUST be created from a clean `main` branch containing the baseline scaffolding:

```bash
# 1. Ensure main has the baseline scaffolding committed
git checkout main

# 2. Spawn Task 02 branch
git checkout -b task/02-browse-buy main

# 3. Spawn Task 03 branch
git checkout -b task/03-portfolio-commission main

# 4. Spawn Task 04 branch
git checkout -b task/04-admin-crud main
```

### 4.2 Comprehensive File Ownership Matrix

| Artifact Category | Task 02 (`task/02-browse-buy`) | Task 03 (`task/03-portfolio-commission`) | Task 04 (`task/04-admin-crud`) | Baseline / Shared (LOCKED) |
| :--- | :--- | :--- | :--- | :--- |
| **Routes (`src/app/`)** | `src/app/shop/**`<br>`src/app/orders/**`<br>`src/app/api/orders/**` | `src/app/custom-work/**`<br>`src/app/api/commissions/**` | `src/app/admin/**`<br>`src/app/api/admin/**` | `src/app/layout.tsx`<br>`src/app/page.tsx`<br>`src/app/api/health/**` |
| **Components** | `src/components/shop/**`<br>(ProductCard, ProductGrid, CartDrawer, CheckoutModal, OrderConfirm) | `src/components/portfolio/**`<br>(PortfolioCard, PortfolioGrid, InquireForm, InquiryConfirm) | `src/components/admin/**`<br>(AdminNav, AdminTabs, ProductTable, PortfolioTable, DeleteModal) | `src/components/Navigation.tsx`<br>`src/components/Footer.tsx` |
| **Services** | `src/services/product-catalog.service.ts` | `src/services/portfolio-catalog.service.ts` | `src/services/admin.service.ts` | `src/services/catalog.service.ts`<br>`src/services/index.ts` |
| **Tests** | `src/services/product-catalog.service.test.ts` | `src/services/portfolio-catalog.service.test.ts` | `src/services/admin.service.test.ts` | `src/repositories/in-memory-repository.test.ts` |
| **Persistence & DB** | *Read-only access* | *Read-only access* | *Read-only access* | `src/db/schema.ts`<br>`src/repositories/in-memory-repository.ts`<br>`src/repositories/index.ts` |
| **Domain Models** | *Read-only access* | *Read-only access* | *Read-only access* | `src/domain/types.ts`<br>`src/domain/events.ts`<br>`src/domain/services.ts` |

### 4.3 Navigational Conflict Prevention (`Navigation.tsx`)
In `src/components/Navigation.tsx`, links are currently configured as anchor links (`#shop`, `#custom`).
If Task 02 updates `Navigation.tsx` to link to `/shop`, Task 03 updates it to link to `/custom-work`, and Task 04 updates it to link to `/admin`, git will flag a merge conflict on `Navigation.tsx`.

**Resolution**: Update `src/components/Navigation.tsx` on `main` **before** branching, setting standard route paths:
```tsx
const navLinks = [
  { href: '/shop', label: 'Bestsellers & Wares' },
  { href: '/custom-work', label: 'Sanctum Commissions' },
  { href: '/orders', label: 'Track Order' },
  { href: '/admin', label: 'Admin Portal' },
];
```
This leaves `Navigation.tsx` completely untouched during the 3 parallel task branches.

---

## 5. Shared Types & Baseline Architecture (Question 4)

### 5.1 Analysis of Current Domain Types (`src/domain/types.ts`)
- `OrderStatus = 'Ordered' | 'Shipped'`
- `PredefinedProduct`
- `PortfolioPiece`
- `OrderItem`
- `ShippingAddress`
- `Order`
- `CommissionInquiry`
- `Customer`
- `StoreSnapshot`

### 5.2 Identified Type Gaps
1. **`CartItem` Type**:
   Task 02 requires a cart drawer supporting item increment/decrement, line items, and subtotal calculation. Having a standardized `CartItem` prevents ad-hoc definitions across components:
   ```typescript
   export interface CartItem {
     product: PredefinedProduct;
     quantity: number;
   }
   ```

2. **Unauthenticated / Guest Checkout & Inquiry Inputs**:
   - In `src/domain/services.ts`, `CreateOrderInput` and `SubmitCommissionInquiryInput` currently require `customerId: string`.
   - However, according to the roadmap, Google OAuth authentication is implemented in **Issue 07**. Tasks 02 and 03 must allow customers to browse, checkout, and submit commission inquiries without being blocked by OAuth.
   - The checkout form specifically asks for: recipient name, email, shipping address, and optional phone number.
   - The commission inquiry form asks for: item type, deity iconography, dimensions, finish, target date, and phone number for callback.
   - **Recommendation**: Update `CreateOrderInput` and `SubmitCommissionInquiryInput` in `src/domain/types.ts`:
     ```typescript
     export interface CreateOrderInput {
       customerId?: string; // Optional: auto-generated or guest ID if not authenticated
       customerEmail: string;
       customerName: string;
       customerPhone?: string;
       items: Array<{
         productId: string;
         quantity: number;
       }>;
       shippingAddress: ShippingAddress;
     }

     export interface SubmitCommissionInquiryInput {
       customerId?: string; // Optional: auto-generated or guest ID if not authenticated
       customerName?: string;
       customerEmail?: string;
       phoneNumber: string; // Mandatory phone number for callback
       itemType: string;
       deityIconography: string;
       dimensions: string;
       finishPreference: string;
       targetDate: string;
       inspiredByPortfolioId?: string | null;
     }
     ```

3. **Placement**:
   Move all DTO inputs (`CreateOrderInput`, `SubmitCommissionInquiryInput`, `CreateProductInput`, `UpdateProductInput`, `CreatePortfolioPieceInput`, `UpdatePortfolioPieceInput`, `CartItem`) into `src/domain/types.ts`.
   `src/domain/services.ts` re-exports them and defines the interfaces.
   This locks `src/domain/types.ts` as the single canonical source of truth on `main` before task branches are cut.

---

## 6. Visual Screenshot Verification Tooling (Question 5)

### 6.1 Environment Inventory & Verification
We conducted a comprehensive audit of the execution environment:
- **Firefox**: `/usr/bin/firefox` is present.
- **Chrome / Chromium**: Not installed on system (`google-chrome`, `chromium`, `chromium-browser` not found).
- **Playwright / Puppeteer**: Not in `package.json` dependencies; running `npx playwright` triggers interactive package download prompts.
- **Chrome DevTools MCP**: Not active in `<mcp_servers>` (only `gemini-api_gemini-api-docs` is configured).

### 6.2 Verified Screenshot Mechanism
We verified that headless Firefox can execute clean, deterministic screenshots without any external npm packages or background daemons by using an ephemeral profile:
```bash
TMP_DIR=$(mktemp -d)
firefox --headless --profile "$TMP_DIR" --screenshot /tmp/test-screenshot.png --window-size 375,812 "http://localhost:3000/shop"
rm -rf "$TMP_DIR"
```
**Verification result**: Produced a genuine `PNG image data, 375 x 812, 8-bit/color RGBA` file.
The agent's built-in `view_file` tool supports binary images, allowing agents to directly view and visually inspect the resulting PNGs.

### 6.3 Standardized Verification Script (`scripts/capture-screenshots.sh`)
To ensure all implementers and reviewers can capture screenshots consistently across the required viewports (Mobile: 375px & 390px, Desktop: 1280px), commit this script to `scripts/capture-screenshots.sh` on `main`:

```bash
#!/usr/bin/env bash
# scripts/capture-screenshots.sh
# Usage: ./scripts/capture-screenshots.sh [PORT] [TASK_NAME]
# Example: ./scripts/capture-screenshots.sh 3000 task-02

set -euo pipefail

PORT="${1:-3000}"
TASK="${2:-all}"
BASE_URL="http://localhost:${PORT}"
OUT_DIR=".scratch/screenshots/${TASK}"

mkdir -p "${OUT_DIR}"

capture() {
  local route="$1"
  local name="$2"
  local width="$3"
  local height="$4"
  local url="${BASE_URL}${route}"
  local outfile="${OUT_DIR}/${name}_${width}x${height}.png"

  local tmp_profile
  tmp_profile=$(mktemp -d)
  
  echo "Capturing ${url} at ${width}x${height} -> ${outfile}..."
  firefox --headless --profile "${tmp_profile}" --screenshot "${outfile}" --window-size "${width},${height}" "${url}" >/dev/null 2>&1 || true
  rm -rf "${tmp_profile}"
}

# Viewports required by R2:
# Mobile: 375px (iPhone SE/Mini), 390px (iPhone 12/13/14)
# Desktop: 1280px (Standard Desktop)
VIEWPORTS=("375:812" "390:844" "1280:900")

capture_route() {
  local route="$1"
  local slug="$2"
  for vp in "${VIEWPORTS[@]}"; do
    IFS=":" read -r w h <<< "$vp"
    capture "${route}" "${slug}" "$w" "$h"
  done
}

case "$TASK" in
  task-02|02)
    capture_route "/shop" "shop_catalog"
    capture_route "/shop/traditional-bronze-kalash" "shop_detail"
    ;;
  task-03|03)
    capture_route "/custom-work" "portfolio_gallery"
    capture_route "/custom-work/nataraja-ananda-tandava-murti" "portfolio_detail"
    capture_route "/custom-work/inquire" "commission_inquire"
    ;;
  task-04|04)
    capture_route "/admin" "admin_dashboard"
    capture_route "/admin/products" "admin_products"
    capture_route "/admin/portfolio" "admin_portfolio"
    ;;
  *)
    capture_route "/" "landing"
    capture_route "/shop" "shop_catalog"
    capture_route "/shop/traditional-bronze-kalash" "shop_detail"
    capture_route "/custom-work" "portfolio_gallery"
    capture_route "/custom-work/nataraja-ananda-tandava-murti" "portfolio_detail"
    capture_route "/custom-work/inquire" "commission_inquire"
    capture_route "/admin" "admin_dashboard"
    capture_route "/admin/products" "admin_products"
    capture_route "/admin/portfolio" "admin_portfolio"
    ;;
esac

echo "Screenshots captured in ${OUT_DIR}:"
ls -la "${OUT_DIR}"
```

Implementers and reviewers start the local server with `pnpm dev &` or `pnpm build && pnpm start &`, run `./scripts/capture-screenshots.sh 3000 task-02`, and use `view_file` to review the generated screenshots.

---

## 7. Recommended Action Plan for Orchestrator

Before dispatching implementers to task branches, execute this setup sequence on `main`:

1. **Update `src/domain/types.ts`**:
   - Add `CartItem`.
   - Move input DTOs into `src/domain/types.ts` with optional `customerId` and guest contact fields.
2. **Update `src/components/Navigation.tsx`**:
   - Change link hrefs from `#shop`, `#custom` to `/shop`, `/custom-work`, `/orders`, `/admin`.
3. **Create `src/repositories/index.ts`**:
   - Export `getStoreRepository()` singleton.
4. **Create `src/services/` Scaffolding**:
   - Create empty service templates / stubs for `product-catalog.service.ts`, `portfolio-catalog.service.ts`, `admin.service.ts`, and `catalog.service.ts`.
5. **Add `scripts/capture-screenshots.sh`**:
   - Add the verified headless Firefox screenshot script.
6. **Commit Baseline to `main`**:
   - Run `pnpm test` and `pnpm typecheck` to verify zero errors.
   - Commit baseline: `git commit -am "chore(arch): establish seams, singleton repo, modular services, and screenshot tooling"`
7. **Create Task Branches**:
   - `git checkout -b task/02-browse-buy main`
   - `git checkout -b task/03-portfolio-commission main`
   - `git checkout -b task/04-admin-crud main`
8. **Dispatch Implementers & Adversarial Reviewers**:
   - Each implementer works strictly in their own assigned directory tree according to the File Ownership Matrix.
