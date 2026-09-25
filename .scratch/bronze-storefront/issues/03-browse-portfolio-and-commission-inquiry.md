# 03: Browse Portfolio & request callback/contact for custom work

**What to build:** Temple representatives and devotees can explore custom bronze temple works and submit bespoke commission inquiries through a responsive, mobile-optimized experience matching the Heritage aesthetic. On mobile and desktop, users navigate to `/custom-work` to browse a curated portfolio of 5 showcase pieces (Chola-style Nataraja Murti, Prabhavali archway, Deepastambha lamp, temple bell & kalasham, deity kavacham). Clicking a showcase piece opens a mobile-friendly detail page (`/custom-work/[slug]`) highlighting reference dimensions, casting technique (lost-wax *Madhuchista Vidhana*), finish options, and typical lead times, with a prominent "Request Custom Quote" CTA. The commission form (`/custom-work/inquire`) is touch-friendly and straightforward on mobile: it captures item type, deity/iconography notes, target dimensions, finish preference, target installation date, and mandatory phone number for callback (with optional pre-fill if launched from a specific Portfolio Piece). Submitting creates a Commission Inquiry with code `COM-XXXX`. The confirmation screen displays the code alongside 1-click pre-filled WhatsApp, Email, and Phone callback buttons. Structured logs for `commission.submitted` are emitted to stdout.

**Blocked by:** 01: Interfaces, schema, Heritage shell & deploy to Vercel

**Status:** ready-for-agent

- [ ] `CatalogService.browsePortfolio()` and `.getPortfolioPiece(slug)` implemented and tested against `StoreRepository`
- [ ] Responsive `/custom-work` portfolio gallery page with Heritage styling (adaptive 1-column mobile, 2-3 column desktop grid)
- [ ] Portfolio Piece detail page (`/custom-work/[slug]`) with high-resolution imagery, craft notes, casting specs, and mobile-friendly CTA
- [ ] Touch-friendly Commission Inquiry form (`/custom-work/inquire`) capturing phone number for callback, dimensions, deity iconography, finish, and optional portfolio reference
- [ ] Form validation and error states designed for small mobile keyboards and touch interaction
- [ ] `CatalogService.submitCommissionInquiry()` generating `COM-XXXX` reference code
- [ ] Inquiry confirmation view showing `COM-XXXX` and instant 1-click pre-filled WhatsApp, Email, and Phone contact links
- [ ] Structured JSON logging emitted on `commission.submitted`
- [ ] Verified responsive layout and touch targets (>= 44px) across mobile viewports (375px/390px) and desktop
- [ ] Service-level unit tests for portfolio browsing and commission inquiry creation passing
