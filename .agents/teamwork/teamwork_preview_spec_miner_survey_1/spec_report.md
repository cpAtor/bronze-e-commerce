# Specification Mining Report: Tasks 02, 03, 04 & Cross-Cutting Architecture

**Author**: `teamwork_preview_spec_miner_survey_1`  
**Date**: 2026-09-25T18:35:00Z  
**Target Milestone**: Survey & Specification Extraction for Bronze Storefront (Tasks 02, 03, 04)  
**Primary Authoritative Sources**:
- `ORIGINAL_REQUEST.md` (Multi-stream execution prompt and acceptance criteria)
- `.scratch/bronze-storefront/issues/02-browse-and-buy-predefined-products.md`
- `.scratch/bronze-storefront/issues/03-browse-portfolio-and-commission-inquiry.md`
- `.scratch/bronze-storefront/issues/04-admin-product-and-portfolio-crud.md`
- `.scratch/bronze-storefront/spec.md` (Master Architectural & Functional Specification)
- `CONTEXT.md` (Domain language, entities, boundaries, and communication model)
- Codebase baseline: `src/domain/services.ts`, `src/domain/types.ts`, `src/domain/events.ts`, `src/db/schema.ts`, `src/repositories/in-memory-repository.ts`, `tailwind.config.ts`, `src/app/globals.css`.

---

## 1. Executive Summary

The Bronze Craft & Temple Commissions Storefront is a Next.js (App Router) + TypeScript e-commerce and bespoke intake application crafted under the Shopify Heritage aesthetic. It serves two distinct functional flows:
1. **Predefined Product Retail (Task 02)**: Direct catalog browsing, product inspection, real-time cart manipulation with automated shipping calculation (free for orders $\ge$ ₹2,500, flat ₹150 below), mobile-first checkout, order placement creating reference code `ORD-XXXX`, status tracking (`Ordered` / `Shipped`), and off-platform Admin communication via WhatsApp, Email, and Phone.
2. **Custom Temple Commission Intake (Task 03)**: Showcase portfolio browsing, craft & casting technique details (*Madhuchista Vidhana* lost-wax casting), touch-friendly bespoke commission inquiry submission creating reference code `COM-XXXX`, and off-platform Admin callback coordination.
3. **Admin Management & CRUD (Task 04)**: Mobile-optimized dashboard with touch-friendly tabs, card/table views for Predefined Products and Portfolio Pieces, complete creation/edit/deletion workflows with safe confirmation modals, and immediate storefront reflection.

The codebase strictly enforces an architectural three-layer split:
- **`CatalogService`**: Customer-facing, read-only catalog access + order placement + inquiry submission. Physically lacks product mutation or order editing capabilities.
- **`AdminService`**: Owner-facing, full CRUD on products and portfolio pieces, order tracking updates, inquiry reviews, and snapshot export/restore.
- **`StoreRepository`**: Pure persistence boundary (In-Memory for unit/integration tests, SQLite/Turso via Drizzle ORM for production).

---

## Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Task 02: Catalog | Catalog Grid (`/shop`) | Responsive grid displaying all 6 Predefined Products (1–2 col mobile, 3–4 col desktop) with name, price in ₹ INR, weight, in-stock badge, and finish dots | HTTP GET | Rendered product cards with image, price, weight, links to `/shop/[slug]` | Empty state message if no products found | `issues/02`, `spec.md`, `page.tsx` |
| 2 | Task 02: Catalog | Product Detail (`/shop/[slug]`) | Detailed view with high-res imagery, Panchaloha alloy purity description, dimensions, weight, care guide, stock quantity, quantity selector, and "Add to Cart" | Slug string parameter | Product detail page with specifications and cart actions | 404 Not Found UI if slug does not match any product | `issues/02`, `spec.md`, `types.ts` |
| 3 | Task 02: Mobile UX | Sticky Mobile Action Bar | Fixed bottom action bar on mobile viewports (< 768px) with product price, quantity selector, and "Add to Cart" button ($\ge 44\text{px}$ touch target) | User viewport $\le 768\text{px}$ | Persistent sticky footer bar anchored to viewport bottom | Hidden on desktop viewports ($\ge 768\text{px}$) | `issues/02`, `ORIGINAL_REQUEST.md` |
| 4 | Task 02: Cart | Responsive Cart Drawer | Slide-out overlay showing line items, item image, quantity adjustment (+/-), item removal, subtotal, real-time shipping calculation, and checkout CTA | Cart state (items, quantities) | Interactive cart drawer with itemized totals and shipping breakdown | Disables checkout button if cart is empty | `issues/02`, `spec.md` |
| 5 | Task 02: Checkout | Free Shipping Calculation | Business rule: Free shipping (₹0) when subtotal $\ge$ ₹2,500 (250,000 paise); flat ₹150 (15,000 paise) when subtotal < ₹2,500 | `subtotalPaise: number` | `shippingCostPaise: number` (0 or 15000) | Negative subtotal clamped or throws `InvalidArgumentError` | `spec.md`, `lib/utils.ts` |
| 6 | Task 02: Checkout | Mobile-First Checkout | Form capturing recipient fullName, addressLine1, addressLine2 (opt), city, state, postalCode, country, and optional phone | Customer form submission | Creates order via `CatalogService.createOrder()` / `placeOrder()` | Returns inline validation errors for missing mandatory fields | `issues/02`, `spec.md`, `types.ts` |
| 7 | Task 02: Order | Order Placement & Code Gen | Generates order reference code strictly in `ORD-XXXX` format (e.g. `ORD-1001`), initializes status to `Ordered`, records items and shipping | `CreateOrderInput`, correlationId | Persisted `Order` object | Throws error on empty items, missing address, or repo failure | `issues/02`, `spec.md`, `types.ts` |
| 8 | Task 02: Order Confirmation | Order Confirmation View | Displays order summary, `ORD-XXXX` reference code, initial status `Ordered`, courier placeholder, and 1-click pre-filled WhatsApp/Email/Phone links | Order data or order code | Confirmation screen with summary and communication buttons | If code invalid, shows error with link back to `/shop` | `issues/02`, `spec.md` |
| 9 | Task 02: Order Status | Order Tracking (`/orders/[code]`) | Customer-facing order lookup by `orderCode` displaying status (`Ordered` or `Shipped`), courier tracking link if shipped, and Admin contact links | `orderCode: string` | Order status page | 404 Not Found if order code does not exist | `issues/02`, `spec.md` |
| 10 | Task 02: Telemetry | Order Telemetry Logging | Structured JSON logged to stdout via `logDomainEvent("order.created", ...)` containing timestamp, level, correlationId, and order details | `event`, `payload`, `correlationId` | Single-line JSON emitted to stdout | If logging fails, does not block order creation | `issues/02`, `events.ts` |
| 11 | Task 03: Portfolio | Portfolio Gallery (`/custom-work`) | Responsive showcase gallery (1 col mobile, 2–3 col desktop) of 5 custom works with craft notes, lead times, dimensions, and detail links | HTTP GET | Rendered showcase grid with image, dimensions, lead times | Empty state message if no pieces found | `issues/03`, `spec.md` |
| 12 | Task 03: Portfolio | Portfolio Detail (`/custom-work/[slug]`) | Showcase piece detail page with high-res photos, *Madhuchista Vidhana* lost-wax casting technique specs, finish options, and "Request Custom Quote" CTA | Slug string parameter | Detailed portfolio view with specs and inquiry button | 404 Not Found UI if slug does not match | `issues/03`, `spec.md` |
| 13 | Task 03: Inquiry | Commission Inquiry Form (`/custom-work/inquire`) | Mobile-optimized form capturing itemType, deityIconography, dimensions, finishPreference, targetDate, callback phoneNumber, and optional inspiredBy piece | User input fields + optional `?piece=` or `?inspiredBy=` query param | Pre-filled or clean inquiry form | Highlights invalid/empty required fields with mobile-friendly alerts | `issues/03`, `spec.md` |
| 14 | Task 03: Inquiry | Commission Code Gen (`COM-XXXX`) | Generates commission reference code strictly in `COM-XXXX` format (e.g. `COM-1001`), persists inquiry via `CatalogService.submitCommissionInquiry()` | `SubmitCommissionInquiryInput`, correlationId | Persisted `CommissionInquiry` object | Rejects submission if mandatory phoneNumber is missing | `issues/03`, `spec.md`, `types.ts` |
| 15 | Task 03: Inquiry | Commission Confirmation | Displays submitted specs, `COM-XXXX` reference code, and 1-click pre-filled WhatsApp, Email, and Phone contact links | `CommissionInquiry` object | Confirmation view with inquiry reference and contact triggers | Displays fallback message if submission state lost | `issues/03`, `spec.md` |
| 16 | Task 03: Telemetry | Commission Telemetry Logging | Structured JSON logged to stdout via `logDomainEvent("commission.submitted", ...)` with correlation ID and inquiry payload | `event`, `payload`, `correlationId` | Single-line JSON emitted to stdout | Resilient to logging formatting errors | `issues/03`, `events.ts` |
| 17 | Task 04: Admin | Admin Dashboard (`/admin`) | Mobile-first dashboard layout with touch-friendly navigation tabs (`Products`, `Portfolio`, `Orders`, `Inquiries`), quick metrics, and health indicators | HTTP GET | Rendered admin hub with active tab navigation | Redirects or flags unauthorized users if protected | `issues/04`, `spec.md` |
| 18 | Task 04: Admin | Product CRUD (`/admin/products`) | Responsive card view (mobile) and table view (desktop) listing all products with thumbnail, name, price, stock, and quick edit/delete actions | HTTP GET | Product management list with "Add Product" CTA | Displays empty state with prompt to create product | `issues/04`, `spec.md` |
| 19 | Task 04: Admin | Create Product (`/admin/products/new`) | Form with fields for name, slug, description, price (rupees/paise), weight, dimensions, alloy, care guide, stock, and image URLs | `CreateProductInput` form data | Newly created `PredefinedProduct`, immediate reflection on `/shop` | Validates slug uniqueness, positive price and stock | `issues/04`, `services.ts` |
| 20 | Task 04: Admin | Edit Product (`/admin/products/[id]/edit`) | Form pre-filled with existing product data allowing updates to price, descriptions, stock, specifications, and images | `UpdateProductInput` form data | Updated `PredefinedProduct`, immediate reflection on `/shop` | 404 if product not found; validates updated fields | `issues/04`, `services.ts` |
| 21 | Task 04: Admin | Delete Product with Confirm Dialog | Destructive action triggered with confirmation modal having safe touch targets ($\ge 44\text{px}$) to prevent accidental taps on mobile | Product ID + confirmation tap | Product deleted from repository, removed from `/shop` | Requires explicit user confirmation before deletion | `issues/04`, `spec.md` |
| 22 | Task 04: Admin | Portfolio CRUD (`/admin/portfolio`) | Responsive card/table view listing portfolio pieces with thumbnail, name, dimensions, lead times, finish options, and edit/delete actions | HTTP GET | Portfolio management list with "Add Piece" CTA | Displays empty state if no pieces exist | `issues/04`, `spec.md` |
| 23 | Task 04: Admin | Create Portfolio Piece (`/admin/portfolio/new`) | Form with fields for name, slug, description, referenceDimensions, castingTechnique, finishOptions, leadTime, and image URLs | `CreatePortfolioPieceInput` form data | Newly created `PortfolioPiece`, immediate reflection on `/custom-work` | Validates unique slug and non-empty technique/dimensions | `issues/04`, `services.ts` |
| 24 | Task 04: Admin | Edit Portfolio Piece (`/admin/portfolio/[id]/edit`) | Form pre-filled with existing portfolio piece allowing full edits | `UpdatePortfolioPieceInput` form data | Updated `PortfolioPiece`, immediate reflection on `/custom-work` | 404 if piece not found; validates updated fields | `issues/04`, `services.ts` |
| 25 | Task 04: Admin | Delete Portfolio Piece with Dialog | Destructive action confirmation modal with safe touch targets ($\ge 44\text{px}$) | Piece ID + confirmation tap | Piece removed from repository and `/custom-work` | Requires explicit confirmation | `issues/04`, `spec.md` |
| 26 | Task 04: Telemetry | Admin Telemetry Logging | Structured JSON logged to stdout via `logDomainEvent` on mutations (`product.created`, `product.updated`, `product.deleted`, etc.) | Mutation event, payload, correlation ID | Single-line JSON emitted to stdout | Non-blocking execution | `issues/04`, `events.ts` |
| 27 | Cross-Cutting | Heritage Design System | Palette (Scheme 1 `#202219`, Scheme 3 `#46493C`, cream `#F6EDDD`, subtle borders), Instrument Sans font, and pill buttons (`rounded-full`, 44px) | Tailwind theme tokens and utility classes | Cohesive heritage visual identity across all views | Fallback to system fonts and baseline theme | `spec.md`, `tailwind.config.ts`, `globals.css` |
| 28 | Cross-Cutting | Mobile Tap Target Compliance | All interactive elements (buttons, inputs, links, tabs, dialog triggers) meet or exceed $44 \times 44\text{px}$ bounds | Mobile viewports (375px, 390px) | Comfortable, error-free touch accessibility (WCAG AA) | Flagged during review if $< 44\text{px}$ | `ORIGINAL_REQUEST.md`, `globals.css` |
| 29 | Cross-Cutting | 1-Click Communication Links | Off-platform contact generators for WhatsApp (`wa.me`), Email (`mailto:`), and Phone (`tel:`) pre-filled with reference codes | Admin config + order/commission reference | Clickable action links opening native client apps | Handles special character encoding properly | `spec.md`, `CONTEXT.md`, `config.ts` |

---

## Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Free Shipping Calculation | Subtotal exactly ₹2,500 (250,000 paise) | Shipping is ₹0 (`calculateShippingPaise(250000) === 0`). The rule is inclusive ($\ge 2,500$). |
| 2 | Flat Shipping Calculation | Subtotal ₹2,499 (249,900 paise) | Shipping is flat ₹150 (`calculateShippingPaise(249900) === 15000`). Flat fee applies below threshold. |
| 3 | Free Shipping Calculation | Subtotal ₹0 (0 paise) | Shipping is ₹150 (`calculateShippingPaise(0) === 15000`). Empty cart cannot checkout. |
| 4 | Order Placement | Order items array is empty `items: []` | Must be rejected before order generation; throws validation error and prevents order creation. |
| 5 | Order Placement | Product ID not found in catalog | Order placement fails with `NotFoundError` / 400; inventory item validation required. |
| 6 | Order Placement | Quantity $\le 0$ or non-integer | Rejects with validation error; quantities must be positive integers ($\ge 1$). |
| 7 | Order Code Format | Sequential or random code generation | Strict format `ORD-XXXX` (uppercase prefix `ORD-` followed by 4 alphanumeric characters/digits, e.g. `ORD-1001` or `ORD-8F2A`). |
| 8 | Commission Code Format | Sequential or random code generation | Strict format `COM-XXXX` (uppercase prefix `COM-` followed by 4 alphanumeric characters/digits, e.g. `COM-1001` or `COM-3K9P`). |
| 9 | Commission Inquiry | Missing callback `phoneNumber` | Rejection with field error: `phoneNumber` is mandatory for off-platform callback follow-up. |
| 10 | Commission Inquiry | Pre-fill with invalid `inspiredByPortfolioId` | If query param has non-existent ID or slug, degrade gracefully to blank selection without crashing. |
| 11 | Order Status Tracking | Looking up unknown order code (`ORD-9999`) | Returns HTTP 404 / friendly "Order Not Found" view with link back to shop. |
| 12 | Order Status Tracking | Status is `Ordered` | Courier tracking section displays "Awaiting dispatch from Swamimalai workshop" placeholder; no broken tracking link. |
| 13 | Order Status Tracking | Status is `Shipped` | Displays prominent clickable tracking link with courier URL (`courierTrackingUrl`). |
| 14 | Admin Product Create | Duplicate `slug` submitted | SQLite schema has unique constraint on `slug`; service must catch conflict and return 409 Conflict / form error. |
| 15 | Admin Product Create | Negative price or stock quantity | Validation rejects values $< 0$; prices must be positive paise; stock must be $\ge 0$. |
| 16 | Admin Destructive Delete | Deletion button tapped accidentally on mobile | Confirmation modal prevents immediate deletion; requires second confirmation tap on a distinct target. |
| 17 | Telemetry Logging | Missing explicit `correlationId` | Generates a valid unique fallback ID (`correlation-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`). |
| 18 | Mobile Viewport Layout | Viewport width 375px / 390px (iPhone SE / 12 / 14) | No horizontal overflow scroll, no clipped text, sticky bottom action bar does not obscure content (padding-bottom accounted for). |
| 19 | Off-Platform WhatsApp Link | Special characters or spaces in product/order code | Proper URI encoding via `encodeURIComponent()` (e.g. `Namaskaram%2C%20I%20would%20like...`). |

---

## 2. Task 02 Deep Dive: Browse & Buy Predefined Products

### 2.1 Required Routes
- **`/shop`**: Catalog grid page.
  - Responsive layout: 1–2 columns on mobile ($< 640\text{px}$), 2–3 columns on tablet, 3–4 columns on desktop ($\ge 1024\text{px}$).
  - Card displays: Product image (with hover zoom effect), in-stock badge, product title, formatted ₹ INR price, weight specification (e.g. `1.25 kg`), and finish swatch indicators.
- **`/shop/[slug]`**: Product detail page.
  - Large responsive hero imagery / gallery.
  - Product title, category/type, formatted ₹ INR price.
  - Rich craftsmanship storytelling: alloy purity (*Traditional Panchaloha*), weight, dimensions, and care instructions (*Pitambari / tamarind care*).
  - Quantity selector (+/- buttons, minimum 1).
  - "Add to Cart" button with instant feedback.
  - Sticky mobile action bar anchored to the bottom on screens $< 768\text{px}$.
- **`/orders/[code]`**: Customer order tracking page.
  - Dynamic route matching `orderCode` (e.g., `/orders/ORD-1001`).
  - Displays current `status`: `Ordered` (with status badge and explanation) or `Shipped` (with active courier tracking URL).
  - Full order summary: line items, quantities, unit prices, shipping fee, total amount paid.
  - Delivery address card.
  - 1-click contact actions: WhatsApp, Email, Phone with pre-filled `ORD-XXXX` reference.
- **`/orders`**: Order lookup page or customer order history list. Allows customer to input an order code or view their recent orders.

### 2.2 Key UI Components
1. **Interactive Cart Drawer / Modal**:
   - Opens when clicking the header cart icon or when a product is added.
   - Lists line items: image thumbnail, item name, unit price, quantity increment/decrement controls, item remove icon button.
   - Summary card: Line item subtotal, real-time shipping calculation line (displays "Free" if subtotal $\ge$ ₹2,500, else "₹150"), order grand total.
   - Primary CTA button: "Proceed to Checkout" (disabled if empty).
   - Backdrop overlay with smooth transition and `Escape` key listener.
2. **Mobile Sticky Action Bar**:
   - Fixed to viewport bottom on mobile (`fixed bottom-0 left-0 right-0 z-30 md:hidden`).
   - Compact display of product price, quantity stepper, and full-width or prominent "Add to Cart" pill button.
   - Minimum tap target $\ge 44\text{px}$.
   - Parent page body includes matching bottom padding (`pb-24`) so sticky bar never obscures content.
3. **Checkout Modal / Page**:
   - Mobile-first layout with clean field groups.
   - Fields: Recipient Full Name (`fullName`), Email Address (`email`), Address Line 1 (`addressLine1`), Address Line 2 (`addressLine2`, optional), City (`city`), State (`state`), PIN Code (`postalCode`), Country (`country`, default "India"), Phone Number (`phone`, optional).
   - Order review summary box.
   - Action: "Place Order" button with loading state.
4. **Order Confirmation View**:
   - Clean success banner with decorative heritage icon.
   - Prominently highlighted `orderCode` (e.g. `ORD-1001`) with 1-click copy action.
   - Three 1-click contact action buttons:
     - **WhatsApp**: `https://wa.me/<ADMIN_PHONE>?text=Namaskaram%2C%20regarding%20my%20Order%20ORD-XXXX`
     - **Email**: `mailto:<ADMIN_EMAIL>?subject=Inquiry%20regarding%20Order%20ORD-XXXX`
     - **Phone**: `tel:<ADMIN_PHONE>`

### 2.3 Data Models & Field Schemas
- **`PredefinedProduct`**:
  ```ts
  interface PredefinedProduct {
    id: string; // e.g. "prod-001"
    name: string; // e.g. "Traditional Bronze Kalash (Lota)"
    slug: string; // e.g. "traditional-bronze-kalash"
    description: string;
    pricePaise: number; // integer paise: 280000 = ₹2,800
    weight: string; // e.g. "1.25 kg"
    dimensions: string; // e.g. "15cm x 15cm x 18cm"
    alloyDescription: string; // e.g. "Traditional Panchaloha..."
    careGuide: string; // Care instructions
    stockQuantity: number;
    images: string[]; // ['/images/products/bronze-kalash.jpg']
    createdAt: number;
    updatedAt: number;
  }
  ```
- **`Order`**:
  ```ts
  interface Order {
    id: string; // UUID or string id
    orderCode: string; // Strict format "ORD-XXXX" (e.g. "ORD-1001")
    customerId: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    shippingCostPaise: number; // 0 or 15000
    totalPaise: number; // subtotalPaise + shippingCostPaise
    status: 'Ordered' | 'Shipped';
    courierTrackingUrl?: string | null;
    createdAt: number;
    updatedAt: number;
  }
  ```

### 2.4 Shipping Calculation Rules
$$\text{shippingCostPaise} = \begin{cases} 0 & \text{if } \text{subtotalPaise} \ge 250\,000 \text{ (₹2,500)} \\ 15\,000 & \text{if } \text{subtotalPaise} < 250\,000 \text{ (flat ₹150)} \end{cases}$$
Function implemented in `src/lib/utils.ts` as `calculateShippingPaise(subtotalPaise: number): number`.

### 2.5 Domain Telemetry & Events
- **Event**: `order.created`
- **Invocation**:
  ```ts
  logDomainEvent('order.created', {
    orderId: order.id,
    orderCode: order.orderCode,
    customerId: order.customerId,
    itemCount: order.items.reduce((acc, i) => acc + i.quantity, 0),
    totalPaise: order.totalPaise,
    shippingCostPaise: order.shippingCostPaise,
  }, correlationId);
  ```

### 2.6 Acceptance Checklist for Task 02
- [ ] `CatalogService.browseProducts()` (or `getProducts()`) and `.getProduct(slug)` (or `getProductBySlug(slug)`) implemented and tested against `StoreRepository`.
- [ ] Responsive `/shop` catalog page with Heritage typography, editorial layout, and responsive mobile grid (1–2 columns mobile, 3–4 desktop).
- [ ] Product detail page (`/shop/[slug]`) with responsive image presentation, alloy specs, dimensions, care instructions, and touch-friendly controls.
- [ ] Mobile-optimized sticky "Add to Cart" action bar on small screens ($< 768\text{px}$) to prevent unnecessary scrolling.
- [ ] Responsive cart drawer / modal supporting item increment, decrement, removal, subtotal, and shipping fee logic (free $\ge$ ₹2,500, flat ₹150).
- [ ] Mobile-first checkout form capturing shipping address, recipient name, email, and optional phone number.
- [ ] `CatalogService.placeOrder()` (or `createOrder()`) generating `ORD-XXXX` with initial status `Ordered`.
- [ ] Order confirmation view with order summary, order code, and 1-click pre-filled WhatsApp, Email, and Phone links.
- [ ] Customer order status view (`/orders/[code]`) showing `Ordered` status and courier placeholder.
- [ ] Structured JSON logging emitted on `order.created`.
- [ ] Verified responsive usability and tap target sizes ($\ge 44\text{px}$) on mobile viewports (375px/390px) and desktop.
- [ ] Service-level unit tests for product browsing, cart calculation, and order creation passing.

---

## 3. Task 03 Deep Dive: Browse Portfolio & Commission Inquiries

### 3.1 Required Routes
- **`/custom-work`**: Showcase portfolio gallery.
  - Responsive grid: 1 column on mobile, 2–3 columns on desktop.
  - Displays 5 iconic masterworks:
    1. *Nataraja Ananda Tandava Murti*
    2. *Temple Prabhavali Arch (Aureole)*
    3. *Deepastambha Ritual Branching Lamp*
    4. *Ceremonial Ghanta & Temple Kalasham*
    5. *Embossed Deity Kavacham (Chest Armor)*
  - Card displays: High-res photography, piece title, reference dimensions, typical lead time, casting technique summary (*Madhuchista Vidhana*), and link to `/custom-work/[slug]`.
  - Prominent banner leading to `/custom-work/inquire`.
- **`/custom-work/[slug]`**: Portfolio Piece detail page.
  - Large showcase photography with zoom/pan view.
  - Detailed architectural craft specifications:
    - Reference Dimensions (e.g. `24" H x 18" W x 8" D (approx. 22 kg)`)
    - Casting Technique description (e.g. *Traditional Madhuchishtavidhana with alluvial clay mold*)
    - Available Finish Options tags (e.g. *Antique Temple Patina*, *Polished Bronze Highlights*, *Deep Verdant Patina*)
    - Typical Lead Time (e.g. *8–10 weeks*)
  - Primary CTA button: "Request Custom Quote" / "Inquire About This Piece" linking directly to `/custom-work/inquire?piece=[slug]`.
- **`/custom-work/inquire`**: Commission Inquiry form.
  - Optimized for touch typing and mobile keypads.
  - Optional pre-fill banner when arrived from a portfolio piece: *"Inquiring about [Piece Name]"*.
  - Clean submission handling with immediate confirmation and reference code display.

### 3.2 Key UI Components
1. **Showcase Gallery Grid & Cards**:
   - Dark bronze card container with subtle gold/cream border accents.
   - Lead time badge and dimension summary tag.
2. **Craft Iconography & Badges**:
   - Visual badges highlighting *Madhuchista Vidhana* (Ancient Lost-Wax), *Agamic Shilpa Shastra* (Canonical Proportions), and *Hand-Burnished Finishes*.
3. **Touch-Friendly Commission Inquiry Form**:
   - Form fields:
     - **Item Type** (`itemType`): Dropdown / radio pills (e.g., "Deity Idol / Murti", "Prabhavali Arch", "Ritual Lamp", "Temple Bell / Kalasham", "Vigraha Armor / Kavacham", "Other Bespoke Work").
     - **Deity & Iconography Notes** (`deityIconography`): Textarea for posture, mudras, weapons, or tradition.
     - **Target Dimensions** (`dimensions`): Text input with example placeholder (e.g., `24" H x 18" W`).
     - **Finish Preference** (`finishPreference`): Select or pills (e.g., "Antique Temple Patina", "Mirror Polish", "Sacred Gold Finish", "Verdant Patina").
     - **Target Delivery Date** (`targetDate`): Date picker or text date (e.g., `YYYY-MM-DD`).
     - **Callback Phone Number** (`phoneNumber`): Mandatory tel input with numeric keyboard on mobile (`inputMode="tel"`).
     - **Inspired By Piece** (`inspiredByPortfolioId`): Hidden or pre-selected field based on query parameter.
   - All input controls have $\ge 44\text{px}$ touch height.
4. **Commission Confirmation Screen**:
   - Generates code `COM-XXXX` (e.g., `COM-1001`).
   - Summary card of submitted specs.
   - Clarifying text: *"The Master Sthapati will review your iconography specifications and call you back within 24 hours."*
   - Three 1-click callback links:
     - **WhatsApp**: `https://wa.me/<ADMIN_PHONE>?text=Namaskaram%2C%20I%20have%20submitted%20Commission%20Inquiry%20COM-XXXX`
     - **Email**: `mailto:<ADMIN_EMAIL>?subject=Commission%20Inquiry%20COM-XXXX`
     - **Phone**: `tel:<ADMIN_PHONE>`

### 3.3 Data Models & Field Schemas
- **`PortfolioPiece`**:
  ```ts
  interface PortfolioPiece {
    id: string; // e.g. "port-001"
    name: string; // e.g. "Nataraja Ananda Tandava Murti"
    slug: string; // e.g. "nataraja-ananda-tandava-murti"
    description: string;
    referenceDimensions: string; // e.g. "24\" H x 18\" W x 8\" D (approx. 22 kg)"
    castingTechnique: string; // e.g. "Traditional Madhuchishtavidhana..."
    finishOptions: string[]; // ["Antique Temple Patina", "Mirror Polish", ...]
    typicalLeadTime: string; // "8–10 weeks"
    images: string[];
    createdAt: number;
    updatedAt: number;
  }
  ```
- **`CommissionInquiry`**:
  ```ts
  interface CommissionInquiry {
    id: string;
    commissionCode: string; // Strict format "COM-XXXX" (e.g. "COM-1001")
    customerId: string;
    itemType: string;
    deityIconography: string;
    dimensions: string;
    finishPreference: string;
    targetDate: string;
    phoneNumber: string; // Mandatory for callback
    inspiredByPortfolioId?: string | null;
    createdAt: number;
  }
  ```

### 3.4 Domain Telemetry & Events
- **Event**: `commission.submitted`
- **Invocation**:
  ```ts
  logDomainEvent('commission.submitted', {
    inquiryId: inquiry.id,
    commissionCode: inquiry.commissionCode,
    customerId: inquiry.customerId,
    itemType: inquiry.itemType,
    phoneNumber: inquiry.phoneNumber,
    inspiredByPortfolioId: inquiry.inspiredByPortfolioId,
  }, correlationId);
  ```

### 3.5 Acceptance Checklist for Task 03
- [ ] `CatalogService.browsePortfolio()` (or `getPortfolioPieces()`) and `.getPortfolioPiece(slug)` (or `getPortfolioPieceBySlug(slug)`) implemented and tested against `StoreRepository`.
- [ ] Responsive `/custom-work` portfolio gallery page with Heritage styling (adaptive 1-column mobile, 2–3 column desktop grid).
- [ ] Portfolio Piece detail page (`/custom-work/[slug]`) with high-resolution imagery, craft notes, casting specs, and mobile-friendly CTA.
- [ ] Touch-friendly Commission Inquiry form (`/custom-work/inquire`) capturing phone number for callback, dimensions, deity iconography, finish, and optional portfolio reference.
- [ ] Form validation and error states designed for small mobile keyboards and touch interaction.
- [ ] `CatalogService.submitCommissionInquiry()` generating `COM-XXXX` reference code.
- [ ] Inquiry confirmation view showing `COM-XXXX` and instant 1-click pre-filled WhatsApp, Email, and Phone contact links.
- [ ] Structured JSON logging emitted on `commission.submitted`.
- [ ] Verified responsive layout and touch targets ($\ge 44\text{px}$) across mobile viewports (375px/390px) and desktop.
- [ ] Service-level unit tests for portfolio browsing and commission inquiry creation passing.

---

## 4. Task 04 Deep Dive: Admin Product & Portfolio CRUD

### 4.1 Required Routes
- **`/admin`**: Central Admin dashboard.
  - Mobile-first top or bottom tab bar with tabs: `Products`, `Portfolio`, `Orders`, `Inquiries`.
  - Overview cards: Total Predefined Products in catalog, Total Portfolio Pieces, Quick Actions ("New Product", "New Portfolio Piece").
  - System health indicator (DB connectivity status).
- **`/admin/products`**: Predefined Products list.
  - Mobile view: Stacked responsive cards showing image thumbnail, name, price (₹ INR), stock quantity badge, and quick Edit / Delete buttons.
  - Desktop view: Clean tabular list with sorting and action columns.
  - Prominent "Add New Product" button.
- **`/admin/products/new`**: Create product page/modal.
  - Fields: Name, Slug, Description, Price (in ₹ or paise), Weight, Dimensions, Alloy Description, Care Guide, Stock Quantity, Image URLs (comma/newline separated or dynamic list).
- **`/admin/products/[id]/edit`**: Edit product page/modal.
  - Pre-populated form allowing full modification of all product fields.
  - Immediate persistence and reflection on storefront (`/shop`).
- **`/admin/portfolio`**: Portfolio Pieces list.
  - Responsive card/table view displaying thumbnail, piece name, reference dimensions, typical lead time, and Edit / Delete actions.
  - "Add Portfolio Piece" button.
- **`/admin/portfolio/new`**: Create portfolio piece page/modal.
  - Fields: Name, Slug, Description, Reference Dimensions, Casting Technique, Finish Options (comma/tag separated), Typical Lead Time, Image URLs.
- **`/admin/portfolio/[id]/edit`**: Edit portfolio piece page/modal.
  - Pre-populated form allowing updates to showcase items.
  - Immediate reflection on `/custom-work`.

### 4.2 Key UI Components
1. **Touch-Friendly Tab Navigation**:
   - Mobile tabs with clear active state (`bg-heritage-cream text-heritage-dark`) and inactive state (`text-heritage-muted`).
   - Minimum tap target $\ge 44\text{px}$.
2. **Card & Table Adaptive Views**:
   - On screen widths $< 768\text{px}$, render cards to avoid horizontal scrolling and truncated columns.
   - On screens $\ge 768\text{px}$, render responsive tables with subtle dividers.
3. **Destructive Action Confirmation Modals**:
   - Dialog pops up when "Delete" is clicked.
   - Explicit confirmation warning: *"Are you sure you want to delete [Item Name]? This action cannot be undone."*
   - Buttons: "Cancel" (secondary, $\ge 44\text{px}$) and "Delete" (destructive red/accent, $\ge 44\text{px}$) with safe spacing between them to prevent mis-clicks.
4. **Form Controls Optimized for Mobile Inputs**:
   - Number inputs with appropriate step/pattern.
   - Clear helper text for price (informing whether input is in Rupees ₹ or Paise).
   - Textareas with auto-resize or comfortable minimum height.

### 4.3 Data Models & Mutation Schemas
- **`CreateProductInput`**:
  ```ts
  interface CreateProductInput {
    name: string;
    slug: string;
    description: string;
    pricePaise: number;
    weight: string;
    dimensions: string;
    alloyDescription: string;
    careGuide: string;
    stockQuantity: number;
    images: string[];
  }
  ```
- **`UpdateProductInput`**: Partial of `CreateProductInput`.
- **`CreatePortfolioPieceInput`**:
  ```ts
  interface CreatePortfolioPieceInput {
    name: string;
    slug: string;
    description: string;
    referenceDimensions: string;
    castingTechnique: string;
    finishOptions: string[];
    typicalLeadTime: string;
    images: string[];
  }
  ```
- **`UpdatePortfolioPieceInput`**: Partial of `CreatePortfolioPieceInput`.

### 4.4 Domain Telemetry & Events
- `product.created`: Emitted when a new product is added.
- `product.updated`: Emitted when product details/price/stock are updated.
- `product.deleted`: Emitted when a product is deleted.
- **Note on Portfolio Events**: While `DomainEventType` currently defines `product.*`, telemetry for portfolio mutations should either emit under `product.*` or `DomainEventType` in `src/domain/events.ts` should be expanded to include:
  `| 'portfolio.created' | 'portfolio.updated' | 'portfolio.deleted'`.

### 4.5 Acceptance Checklist for Task 04
- [ ] `AdminService` CRUD methods for `PredefinedProduct` and `PortfolioPiece` implemented and tested against `StoreRepository`.
- [ ] Responsive `/admin` dashboard layout with mobile-first navigation bar and touch-friendly tabs.
- [ ] Predefined Products management view (`/admin/products`): responsive card/table list showing thumbnail, name, price, stock, and quick edit/delete actions.
- [ ] Product creation and edit forms with mobile-friendly form controls (number inputs, textarea, image URL lists).
- [ ] Portfolio Pieces management view (`/admin/portfolio`): responsive list with preview image, category, and edit/delete actions.
- [ ] Portfolio creation and edit forms with structured fields for casting technique, dimensions, and finish options.
- [ ] Deletion confirmation modals with safe touch targets to prevent accidental taps on mobile.
- [ ] Storefront verification: creating/editing a product or portfolio piece updates `/shop` and `/custom-work` immediately.
- [ ] Structured JSON logging emitted for all product and portfolio mutations.
- [ ] Mobile usability verified on small screen viewports (375px/390px) and desktop.
- [ ] Unit tests for all Admin CRUD operations passing.

---

## 5. Cross-Cutting Architecture, Tokens & Design System

### 5.1 Heritage Theme Design Tokens
The design system replicates the Shopify Heritage Theme aesthetic:
- **Palette**:
  - `heritage.dark` (`#202219` / `rgb(32 34 25)`): Primary deep background.
  - `heritage.darker` (`#161811`): Dark contrast background.
  - `heritage.surface` (`#2A2C21`): Card, modal, and drawer elevated surface.
  - `heritage.moss` (`#46493C` / `rgb(70 73 60)`): Accent editorial split background.
  - `heritage.cream` (`#F6EDDD` / `rgb(246 237 221)`): Primary high-contrast foreground text and primary button fill.
  - `heritage.cream-hover` (`#E1D9CB`): Hover state for buttons/links.
  - `heritage.muted` (`rgba(246, 237, 221, 0.65)`): Secondary labels and metadata.
  - `heritage.subtle` (`rgba(246, 237, 221, 0.40)`): De-emphasized indicators.
  - `heritage.border` (`rgba(246, 237, 221, 0.18)`): Card and section divider borders.
  - `heritage.border-light` (`rgba(246, 237, 221, 0.10)`): Subtle dividers.
  - Accent Swatches:
    - Traditional Bronze: `#8C6D58`
    - High Polish Gold: `#C8A951`
    - Verdant Patina: `#4A7C59`
- **Typography**:
  - Font: `Instrument Sans` via Next.js Google Fonts (`--font-instrument-sans`).
  - Letter Spacing:
    - `letterSpacing.display`: `-0.03em`
    - `letterSpacing.subheading`: `0.12em` / `0.16em`
    - Monogram tracking: `0.25em`
- **Button Styling**:
  - `button-primary`: `inline-flex items-center justify-center rounded-full bg-heritage-cream text-heritage-dark px-7 py-3 text-sm font-medium tracking-wide transition-all duration-200 hover:bg-heritage-cream-hover active:scale-[0.98] min-h-[44px]`
  - `button-secondary`: `inline-flex items-center justify-center rounded-full border border-heritage-border bg-transparent text-heritage-cream px-7 py-3 text-sm font-medium tracking-wide transition-all duration-200 hover:bg-heritage-cream/10 active:scale-[0.98] min-h-[44px]`

### 5.2 Touch Target Specifications
- **WCAG AA Compliance**: All touch targets must measure at least $44 \times 44\text{px}$ (`min-h-tap` and `min-w-tap` or class `.tap-target`).
- Applies to:
  - Header hamburger button, search icon, account icon, cart bag icon.
  - Quantity selector stepper buttons (+ / -).
  - Form submit buttons, sticky mobile bar button.
  - Table action buttons (Edit, Delete, View).
  - Modal close buttons and tab buttons.

### 5.3 Logging & Telemetry Schema
- Utility: `logDomainEvent(event, payload, correlationId)` in `src/domain/events.ts`.
- Format:
  ```json
  {
    "timestamp": "2026-09-25T18:32:01.263Z",
    "level": "info",
    "event": "order.created",
    "payload": { ... },
    "correlationId": "correlation-m8q1wz-a4f9b2"
  }
  ```
- Output channel: `stdout` via `console.log(JSON.stringify(logEntry))`. Single-line JSON format guarantees automated parsing by Vercel Logs and CloudWatch.

### 5.4 Error Handling & HTTP Status Matrix
- **400 Bad Request**: Missing mandatory fields, empty cart submission, non-positive quantities or prices, missing callback phone number.
- **404 Not Found**: Non-existent product slug, non-existent portfolio slug, non-existent `orderCode` or `commissionCode`.
- **409 Conflict**: Duplicate slug creation on products or portfolio pieces.
- **500 Internal Server Error**: Persistence failure or unexpected runtime errors. Must return JSON `{ "error": "Internal Server Error", "correlationId": "..." }`.

### 5.5 Communication Model (WhatsApp / Email / Phone Links)
- WhatsApp:
  `https://wa.me/${cleanPhone}?text=${encodeURIComponent("Namaskaram, regarding Order " + orderCode)}`
- Email:
  `mailto:${adminEmail}?subject=${encodeURIComponent("Order " + orderCode)}&body=${encodeURIComponent("Customer details...")}`
- Phone:
  `tel:${cleanPhone}`

---

## 6. Discovered Architectural Nuances & Recommendations

1. **Service Interface Method Aliasing**:
   - `src/domain/services.ts` defines:
     - `CatalogService.getProducts()`
     - `CatalogService.getProductBySlug(slug)`
     - `CatalogService.createOrder(input)`
     - `CatalogService.getPortfolioPieces()`
     - `CatalogService.getPortfolioPieceBySlug(slug)`
     - `CatalogService.submitCommissionInquiry(input)`
   - The user prompt mentions:
     - `browseProducts()`, `getProduct(slug)`, `placeOrder()`
     - `browsePortfolio()`, `getPortfolioPiece(slug)`
   - **Recommendation**: Implementers should provide aliases (e.g. `browseProducts = getProducts`, `placeOrder = createOrder`, `getProduct = getProductBySlug`) so that both call styles resolve without TypeScript errors.
2. **Portfolio Telemetry Event Types**:
   - `DomainEventType` in `src/domain/events.ts` has `product.created | product.updated | product.deleted` but lacks `portfolio.*`.
   - **Recommendation**: Expand `DomainEventType` with `'portfolio.created' | 'portfolio.updated' | 'portfolio.deleted'` to ensure type safety when Task 04 implementers log portfolio mutations.
3. **Reference Code Generation Consistency**:
   - Format `ORD-XXXX`: prefix `ORD-` + 4 characters/digits (e.g. `ORD-1001` or random `ORD-${Math.random().toString(36).substring(2,6).toUpperCase()}`).
   - Format `COM-XXXX`: prefix `COM-` + 4 characters/digits (e.g. `COM-1001`).
   - Using uppercase alphanumeric or 4-digit sequential numbers ensures clean, human-readable codes suitable for WhatsApp and SMS.
