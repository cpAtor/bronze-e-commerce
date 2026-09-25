# Lean Observability Stack Over Custom-Built Monitoring UI

We chose structured JSON event logging, a `/api/health` endpoint, free-tier external services (Sentry for errors, UptimeRobot for uptime, Plausible/GA for analytics), and nightly automated SQLite backups to free cloud storage (Cloudflare R2 or Backblaze B2) rather than building a custom telemetry dashboard, metrics exporter, or snapshot engine inside the application. The Admin dashboard focuses exclusively on business operations (Orders, Inquiries, Commissions, Catalog) rather than system monitoring. This achieves full observability and disaster recovery at \$0/month without maintaining custom monitoring infrastructure.

## Considered Options

- **Built-in custom observability dashboard with P50/P95 metrics, funnel analytics, and SHA-256 snapshot engine**: Rejected because it amounts to building a mini-Datadog inside a small artisan e-commerce site — significant development and maintenance cost for capabilities that free external tools already provide better.
- **Paid SaaS stack (Datadog + managed backups)**: Rejected because it introduces monthly subscription costs contrary to the \$0/month operational goal.
