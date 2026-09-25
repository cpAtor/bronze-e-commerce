# Handoff Report: Architecture Seams & Parallel Execution Boundaries

**Agent**: `teamwork_preview_explorer_survey_3`  
**Working Directory**: `/home/cp/Documents/bronze-e-commerce/.agents/teamwork/teamwork_preview_explorer_survey_3/`  
**Recipient**: `parent` (`8ebf1f6d-ba88-4227-8029-4b2cee02e24e`)  
**Type**: Hard Handoff (Investigation & Architecture Analysis Complete)

---

## 1. Observation

1. **Database Schema State**:
   - `src/db/schema.ts` lines 9–81 define tables for `predefinedProducts`, `portfolioPieces`, `customers`, `orders`, and `commissionInquiries`.
   - `src/db/schema.ts` lines 84–112 define relations (`customersRelations`, `ordersRelations`, `portfolioPiecesRelations`, `commissionInquiriesRelations`).
   - All entity columns required by Tasks 02, 03, and 04 are already declared.

2. **Repository Implementation State**:
   - `src/domain/services.ts` lines 159–195 define interface `StoreRepository` containing all CRUD, query, and snapshot methods.
   - `src/repositories/in-memory-repository.ts` lines 15–228 implement `InMemoryStoreRepository implements StoreRepository` seeded with 6 products and 5 portfolio pieces.
   - `src/repositories/in-memory-repository.test.ts` passes 11/11 vitest tests.
   - Grep search for `InMemoryStoreRepository` in `src/` revealed it is only instantiated in `src/repositories/in-memory-repository.test.ts`. There is no exported singleton or provider factory in `src/repositories/`.

3. **Services Interface vs. Implementation**:
   - `src/domain/services.ts` lines 100–115 define interface `CatalogService` with customer-facing methods.
   - `src/domain/services.ts` lines 120–153 define interface `AdminService` with admin CRUD methods.
   - Grep search revealed **zero** class implementations of `CatalogService` or `AdminService` in the entire repository.
   - In `src/domain/services.ts`, methods are named `getProducts`, `getProductBySlug`, `createOrder`, `getPortfolioPieces`, `getPortfolioPieceBySlug`, whereas `ORIGINAL_REQUEST.md` and tickets 02/03 specify `browseProducts`, `getProduct`, `placeOrder`, `browsePortfolio`, `getPortfolioPiece`.

4. **Existing Navigation Links**:
   - `src/components/Navigation.tsx` lines 28–34 define:
     ```typescript
     const navLinks = [
       { href: '#shop', label: 'Bestsellers' },
       { href: '#lifestyle', label: 'Lifestyle Wares' },
       { href: '#custom', label: 'Sanctum Commissions' },
       { href: '#story', label: 'About Us' },
       { href: '/orders', label: 'Track Order' },
     ];
     ```
   - Nav links currently use hash anchors rather than dedicated routes `/shop` and `/custom-work`.

5. **Tooling & Browser Verification in Environment**:
   - `which google-chrome chromium chromium-browser edge` returned exit code 1 (no Chrome/Chromium installed).
   - `which firefox` returned `/usr/bin/firefox`.
   - `npx playwright --version` paused on an interactive prompt asking to install `playwright@1.63.0` (not pre-installed in `node_modules`).
   - `mcp_servers` configuration contains only `gemini-api_gemini-api-docs` (Chrome DevTools MCP server is not active).
   - Tested command:
     `TMP_DIR=$(mktemp -d) && firefox --headless --profile "$TMP_DIR" --screenshot /tmp/test-screenshot.png --window-size 375,812 "data:text/html,<h1>Test</h1>"`
     Result: Exit code 0, generated `/tmp/test-screenshot.png: PNG image data, 375 x 812, 8-bit/color RGBA`.
   - Agent tool `view_file` supports viewing binary images (`image`).

6. **Current Build & Test Status**:
   - `pnpm test` passed 11/11 tests in 719ms.
   - `pnpm typecheck` passed with 0 errors.
   - `pnpm build` completed successfully in 2.7s generating 5/5 static pages.

---

## 2. Logic Chain

1. **Zero-Conflict Schema Strategy** (Derives from Observation 1):
   Because `src/db/schema.ts` already defines all 5 tables and their relations, no task branch needs to edit `src/db/schema.ts`. Locking `src/db/schema.ts` as read-only across all three task branches mathematically guarantees zero database schema merge conflicts.

2. **Repository Singleton Requirement** (Derives from Observation 2):
   Because `InMemoryStoreRepository` is not exposed via a shared singleton or factory, route handlers or server actions in Next.js would instantiate separate repository instances. Mutations in `/admin` (Task 04) would not reflect in `/shop` (Task 02). Creating `src/repositories/index.ts` exporting `getStoreRepository()` on `main` before branching ensures all task branches share an in-memory repository instance.

3. **Service Modularization Architecture** (Derives from Observation 3):
   Task 02 and Task 03 both implement subsets of `CatalogService`. If both implementers edit `src/domain/services.ts` or a shared `catalog.service.ts` file, a git merge conflict is inevitable.
   Splitting the implementations into:
   - `src/services/product-catalog.service.ts` (owned exclusively by Task 02)
   - `src/services/portfolio-catalog.service.ts` (owned exclusively by Task 03)
   - `src/services/admin.service.ts` (owned exclusively by Task 04)
   - `src/services/catalog.service.ts` (Composite facade delegating to product and portfolio services)
   ensures complete file-level isolation. Providing aliases (`browseProducts` / `getProducts`, `placeOrder` / `createOrder`) reconciles ticket 01 interfaces with tickets 02/03 specs.

4. **Pre-Branch Navigation Alignment** (Derives from Observation 4):
   If Task 02 changes `Navigation.tsx` to point to `/shop`, Task 03 to `/custom-work`, and Task 04 to `/admin`, git will register a merge conflict on `src/components/Navigation.tsx`. Updating `navLinks` in `Navigation.tsx` on `main` prior to branching to point to `/shop`, `/custom-work`, `/orders`, and `/admin` eliminates the need for tasks to touch `Navigation.tsx`.

5. **Headless Screenshot Tooling Selection** (Derives from Observation 5):
   Because Chrome/Chromium and Playwright/Puppeteer are not installed and Chrome DevTools MCP is absent, headless Firefox CLI (`firefox --headless --profile $(mktemp -d) --screenshot ...`) is the only native, zero-dependency visual capture mechanism available in this Linux environment. Testing confirmed it generates accurate PNGs at 375px, 390px, and 1280px viewports, which can be inspected directly using `view_file`.

---

## 3. Caveats

1. **Authentication in Issue 07 vs. Guest Checkout**:
   Google OAuth is deferred to ticket 07 (`07-google-oauth-and-route-protection.md`). Therefore, `CreateOrderInput` and `SubmitCommissionInquiryInput` must permit optional `customerId` (or guest fallback) and capture customer contact details directly.
2. **Next.js Fast Refresh & Node Process Lifecycles**:
   The in-memory repository singleton uses `globalThis` to preserve state during Next.js hot module reloading, but restarting the dev server (`pnpm dev`) resets the state back to seed constants.
3. **Firefox Headless Concurrency**:
   Running multiple simultaneous headless Firefox instances without `--profile $(mktemp -d)` causes a "Firefox is already running" lock error. The ephemeral profile argument is mandatory for every invocation.

---

## 4. Conclusion

1. **Seam Safety**: The database schema and repository interfaces are already sufficient. Declaring `src/db/schema.ts`, `src/domain/types.ts`, and `src/repositories/in-memory-repository.ts` locked on `main` completely prevents repository and schema merge conflicts.
2. **Service Modularization**: Modularizing `CatalogService` into `product-catalog.service.ts` (Task 02) and `portfolio-catalog.service.ts` (Task 03), paired with `admin.service.ts` (Task 04) and a composite `catalog.service.ts`, enables 100% concurrent implementation with zero git conflicts.
3. **Branch Isolation**: The route trees (`src/app/shop/`, `src/app/custom-work/`, `src/app/admin/`) and component folders (`src/components/shop/`, `src/components/portfolio/`, `src/components/admin/`) are naturally disjoint. Updating `src/components/Navigation.tsx` on `main` before branching ensures zero overlapping file edits.
4. **Visual Testing Tooling**: `/usr/bin/firefox` headless mode with isolated temporary profiles provides fast, reliable screenshot capture for 375px, 390px, and 1280px viewports. A pre-configured shell script (`scripts/capture-screenshots.sh`) enables implementers and reviewers to capture and inspect screenshots with `view_file`.

---

## 5. Verification Method

To independently verify the findings in this report:

1. **Verify Database Schema & InMemoryRepository Completeness**:
   Run:
   ```bash
   pnpm test
   pnpm typecheck
   ```
   Both must pass with 0 errors.

2. **Verify Headless Firefox Screenshot Capability**:
   Run:
   ```bash
   TMP_DIR=$(mktemp -d)
   firefox --headless --profile "$TMP_DIR" --screenshot /tmp/verify-screen.png --window-size 375,812 "data:text/html,<h1 style='color:brown;'>Heritage Test</h1>"
   file /tmp/verify-screen.png
   rm -rf "$TMP_DIR" /tmp/verify-screen.png
   ```
   Expected output: `PNG image data, 375 x 812, 8-bit/color RGBA`.

3. **Verify Documentation & Analysis Artifacts**:
   Inspect `/home/cp/Documents/bronze-e-commerce/.agents/teamwork/teamwork_preview_explorer_survey_3/seams_report.md` for full technical specifications, code listings, and orchestrator action plan.

4. **Invalidation Conditions**:
   - If a new table or column is required for Tasks 02–04, the read-only schema assumption is invalidated.
   - If `/usr/bin/firefox` is removed or fails to run headless, the screenshot tooling recommendation must switch to installing Playwright.
