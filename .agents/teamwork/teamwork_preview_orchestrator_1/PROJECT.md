# Project: bronze-e-commerce Tasks 02, 03, 04

## Architecture
- **Framework**: Next.js 15.1.7 (App Router), React 19, TypeScript strict mode, Tailwind CSS 3.4.17.
- **Persistence**: LibSQL / SQLite schema in `src/db/schema.ts` (LOCKED). Repository implementation `InMemoryStoreRepository` in `src/repositories/in-memory-repository.ts` (LOCKED) with singleton accessor in `src/repositories/index.ts`.
- **Modular Services**:
  - `src/services/product-catalog.service.ts` (Task 02)
  - `src/services/portfolio-catalog.service.ts` (Task 03)
  - `src/services/admin.service.ts` (Task 04)
  - `src/services/catalog.service.ts` (Composite facade implementing `CatalogService`)
  - `src/services/index.ts`
- **Observability**: `logDomainEvent()` in `src/domain/events.ts` emitting structured JSON with correlation IDs (`correlation-<timestamp36>-<random6>`).
- **Design System**: Shopify Heritage theme (`#202219`, `#2A2C21`, `#46493C`, `#F6EDDD`), Instrument Sans typography, pill buttons, minimum 44x44px touch targets.
- **Verification Tooling**: Headless Firefox screenshot script (`scripts/capture-screenshots.sh`) for 375px, 390px, and 1280px viewports.

---

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Baseline Seams Setup | Establish repo singleton, types DTOs, service stubs, navigation links, screenshot tooling on `main` | M0 | Survey 3 |
| 2 | Product Catalog Grid | `/shop` with filter, sort, price in ₹ INR, weight, responsive cards | M1 (Task 02) | Issue 02 / Spec |
| 3 | Product Detail View | `/shop/[slug]` with craft specs, images, care guide, sticky mobile action bar | M1 (Task 02) | Issue 02 / Spec |
| 4 | Interactive Cart Drawer | Slide-over drawer, quantity controls, subtotal, real-time shipping rule calculation | M1 (Task 02) | Issue 02 / Spec |
| 5 | Shipping Calculation | Free shipping (₹0) when subtotal >= ₹2,500; flat ₹150 below ₹2,500 | M1 (Task 02) | Issue 02 / Spec |
| 6 | Mobile-First Checkout | Checkout flow with contact, shipping address, order review, payment stub | M1 (Task 02) | Issue 02 / Spec |
| 7 | Order Placement & Code | Generate `ORD-XXXX` reference code, save to repository, emit `order.created` event | M1 (Task 02) | Issue 02 / Spec |
| 8 | Order Confirmation View | Order confirmation screen with 1-click WhatsApp, Email, Phone links | M1 (Task 02) | Issue 02 / Spec |
| 9 | Order Status Tracking | `/orders/[code]` and `/orders` order status tracking with status badges | M1 (Task 02) | Issue 02 / Spec |
| 10 | Portfolio Showcase | `/custom-work` gallery showing all 5 seed portfolio pieces with craft tags | M2 (Task 03) | Issue 03 / Spec |
| 11 | Portfolio Piece Detail | `/custom-work/[slug]` with lost-wax casting details, finishes, lead time, CTA | M2 (Task 03) | Issue 03 / Spec |
| 12 | Commission Inquiry Form | `/custom-work/inquire` with callback phone, deity iconography, dimensions, finishes, target date | M2 (Task 03) | Issue 03 / Spec |
| 13 | Commission Code & Event | Generate `COM-XXXX` reference code, save inquiry, emit `commission.submitted` event | M2 (Task 03) | Issue 03 / Spec |
| 14 | Commission Confirmation | Commission confirmation view with 1-click WhatsApp, Email, Phone links | M2 (Task 03) | Issue 03 / Spec |
| 15 | Admin Navigation & Dashboard | `/admin` responsive dashboard with mobile tabs and card/table views | M3 (Task 04) | Issue 04 / Spec |
| 16 | Admin Product CRUD | Create, edit, delete products on `/admin/products` with instant `/shop` reflection | M3 (Task 04) | Issue 04 / Spec |
| 17 | Admin Portfolio CRUD | Create, edit, delete portfolio pieces on `/admin/portfolio` with instant `/custom-work` reflection | M3 (Task 04) | Issue 04 / Spec |
| 18 | Admin Destructive Confirmation | Safe confirmation dialogs for deletions with >= 44x44px touch targets | M3 (Task 04) | Issue 04 / Spec |
| 19 | Admin Domain Events | Emit `product.created`, `product.updated`, `product.deleted` logs with correlation IDs | M3 (Task 04) | Issue 04 / Spec |
| 20 | Multi-Axis Adversarial Review | Spec, Standards/Arch, A11y/Heritage, Screenshots (375/390/1280px), API/Telemetry | M4 | R2 / R3 |
| 21 | Safe Integration Merge | Clean merge of `task/02-browse-buy`, `task/03-portfolio-commission`, `task/04-admin-crud` into `main` | M5 | R3 |
| 22 | Unified Post-Merge Verification | Full 5-axis review pass across all routes and services on `main` with zero defects | M6 | R3 |

---

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Baseline Seams Setup | Scaffolding on `main`: singleton repo, types DTOs, service stubs, navigation links, screenshot tooling | None | PLANNED |
| M1 | Task 02 Workstream | Branch `task/02-browse-buy`: Catalog, Product Details, Cart Drawer, Shipping Rules, Checkout, Order Tracking | M0 | PLANNED |
| M2 | Task 03 Workstream | Branch `task/03-portfolio-commission`: Portfolio Gallery, Piece Detail, Commission Inquiry Form, COM-XXXX | M0 | PLANNED |
| M3 | Task 04 Workstream | Branch `task/04-admin-crud`: Admin Dashboard, Product CRUD, Portfolio CRUD, Destructive Dialogs | M0 | PLANNED |
| M4 | Per-Task Adversarial Review Gates | Multi-axis review + Challenger tests + Forensic Audit on each task branch | M1, M2, M3 | PLANNED |
| M5 | Safe Integration Merge | Merge `task/02`, `task/03`, `task/04` into `main` | M4 | PLANNED |
| M6 | Unified Post-Merge Review Pass | Comprehensive 5-axis verification on `main` with zero regressions and zero open defects | M5 | PLANNED |

---

## Interface Contracts

### 1. `StoreRepository` (Singleton in `src/repositories/index.ts`)
```typescript
export function getStoreRepository(): StoreRepository;
export const storeRepository: StoreRepository;
```
All services import and use `getStoreRepository()`.

### 2. Product Catalog (`src/services/product-catalog.service.ts`)
```typescript
export class ProductCatalogService {
  browseProducts(): Promise<PredefinedProduct[]>;
  getProducts(): Promise<PredefinedProduct[]>;
  getProduct(slug: string): Promise<PredefinedProduct | null>;
  getProductBySlug(slug: string): Promise<PredefinedProduct | null>;
  getProductById(id: string): Promise<PredefinedProduct | null>;
  calculateShipping(subtotalPaise: number): number;
  placeOrder(input: CreateOrderInput, correlationId?: string): Promise<Order>;
  createOrder(input: CreateOrderInput, correlationId?: string): Promise<Order>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  getOrderById(orderId: string, customerId: string): Promise<Order | null>;
  getOrderByCode(code: string): Promise<Order | null>;
}
```

### 3. Portfolio Catalog (`src/services/portfolio-catalog.service.ts`)
```typescript
export class PortfolioCatalogService {
  browsePortfolio(): Promise<PortfolioPiece[]>;
  getPortfolioPieces(): Promise<PortfolioPiece[]>;
  getPortfolioPiece(slug: string): Promise<PortfolioPiece | null>;
  getPortfolioPieceBySlug(slug: string): Promise<PortfolioPiece | null>;
  getPortfolioPieceById(id: string): Promise<PortfolioPiece | null>;
  submitCommissionInquiry(input: SubmitCommissionInquiryInput, correlationId?: string): Promise<CommissionInquiry>;
  getCommissionInquiryByCode(code: string): Promise<CommissionInquiry | null>;
}
```

### 4. Admin Service (`src/services/admin.service.ts`)
```typescript
export class DefaultAdminService implements AdminService {
  getAllProducts(): Promise<PredefinedProduct[]>;
  getProductById(id: string): Promise<PredefinedProduct | null>;
  createProduct(input: CreateProductInput, correlationId?: string): Promise<PredefinedProduct>;
  updateProduct(id: string, input: UpdateProductInput, correlationId?: string): Promise<PredefinedProduct>;
  deleteProduct(id: string, correlationId?: string): Promise<void>;

  getAllPortfolioPieces(): Promise<PortfolioPiece[]>;
  getPortfolioPieceById(id: string): Promise<PortfolioPiece | null>;
  createPortfolioPiece(input: CreatePortfolioPieceInput, correlationId?: string): Promise<PortfolioPiece>;
  updatePortfolioPiece(id: string, input: UpdatePortfolioPieceInput, correlationId?: string): Promise<PortfolioPiece>;
  deletePortfolioPiece(id: string, correlationId?: string): Promise<void>;

  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  markOrderShipped(orderId: string, courierTrackingUrl: string, correlationId?: string): Promise<Order>;
  getAllCommissionInquiries(): Promise<CommissionInquiry[]>;
  getCommissionInquiryById(id: string): Promise<CommissionInquiry | null>;

  exportSnapshot(correlationId?: string): Promise<StoreSnapshot>;
  restoreSnapshot(snapshot: StoreSnapshot, correlationId?: string): Promise<void>;
}
```

### 5. Composite Facade (`src/services/catalog.service.ts`)
Implements `CatalogService` combining `ProductCatalogService` and `PortfolioCatalogService`.

---

## Code Layout & File Ownership Matrix

| Artifact Category | Task 02 (`task/02-browse-buy`) | Task 03 (`task/03-portfolio-commission`) | Task 04 (`task/04-admin-crud`) | Baseline / Shared (LOCKED) |
| :--- | :--- | :--- | :--- | :--- |
| **Routes (`src/app/`)** | `src/app/shop/**`<br>`src/app/orders/**`<br>`src/app/api/orders/**` | `src/app/custom-work/**`<br>`src/app/api/commissions/**` | `src/app/admin/**`<br>`src/app/api/admin/**` | `src/app/layout.tsx`<br>`src/app/page.tsx`<br>`src/app/api/health/**` |
| **Components** | `src/components/shop/**`<br>(ProductCard, ProductGrid, CartDrawer, CheckoutModal, OrderConfirm) | `src/components/portfolio/**`<br>(PortfolioCard, PortfolioGrid, InquireForm, InquiryConfirm) | `src/components/admin/**`<br>(AdminNav, AdminTabs, ProductTable, PortfolioTable, DeleteModal) | `src/components/Navigation.tsx`<br>`src/components/Footer.tsx` |
| **Services** | `src/services/product-catalog.service.ts` | `src/services/portfolio-catalog.service.ts` | `src/services/admin.service.ts` | `src/services/catalog.service.ts`<br>`src/services/index.ts` |
| **Tests** | `src/services/product-catalog.service.test.ts`<br>`src/app/shop/**.test.ts` | `src/services/portfolio-catalog.service.test.ts`<br>`src/app/custom-work/**.test.ts` | `src/services/admin.service.test.ts`<br>`src/app/admin/**.test.ts` | `src/repositories/in-memory-repository.test.ts` |
| **Persistence & DB** | *Read-only access* | *Read-only access* | *Read-only access* | `src/db/schema.ts`<br>`src/repositories/in-memory-repository.ts`<br>`src/repositories/index.ts` |
| **Domain Models** | *Read-only access* | *Read-only access* | *Read-only access* | `src/domain/types.ts`<br>`src/domain/events.ts`<br>`src/domain/services.ts` |
