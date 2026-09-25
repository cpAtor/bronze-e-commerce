# Project Plan: bronze-e-commerce Tasks 02, 03, 04

## Overview
Implement Tasks 02, 03, and 04 in parallel workstreams with dedicated implementers using the repo's `implement` skill (`.agents/skills/implement/SKILL.md`) and TDD (`.agents/skills/tdd/SKILL.md`), paired with continuous multi-axis adversarial reviews (Spec, Standards/Architecture, A11y/Design System, Responsive Screenshots, API/Telemetry) and Forensic Audits, followed by a clean integration merge and comprehensive post-merge review pass across all 5 axes.

---

## Phase 0: Survey & Specification Mining
- **Agent 1 (Spec Miner)**: In-depth extraction from `.scratch/bronze-storefront/issues/02...`, `03...`, `04...`, `spec.md`, and `CONTEXT.md`.
  - Enumerate routes, components, data models, error codes, reference code formats (`ORD-XXXX`, `COM-XXXX`), shipping rules (free >= ₹2,500, flat ₹150 below), domain events (`order.created`, `commission.submitted`, `product.created`, `product.updated`, `product.deleted`, etc.), and acceptance criteria.
- **Agent 2 (Codebase Explorer)**: Codebase layout, package setup, Next.js / React / TypeScript config, existing tests, Tailwind / Heritage design system, `StoreRepository`, SQLite / DB setup, logger (`logDomainEvent`).
- **Agent 3 (Interface & Branching Explorer)**: File boundaries, shared seams (`StoreRepository`, `CatalogService`, types, routes), branch plan (`task/02-browse-buy`, `task/03-portfolio-commission`, `task/04-admin-crud`), avoiding merge conflicts, and verification commands (`pnpm test`, `pnpm typecheck`, `pnpm build`, dev server).

## Phase 1: Parallel Workstreams Execution
- **Workstream 02 (`task/02-browse-buy`)**:
  - Implement `CatalogService.browseProducts()`, `.getProduct(slug)`, `.placeOrder()`.
  - Build `/shop` catalog grid, product detail page `/shop/[slug]` with sticky mobile action bar, interactive cart drawer with real-time shipping calculation, mobile-first checkout modal/page, order confirmation view with WhatsApp/Email/Phone links, and `/orders/[code]` order status view.
  - TDD + unit/integration tests + domain logging.
- **Workstream 03 (`task/03-portfolio-commission`)**:
  - Implement `CatalogService.browsePortfolio()`, `.getPortfolioPiece(slug)`, `.submitCommissionInquiry()`.
  - Build `/custom-work` showcase gallery, piece details `/custom-work/[slug]`, and `/custom-work/inquire` form (phone, dimensions, craft iconography, `COM-XXXX` code).
  - TDD + unit/integration tests + domain logging.
- **Workstream 04 (`task/04-admin-crud`)**:
  - Implement `AdminService` CRUD for products and portfolio pieces.
  - Build responsive `/admin` dashboard with mobile tabs, `/admin/products` create/edit/delete flows, `/admin/portfolio` create/edit/delete flows, and destructive action confirmation dialogs.
  - TDD + unit/integration tests + domain logging.

## Phase 2: Per-Workstream Multi-Axis Review & Audit Gating
For each branch:
- Axis 1: Spec Compliance Review
- Axis 2: Coding Standards & TypeScript Strictness
- Axis 3: Accessibility (WCAG AA, 44x44px touch targets) & Heritage Design System
- Axis 4: Responsive Verification & Screenshots (Mobile 375px/390px, Desktop 1280px+)
- Axis 5: Backend API Validation & Structured Telemetry
- Adversarial Challengers: Edge cases, boundaries, error payloads
- Forensic Auditor: Non-negotiable anti-cheat check (no hardcoded test returns or dummy mocks)

## Phase 3: Safe Integration Merge
- Merge `task/02-browse-buy`, `task/03-portfolio-commission`, and `task/04-admin-crud` into `main`.
- Resolve any overlapping routes, shared imports, or repository additions.
- Ensure all tests pass on merged branch.

## Phase 4: Unified Post-Merge Review Pass & Zero-Defect Signoff
- Run complete test suite, typecheck, and build on `main`.
- Re-run 5-axis review pass across entire application on `main`.
- Capture full evidence and synthesize final completion report.
