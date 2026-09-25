# 08: CI/CD pipeline & nightly backup cron

**What to build:** Formalize the delivery and operational pipeline with automated quality gates and scheduled disaster recovery backups. A GitHub Actions workflow runs on every pull request and push to `main`: it executes linting, TypeScript type-checking, and all service-level unit/integration tests against the in-memory repository before allowing merges. Pull requests generate preview deployments on Vercel for visual verification on mobile and desktop devices. A scheduled GitHub Actions cron job runs nightly: it invokes the store snapshot export endpoint and uploads an encrypted/versioned backup archive to free cloud object storage (Cloudflare R2 or Backblaze B2) to ensure continuous offsite protection at ₹0/month. The entire storefront and admin suite is smoke-tested on live production URLs across mobile and desktop viewports.

**Blocked by:** 07: Google OAuth & route protection

**Status:** ready-for-agent

- [ ] GitHub Actions CI workflow (`.github/workflows/ci.yml`) running on PRs and `main`: lint, type-check, and automated tests
- [ ] Automated Vercel preview deployments enabled for pull requests with test gates
- [ ] Scheduled nightly backup cron workflow (`.github/workflows/backup.yml`) configured to export store snapshot
- [ ] Backup upload integration to free object storage bucket (Cloudflare R2 / Backblaze B2 free tier) with date-tagged keys
- [ ] Verification of mobile responsiveness and touch interactions on the live production URL across standard device sizes (iPhone 390px, Android 360px/412px, iPad 768px, Desktop 1280px+)
- [ ] End-to-end smoke test of all flows on live deployment: browse product, add to cart, submit order, view callback links, admin edit, snapshot export
