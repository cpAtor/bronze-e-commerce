# 06: Store Snapshot disaster recovery & health check

**What to build:** The store owner has disaster recovery and continuity controls directly within the `/admin` interface, operable from both mobile and desktop browsers. An Admin can navigate to `/admin/system` to download a versioned, portable `Store Snapshot` (a JSON file capturing all Predefined Products, Portfolio Pieces, Orders, and Commission Inquiries). In the event of data loss or environment migration, the Admin can upload a valid snapshot file through a mobile-friendly file picker; a confirmation modal displays summary counts (e.g., "Will restore: 6 products, 5 portfolio pieces, 14 orders") before performing an atomic restore. If a product is deleted and the snapshot is restored, the deleted product reappears immediately on `/shop`. The `/api/health` endpoint is upgraded to verify active database connectivity (`{ "status": "ok", "db": "connected" }`). Domain events `snapshot.exported` and `snapshot.restored` are logged as structured JSON.

**Blocked by:** 05: Admin: mark Orders shipped & view Commission Inquiries for callback

**Status:** ready-for-agent

- [ ] `AdminService.exportStoreSnapshot()` serializing all products, portfolio pieces, orders, and inquiries to versioned JSON
- [ ] `AdminService.restoreStoreSnapshot(snapshotData)` validating schema and atomically restoring all data
- [ ] Responsive Disaster Recovery panel in `/admin/system` with mobile-friendly buttons and clear status indicators
- [ ] 1-click snapshot download triggering a client-side file download (`store-snapshot-YYYY-MM-DD.json`)
- [ ] Snapshot file upload form with schema validation and confirmation dialog showing entity counts before restore
- [ ] End-to-end recovery test: delete a product, restore snapshot, verify product is restored to storefront
- [ ] Enhanced `/api/health` endpoint verifying database connection and returning HTTP 200/503 accordingly
- [ ] Structured JSON logging emitted on `snapshot.exported` and `snapshot.restored`
- [ ] Unit tests for snapshot export/restore round-trip passing
