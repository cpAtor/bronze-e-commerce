# Original User Request

## Initial Request — 2026-09-25T18:27:43Z

Implement Task 02 (Browse & Buy Predefined Products), Task 03 (Browse Portfolio & Request Commission), and Task 04 (Admin Product & Portfolio CRUD) in parallel workstreams with dedicated implementers using the repo's `implement` skill (`.agents/skills/implement/SKILL.md`) and TDD, paired with adversarial reviewers running continuous feedback loops until zero defects remain, followed by a unified merge and comprehensive post-merge review cycle.

Working directory: `/home/cp/Documents/bronze-e-commerce`
Integrity mode: development

Reference specs & skills:
- Implement Skill: `.agents/skills/implement/SKILL.md`
- TDD Skill: `.agents/skills/tdd/SKILL.md`
- Task 02 Spec: `.scratch/bronze-storefront/issues/02-browse-and-buy-predefined-products.md`
- Task 03 Spec: `.scratch/bronze-storefront/issues/03-browse-portfolio-and-commission-inquiry.md`
- Task 04 Spec: `.scratch/bronze-storefront/issues/04-admin-product-and-portfolio-crud.md`
- Master Spec: `.scratch/bronze-storefront/spec.md`
- Architecture & Seams: `CONTEXT.md`

## Requirements

### R1. Parallel Implementation via Dedicated Workstreams using the `implement` Skill & TDD
- All implementing subagents must follow the repo's `implement` skill (`.agents/skills/implement/SKILL.md`): work strictly from the issue spec/tickets, use `/tdd` at pre-agreed seams (red-green-refactor), run typechecking (`pnpm typecheck`) and individual test files regularly, run the full test suite (`pnpm test`), and commit cleanly to the task branch.
- **Task 02 (Browse & Buy Predefined Products)**: Branch `task/02-browse-buy`. Implement `CatalogService.browseProducts()`, `.getProduct(slug)`, and `.placeOrder()`. Build `/shop` catalog grid, product detail page `/shop/[slug]` with sticky mobile action bar, interactive cart drawer with real-time shipping calculation (free >= ₹2,500, flat ₹150 below), mobile-first checkout modal/page, order confirmation view with 1-click WhatsApp/Email/Phone links, and `/orders/[code]` order status view.
- **Task 03 (Browse Portfolio & Commission Inquiries)**: Branch `task/03-portfolio-commission`. Implement `CatalogService.browsePortfolio()`, `.getPortfolioPiece(slug)`, and `.submitCommissionInquiry()`. Build `/custom-work` showcase gallery, piece details `/custom-work/[slug]`, and touch-friendly `/custom-work/inquire` form capturing callback phone number, dimensions, and craft iconography, generating `COM-XXXX` reference codes with structured confirmation.
- **Task 04 (Admin Product & Portfolio CRUD)**: Branch `task/04-admin-crud`. Implement `AdminService` CRUD for products and portfolio pieces. Build responsive `/admin` dashboard with mobile tabs and card/table views, `/admin/products` create/edit/delete flows, `/admin/portfolio` create/edit/delete flows, and destructive action confirmation dialogs.

### R2. Continuous Multi-Axis Implementer-Reviewer Loop per Task
Each task branch must undergo an iterative adversarial review cycle before it can be considered ready to merge, evaluated across these parallel review axes:
- **Spec Compliance**: Audit the implementation line-by-line against the task's originating issue specification in `.scratch/bronze-storefront/issues/` and the master spec. Verify all specified route paths, data models, fields, error states, reference code formats (`ORD-XXXX`, `COM-XXXX`), shipping cost rules, and acceptance checklist items are 100% satisfied without missing or modified requirements.
- **Coding Standards & Architecture**: Adherence to TypeScript strict typing, repository pattern seams (`StoreRepository`), no leaky abstractions, clean modular code, and thorough test coverage.
- **Accessibility & Design System**: WCAG AA compliance, semantic HTML, keyboard navigability, screen-reader attributes, adherence to the Heritage theme aesthetic and design system, and minimum 44x44px touch targets on mobile.
- **Visual & Responsive Verification (Screenshots)**: Start the application locally and capture screenshots on mobile (375px and 390px viewports) and desktop (1280px+). Inspect captured images to guarantee no text truncation, overlapping controls, awkward layout shifts, or obstructed buttons, ensuring the layout feels natural and intuitive.
- **Backend API & Telemetry**: Rigorous payload validation on all endpoints/actions, defensive boundaries, throwing the right errors at the right time with appropriate HTTP status codes, and structured JSON logs (`logDomainEvent`) emitted to stdout with correlation IDs for both errors and domain events (`order.created`, `commission.submitted`, `product.created`, `product.updated`, `product.deleted`, etc.).
- Review feedback loops back to the implementer until all review findings across all axes are completely resolved.

### R3. Safe Integration Merge & Post-Merge Review
- Merge all task branches (`task/02`, `task/03`, `task/04`) into `main`, cleanly resolving any overlapping route or seam changes.
- Execute a final post-merge review pass across the entire integrated application covering all five review axes (Spec Compliance, Coding Standards, Accessibility & Design System, Mobile/Desktop Screenshots, Backend API Validation & Telemetry) to guarantee end-to-end coherence and zero regressions.

## Acceptance Criteria

### Spec Compliance & Functional Verification
- [ ] Implementing agents strictly adhere to `.agents/skills/implement/SKILL.md` and TDD workflows.
- [ ] 100% of acceptance checklist items in `.scratch/bronze-storefront/issues/02-browse-and-buy-predefined-products.md` are fulfilled and verified.
- [ ] 100% of acceptance checklist items in `.scratch/bronze-storefront/issues/03-browse-portfolio-and-commission-inquiry.md` are fulfilled and verified.
- [ ] 100% of acceptance checklist items in `.scratch/bronze-storefront/issues/04-admin-product-and-portfolio-crud.md` are fulfilled and verified.
- [ ] Reference codes strictly follow `ORD-XXXX` and `COM-XXXX` formats.
- [ ] Shipping logic applies accurately: free for order subtotal >= ₹2,500, flat ₹150 below ₹2,500.

### Test & Code Quality
- [ ] All unit, service, and repository tests pass cleanly via `pnpm test`.
- [ ] TypeScript typecheck passes with zero errors via `pnpm typecheck`.
- [ ] Production build passes cleanly via `pnpm build`.

### UI, Accessibility & Visual Verification
- [ ] Screenshots captured on mobile (375px/390px) and desktop (1280px) for `/shop`, `/shop/[slug]`, `/custom-work`, `/custom-work/[slug]`, `/custom-work/inquire`, `/admin`, `/admin/products`, and `/admin/portfolio`.
- [ ] Visual verification confirms no overlapping elements, clipped text, or obstructed controls on small and large screens.
- [ ] All interactive elements meet or exceed the 44x44px tap target standard.
- [ ] Visual design strictly adheres to Heritage design system styling, colors, and typography.

### Backend Validation & Observability
- [ ] All API routes and mutations validate incoming payloads and return appropriate errors/status codes for invalid data.
- [ ] Structured JSON domain event logs and error logs are emitted to stdout with correlation IDs for all state mutations.

### Git & Integration Integrity
- [ ] Tasks 02, 03, and 04 are merged into `main` without regressions or broken links.
- [ ] Post-merge review cycle across all five axes completes with zero open defects.
