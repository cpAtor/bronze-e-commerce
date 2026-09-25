# 04: Admin Product & Portfolio CRUD

**What to build:** The store owner can manage the complete Predefined Product catalog and custom Portfolio Pieces from a dedicated `/admin` dashboard that is fully responsive and usable from a mobile smartphone or desktop workstation. On mobile devices, the dashboard features touch-friendly tab navigation and adaptive card/table views so the Admin can update items on the go. The Admin can view all Predefined Products, add new products, edit pricing/descriptions/weights/images, and delete discontinued items, with changes reflecting immediately on the `/shop` storefront. Similarly, the Admin can view, create, edit, and delete Portfolio Pieces, updating showcase imagery, dimensions, casting notes, and lead times. Forms are optimized for mobile inputs with clear validation. All actions invoke `AdminService` CRUD methods and emit structured JSON logs (`product.created`, `product.updated`, `product.deleted`, etc.).

**Blocked by:** 01: Interfaces, schema, Heritage shell & deploy to Vercel

**Status:** ready-for-human

- [x] `AdminService` CRUD methods for `PredefinedProduct` and `PortfolioPiece` implemented and tested against `StoreRepository`
- [x] Responsive `/admin` dashboard layout with mobile-first navigation bar and touch-friendly tabs
- [x] Predefined Products management view (`/admin/products`): responsive card/table list showing thumbnail, name, price, stock, and quick edit/delete actions
- [x] Product creation and edit forms with mobile-friendly form controls (number inputs, textarea, image URL lists)
- [x] Portfolio Pieces management view (`/admin/portfolio`): responsive list with preview image, category, and edit/delete actions
- [x] Portfolio creation and edit forms with structured fields for casting technique, dimensions, and finish options
- [x] Deletion confirmation modals with safe touch targets to prevent accidental taps on mobile
- [x] Storefront verification: creating/editing a product or portfolio piece updates `/shop` and `/custom-work` immediately
- [x] Structured JSON logging emitted for all product and portfolio mutations
- [x] Mobile usability verified on small screen viewports (375px/390px) and desktop
- [x] Unit tests for all Admin CRUD operations passing
