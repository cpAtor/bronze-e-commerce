# 05: Admin: mark Orders shipped & view Commission Inquiries for callback

**What to build:** The store owner can manage order fulfillment and view incoming custom temple commission inquiries through a mobile-optimized admin interface. In `/admin/orders`, the Admin sees a responsive list of customer orders with Order ID, customer name, date, total, and current status (`Ordered` vs `Shipped`). Opening an order on mobile or desktop allows the Admin to inspect item details and shipping address, and mark the order as `Shipped` by entering a courier tracking URL. The status change updates the customer's order view immediately, rendering a clickable tracking button. In `/admin/commissions`, the Admin views incoming Commission Inquiries with reference codes (`COM-XXXX`), customer name, item type, and phone number, with 1-tap "Call Customer" (`tel:`) and "Open WhatsApp" (`wa.me`) buttons to initiate off-platform discussion effortlessly from a phone. Structured JSON logging is emitted for `order.shipped`.

**Blocked by:** 02: Browse & buy Predefined Products, 03: Browse Portfolio & request callback/contact for custom work, 04: Admin Product & Portfolio CRUD

**Status:** ready-for-agent

- [ ] `AdminService.getAllOrders()` and `.markOrderShipped(orderId, courierTrackingUrl)` implemented and tested
- [ ] `AdminService.getAllCommissionInquiries()` and `.getCommissionInquiryDetail(id)` implemented and tested
- [ ] Responsive Admin Orders view (`/admin/orders`) with status badges (`Ordered`, `Shipped`) and mobile-friendly card list
- [ ] Order fulfillment modal / form allowing Admin to input courier platform tracking link (e.g., India Post, Shiprocket, DTDC)
- [ ] Storefront verification: Customer viewing `/orders/[code]` sees status switch to `Shipped` with a direct "Track Package" link
- [ ] Responsive Admin Commissions view (`/admin/commissions`) listing incoming custom requests with phone numbers and specs
- [ ] 1-tap mobile callback actions (`tel:<phone>` and `https://wa.me/<phone>`) for Admin to contact customers directly from mobile browser
- [ ] Structured JSON logging emitted on `order.shipped`
- [ ] Verified responsive layout and tap ergonomics on mobile screens (375px/390px) and desktop
- [ ] Unit tests for order status updates and commission inquiry retrieval passing
