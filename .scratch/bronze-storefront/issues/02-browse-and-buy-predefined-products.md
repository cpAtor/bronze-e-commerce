# 02: Browse & buy Predefined Products

**What to build:** Customers can browse, inspect, and purchase Predefined Products through an end-to-end e-commerce flow that is fully responsive and mobile-optimized like the Shopify Heritage theme. On mobile and desktop, customers visit `/shop` to view a responsive grid of 6 artisanal bronze products (single/double column on mobile with crisp imagery, pricing in ₹ INR, and weight details). Clicking a product navigates to a mobile-friendly product detail page (`/shop/[slug]`) featuring responsive image viewing, alloy purity and care guides, and a sticky "Add to Cart" bar on mobile viewports. Customers can open a responsive cart drawer, adjust quantities, see automatic shipping calculation (₹0 above ₹2,500, flat ₹150 below), and complete checkout with shipping address and optional phone number. Submitting creates an Order with reference code `ORD-XXXX` and status `Ordered`. The confirmation page and customer order view show full details along with pre-filled WhatsApp, Email, and Phone contact links to reach the Admin. `logDomainEvent("order.created", ...)` emits structured JSON logs.

**Blocked by:** 01: Interfaces, schema, Heritage shell & deploy to Vercel

**Status:** ready-for-agent

- [ ] `CatalogService.browseProducts()` and `.getProduct(slug)` implemented and tested against `StoreRepository`
- [ ] Responsive `/shop` catalog page with Heritage typography, editorial layout, and responsive mobile grid (1-2 columns on mobile, 3-4 columns on desktop)
- [ ] Product detail page (`/shop/[slug]`) with responsive image presentation, alloy specs, dimensions, care instructions, and touch-friendly controls
- [ ] Mobile-optimized sticky "Add to Cart" action bar on small screens to prevent unnecessary scrolling
- [ ] Responsive cart drawer / modal supporting item increment, decrement, removal, subtotal, and shipping fee logic (free >= ₹2,500, flat ₹150)
- [ ] Mobile-first checkout form capturing shipping address, recipient name, email, and optional phone number
- [ ] `CatalogService.placeOrder()` generating `ORD-XXXX` with initial status `Ordered`
- [ ] Order confirmation view with order summary, order code, and 1-click pre-filled WhatsApp, Email, and Phone links
- [ ] Customer order status view (`/orders/[code]`) showing `Ordered` status and courier placeholder
- [ ] Structured JSON logging emitted on `order.created`
- [ ] Verified responsive usability and tap target sizes (>= 44px) on mobile viewports (375px/390px) and desktop
- [ ] Service-level unit tests for product browsing, cart calculation, and order creation passing
