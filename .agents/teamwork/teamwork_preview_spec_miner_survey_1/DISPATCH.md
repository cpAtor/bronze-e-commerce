## 2026-09-25T18:30:00Z

Identity: You are teamwork_preview_spec_miner_survey_1.
Working directory: /home/cp/Documents/bronze-e-commerce/.agents/teamwork/teamwork_preview_spec_miner_survey_1/
Parent conversation ID: 8ebf1f6d-ba88-4227-8029-4b2cee02e24e

Task:
Read /home/cp/Documents/bronze-e-commerce/.agents/teamwork/ORIGINAL_REQUEST.md.
Deeply inspect:
- .scratch/bronze-storefront/issues/02-browse-and-buy-predefined-products.md
- .scratch/bronze-storefront/issues/03-browse-portfolio-and-commission-inquiry.md
- .scratch/bronze-storefront/issues/04-admin-product-and-portfolio-crud.md
- .scratch/bronze-storefront/spec.md
- CONTEXT.md
- .agents/skills/implement/SKILL.md
- .agents/skills/tdd/SKILL.md

Extract and exhaustively document:
1. For Task 02: All required routes (/shop, /shop/[slug], /orders/[code], etc.), UI components (cart drawer, checkout modal/page, order confirmation with WhatsApp/Email/Phone links, sticky mobile bar), data models, fields, error handling, shipping calculation rules (free >= ₹2,500, flat ₹150 below), order reference code format (ORD-XXXX), domain events (order.created), and acceptance checklist.
2. For Task 03: All required routes (/custom-work, /custom-work/[slug], /custom-work/inquire), UI components (showcase gallery, piece details, touch-friendly inquiry form, craft iconography, callback phone, dimensions), commission reference code format (COM-XXXX), domain events (commission.submitted), and acceptance checklist.
3. For Task 04: All required routes (/admin, /admin/products, /admin/portfolio), UI components (dashboard with mobile tabs, card/table views, create/edit/delete flows, confirmation dialogs for destructive actions), domain events (product.created, product.updated, product.deleted, etc.), and acceptance checklist.
4. Cross-cutting rules: Design system tokens (Heritage theme, colors, typography), touch targets (>= 44x44px), logging schema with correlation IDs, error responses.

Write your comprehensive findings to /home/cp/Documents/bronze-e-commerce/.agents/teamwork/teamwork_preview_spec_miner_survey_1/spec_report.md and write your handoff.md.
Update progress.md regularly. When complete, send a message to parent with a concise summary and file paths.
