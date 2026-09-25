# Handoff Report: Specification Mining for Tasks 02, 03, 04 & Cross-Cutting Rules

**Agent**: `teamwork_preview_spec_miner_survey_1`  
**Role**: Specification Miner  
**Date**: 2026-09-25T18:36:00Z  
**Target Recipient**: Parent Orchestrator (`8ebf1f6d-ba88-4227-8029-4b2cee02e24e`)  

---

## 1. Observation

1. **Authoritative Specification & Issue Files Inspected**:
   - `ORIGINAL_REQUEST.md` (lines 21–35, 42–64): Mandates parallel implementation of Task 02 (`task/02-browse-buy`), Task 03 (`task/03-portfolio-commission`), and Task 04 (`task/04-admin-crud`), adhering strictly to TDD (`implement` skill), zero defects, `ORD-XXXX` / `COM-XXXX` codes, flat shipping vs free threshold ($\ge$ ₹2,500), and structured domain telemetry.
   - `.scratch/bronze-storefront/issues/02-browse-and-buy-predefined-products.md` (lines 1–21): Specifies routes `/shop`, `/shop/[slug]`, `/orders/[code]`, sticky mobile bar on small viewports, cart drawer with real-time shipping calculation, mobile checkout, `ORD-XXXX` order code, status `Ordered`, 1-click WhatsApp/Email/Phone links, and `order.created` telemetry.
   - `.scratch/bronze-storefront/issues/03-browse-portfolio-and-commission-inquiry.md` (lines 1–19): Specifies routes `/custom-work`, `/custom-work/[slug]`, `/custom-work/inquire`, showcase of 5 pieces, craft technique (*Madhuchista Vidhana* lost-wax casting), callback phone number, dimensions, `COM-XXXX` code generation, and `commission.submitted` telemetry.
   - `.scratch/bronze-storefront/issues/04-admin-product-and-portfolio-crud.md` (lines 1–20): Specifies `/admin`, `/admin/products`, `/admin/portfolio`, mobile tabs, card/table views, create/edit/delete flows, safe touch deletion confirmation modals, and `product.*` telemetry.
   - `.scratch/bronze-storefront/spec.md` (lines 100–123, 140–147, 187–190): Clarifies three-layer architecture (`CatalogService`, `AdminService`, `StoreRepository`), paise integer currency, off-platform communication (`wa.me`, `mailto:`, `tel:`), and shipping rules.
   - `CONTEXT.md` (lines 1–48): Establishes ubiquitous domain terms: `Predefined Product`, `Portfolio Piece`, `Order`, `Order Status`, `Commission Inquiry`, `Store Snapshot`, `Customer`, `Admin`.

2. **Existing Implementation & Seam Verification**:
   - `src/domain/services.ts` (lines 100–153): Defines `CatalogService` (read-only catalog + order placement + commission inquiry) and `AdminService` (full CRUD). No concrete class implementations currently exist for either service.
   - `src/domain/events.ts` (lines 6–14): `DomainEventType` currently includes `'order.created' | 'order.shipped' | 'commission.submitted' | 'product.created' | 'product.updated' | 'product.deleted' | 'snapshot.exported' | 'snapshot.restored'`. Note that `portfolio.*` events are missing from the type definition.
   - `src/repositories/in-memory-repository.ts` (lines 15–228): Fully implements `StoreRepository` with seeded data for 6 products and 5 portfolio pieces.
   - `src/lib/utils.ts` (lines 25–33): `calculateShippingPaise(subtotalPaise)` correctly implements ₹0 shipping for $\ge 250000$ paise and flat 15000 paise (₹150) below.
   - `tailwind.config.ts` (lines 13–24, 37–42): Configures exact Shopify Heritage theme colors (`heritage.dark: #202219`, `heritage.moss: #46493C`, `heritage.cream: #F6EDDD`) and minimum tap target `44px`.
   - `vitest run`: Exited code 0, 11 tests passed in 737ms.
   - `tsc --noEmit`: Exited code 0, clean type check with zero errors.

---

## 2. Logic Chain

1. **Interface & Naming Seams**:
   - In `ORIGINAL_REQUEST.md` and `issues/02-browse-and-buy-predefined-products.md`, the methods are described as `CatalogService.browseProducts()`, `.getProduct(slug)`, and `.placeOrder()`.
   - In `src/domain/services.ts`, the interface `CatalogService` specifies `getProducts()`, `getProductBySlug(slug)`, and `createOrder()`.
   - *Inference*: To ensure seamless compatibility and prevent type discrepancies, implementers must implement both forms or alias them (`browseProducts = getProducts`, `getProduct = getProductBySlug`, `placeOrder = createOrder`).
2. **Domain Telemetry for Portfolio**:
   - Issue 04 states: "All actions invoke AdminService CRUD methods and emit structured JSON logs (product.created, product.updated, product.deleted, etc.)."
   - In `src/domain/events.ts`, `DomainEventType` defines `product.*` events but does not include `portfolio.created`, `portfolio.updated`, `portfolio.deleted`.
   - *Inference*: `DomainEventType` should be expanded with `'portfolio.created' | 'portfolio.updated' | 'portfolio.deleted'` so that portfolio mutations can be logged with strict TypeScript type checking.
3. **Responsive & Mobile Usability Verification**:
   - The specs require explicit verification on 375px and 390px viewports with touch targets $\ge 44\text{px}$.
   - Existing Tailwind configuration has `min-h-tap` (44px) and `.button-primary` has `min-height: 44px`. All interactive components in new views must apply `.tap-target` or explicit $\ge 44\text{px}$ bounds.
4. **Data Isolation & Security Seams**:
   - As dictated in `CONTEXT.md` and `spec.md`, `CatalogService` is physically devoid of mutation methods on products or portfolio pieces. This ensures customer-facing routes cannot inadvertently mutate catalog or portfolio state.

---

## 3. Caveats

1. **Authentication Boundary (Google OAuth)**: Per `spec.md`, Google OAuth and late-stage route protection are scheduled for Ticket 07. Tasks 02, 03, and 04 should operate with a guest customer identifier or fallback ID (`cust-default` / `guest`) when creating orders and commission inquiries until Ticket 07 is integrated.
2. **Payment Processing**: Actual payment gateway integration (Razorpay/Stripe) is explicitly out of scope per `spec.md` line 175. Order creation marks the status as `Ordered` directly with manual payment confirmation.

---

## 4. Conclusion

All specifications, user flows, route mappings, data models, error conditions, reference code formats, shipping rules, and design tokens for Tasks 02, 03, and 04 have been mined and exhaustively documented in:
`/home/cp/Documents/bronze-e-commerce/.agents/teamwork/teamwork_preview_spec_miner_survey_1/spec_report.md`

The workstreams are unblocked to proceed with parallel implementation following the `implement` and `tdd` skills.

---

## 5. Verification Method

To independently verify this specification survey:
1. **Inspect Mined Specification Report**:
   ```bash
   cat /home/cp/Documents/bronze-e-commerce/.agents/teamwork/teamwork_preview_spec_miner_survey_1/spec_report.md
   ```
2. **Verify Baseline Tests & Typecheck**:
   ```bash
   pnpm test
   pnpm typecheck
   ```
3. **Verify Existing Repository Seam & Seed Data**:
   Check `src/repositories/in-memory-repository.test.ts` to confirm products (6) and portfolio pieces (5) are seeded and pass all 11 unit tests.
4. **Invalidation Conditions**:
   - The findings in `spec_report.md` would be invalidated if `.scratch/bronze-storefront/issues/` or `CONTEXT.md` were modified with different routes or domain rules.
