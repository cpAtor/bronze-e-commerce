## 2026-09-26T00:05:43Z

Scope & Task (Milestone 0 - Baseline Seams Setup):
You are preparing the baseline on `main` before parallel workstreams branch off.
1. Update `src/domain/types.ts`:
   - Add `CartItem` interface (`product: PredefinedProduct; quantity: number;`).
   - Move or define input DTOs (`CreateOrderInput`, `SubmitCommissionInquiryInput`, `CreateProductInput`, `UpdateProductInput`, `CreatePortfolioPieceInput`, `UpdatePortfolioPieceInput`) in `src/domain/types.ts`.
   - Ensure `customerId` is optional in `CreateOrderInput` and `SubmitCommissionInquiryInput` (with customerName, customerEmail, customerPhone fields for guest checkout/inquiry).
2. Update `src/components/Navigation.tsx`:
   - Change navLinks hrefs to `/shop`, `/custom-work`, `/orders`, `/admin` with appropriate labels ('Bestsellers & Wares', 'Sanctum Commissions', 'Track Order', 'Admin Portal').
3. Create `src/repositories/index.ts`:
   - Export `storeRepository` and `getStoreRepository(): StoreRepository` using global singleton pattern for development/fast-refresh persistence.
4. Create `src/services/`:
   - `src/services/product-catalog.service.ts`: class `ProductCatalogService` stub with method signatures from PROJECT.md.
   - `src/services/portfolio-catalog.service.ts`: class `PortfolioCatalogService` stub with method signatures from PROJECT.md.
   - `src/services/admin.service.ts`: class `DefaultAdminService` stub with method signatures from PROJECT.md.
   - `src/services/catalog.service.ts`: class `DefaultCatalogService` composite facade implementing `CatalogService`.
   - `src/services/index.ts`: re-exports.
5. Create `scripts/capture-screenshots.sh` (as detailed in seams_report.md) and `chmod +x scripts/capture-screenshots.sh`.
6. Run verification commands:
   - `pnpm typecheck`
   - `pnpm test`
   - `pnpm build`
   Ensure all succeed with exit code 0.
7. Commit cleanly to `main`:
   - `git add .`
   - `git commit -m "chore(arch): establish seams, singleton repo, modular services, and screenshot tooling"`
8. Create the 3 task branches from `main`:
   - `git branch task/02-browse-buy main`
   - `git branch task/03-portfolio-commission main`
   - `git branch task/04-admin-crud main`
   Ensure git branch list shows all 3 branches created. Stay on `main`.

Write your report to /home/cp/Documents/bronze-e-commerce/.agents/teamwork/teamwork_preview_worker_m0/baseline_report.md and write handoff.md.
When complete, notify parent via send_message.
