# Milestone 0: Baseline Seams Setup Report

**Worker:** teamwork_preview_worker_m0  
**Date:** 2026-09-26T00:11:00Z  
**Target Milestone:** M0 (Baseline Seams Setup)  
**Status:** Complete & Verified  

---

## 1. Executive Summary

Milestone 0 establishes the pre-branch baseline on `main` to eliminate merge conflicts and provide stable architectural seams for parallel workstreams (`task/02-browse-buy`, `task/03-portfolio-commission`, and `task/04-admin-crud`).

All requirements specified in the dispatch and `PROJECT.md` have been implemented:
1. Domain Types & DTOs consolidated in `src/domain/types.ts` (`CartItem` added; input DTOs defined with optional `customerId` and guest checkout fields; re-exported from `src/domain/services.ts`).
2. `src/components/Navigation.tsx` updated with standard route links (`/shop`, `/custom-work`, `/orders`, `/admin`) using Next.js `Link`.
3. `src/repositories/index.ts` created, exporting `storeRepository` singleton and `getStoreRepository(): StoreRepository` with fast-refresh global persistence.
4. `src/services/` modular service layer established with class stubs and composite facade matching `PROJECT.md` interface contracts.
5. `scripts/capture-screenshots.sh` created and made executable (`chmod +x`), verified against headless Firefox.
6. Full test suite, TypeScript typecheck, and Next.js production build verified passing with exit code 0.
7. Baseline committed to `main` and task branches `task/02-browse-buy`, `task/03-portfolio-commission`, and `task/04-admin-crud` spawned from `main`.

---

## 2. Changes Implemented

### 2.1 Domain Types & DTOs (`src/domain/types.ts` & `src/domain/services.ts`)
- Added `CartItem` interface:
  ```typescript
  export interface CartItem {
    product: PredefinedProduct;
    quantity: number;
  }
  ```
- Defined input DTOs in `src/domain/types.ts`:
  - `CreateOrderInput`: `customerId` is optional (`customerId?: string;`) with `customerEmail: string;`, `customerName: string;`, `customerPhone?: string;` to support guest checkout before OAuth.
  - `SubmitCommissionInquiryInput`: `customerId` is optional (`customerId?: string;`), with `phoneNumber: string;`, `itemType: string;`, `deityIconography: string;`, `dimensions: string;`, etc.
  - `CreateProductInput`, `UpdateProductInput`, `CreatePortfolioPieceInput`, `UpdatePortfolioPieceInput`.
- Re-exported all input DTOs from `src/domain/services.ts` to preserve backward compatibility.

### 2.2 Navigation Updates (`src/components/Navigation.tsx`)
- Changed `navLinks` hrefs and labels:
  - `/shop` — 'Bestsellers & Wares'
  - `/custom-work` — 'Sanctum Commissions'
  - `/orders` — 'Track Order'
  - `/admin` — 'Admin Portal'
- Replaced anchor tags with Next.js `<Link>` components in both drawer and header action icons (Search and Cart icons now link to `/shop`).

### 2.3 Repository Singleton Factory (`src/repositories/index.ts`)
- Created `src/repositories/index.ts` exporting:
  - `storeRepository: StoreRepository`
  - `getStoreRepository(): StoreRepository`
- Attached repository instance to `globalThis` in non-production environments to preserve seeded in-memory state across Next.js hot-reloads and API route invocations.

### 2.4 Modular Services (`src/services/`)
- `src/services/product-catalog.service.ts`:
  - Implements `ProductCatalogService` with methods: `browseProducts()`, `getProducts()`, `getProduct(slug)`, `getProductBySlug(slug)`, `getProductById(id)`, `calculateShipping(subtotalPaise)`, `placeOrder(input, correlationId)`, `createOrder(input, correlationId)`, `getOrdersByCustomer(customerId)`, `getOrderById(orderId, customerId)`, `getOrderByCode(code)`.
- `src/services/portfolio-catalog.service.ts`:
  - Implements `PortfolioCatalogService` with methods: `browsePortfolio()`, `getPortfolioPieces()`, `getPortfolioPiece(slug)`, `getPortfolioPieceBySlug(slug)`, `getPortfolioPieceById(id)`, `submitCommissionInquiry(input, correlationId)`, `getCommissionInquiryByCode(code)`.
- `src/services/admin.service.ts`:
  - Implements `DefaultAdminService` implementing `AdminService` with product CRUD, portfolio CRUD, order tracking, commission inquiries, and snapshot import/export.
- `src/services/catalog.service.ts`:
  - Implements `DefaultCatalogService` composite facade implementing `CatalogService`, delegating product and portfolio operations cleanly without coupling.
- `src/services/index.ts`:
  - Central re-exports of all services.

### 2.5 Verification Tooling (`scripts/capture-screenshots.sh`)
- Created bash automation script for headless Firefox screenshot capture at viewports:
  - Mobile: 375x812 (iPhone Mini / SE)
  - Mobile: 390x844 (iPhone 12/13/14)
  - Desktop: 1280x900
- Supports task-based routing (`task-02`, `task-03`, `task-04`, `all`).
- Set permissions: `chmod +x scripts/capture-screenshots.sh`.

---

## 3. Verification Commands & Results

| Command | Status | Result / Details |
|---|---|---|
| `pnpm typecheck` | PASS | `tsc --noEmit` exited 0 with zero errors |
| `pnpm test` | PASS | 11/11 tests passing in `in-memory-repository.test.ts` |
| `pnpm build` | PASS | Next.js 15.5.26 production build succeeded |
| `firefox --version` | PASS | Mozilla Firefox 147.0.4 verified |

---

## 4. Git Artifacts & Branches

- **Commit**: `chore(arch): establish seams, singleton repo, modular services, and screenshot tooling` on `main`.
- **Created Branches**:
  - `task/02-browse-buy`
  - `task/03-portfolio-commission`
  - `task/04-admin-crud`
- **Current Branch**: `main`
