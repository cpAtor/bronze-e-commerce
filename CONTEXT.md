# Bronze Craft & Temple Commissions Storefront

An e-commerce and commission platform for selling ready-made artisanal bronze lifestyle/ritual wares online and accepting custom bronze idol and temple accessory commissions.

## Language

### Catalog & Offerings

**Predefined Product**:
A standardized, ready-to-order bronze item (such as a mug, water bottle, water pot, or piece of jewellery) with a fixed price and SKU that can be purchased directly through online checkout.
_Avoid_: Predefined item, normal product, retail item, stock item

**Portfolio Piece**:
A showcase entry depicting a past or representative customizable bronze work (such as a temple deity idol, *Prabhavali* arch, ritual lamp, or bell) used to demonstrate craftsmanship and inspire custom requests rather than for direct cart checkout.
_Avoid_: Custom product, gallery item, sample item

### Purchasing & Fulfillment

**Order**:
A confirmed online purchase of one or more Predefined Products placed by a Customer through the checkout flow, tracked from `Ordered` to `Shipped` with a courier tracking link.
_Avoid_: Transaction, purchase, booking

**Order Status**:
One of two states in the fulfillment lifecycle of an Order: `Ordered` (confirmed, awaiting shipment) or `Shipped` (dispatched, with a courier tracking URL). Customers contact the Admin for updates via WhatsApp, Email, or Phone — not through in-platform messaging.
_Avoid_: Order milestone, order state machine, shipment flag

### Bespoke Temple & Custom Work

**Commission Inquiry**:
A structured request submitted by a Customer to commission a bespoke bronze idol or temple accessory, capturing item type, dimensions, iconography/style, finish, target timeline, and a phone number for callback. Follow-up happens entirely off-platform via WhatsApp, Email, or Phone.
_Avoid_: Custom order, quote ticket, bespoke cart item

### Operations & Continuity

**Store Snapshot**:
A versioned, self-contained archive of all Predefined Products, Portfolio Pieces, Orders, and Commission Inquiries that the Admin can export or restore in one click for disaster recovery or migration.
_Avoid_: Database dump, raw backup

### Roles

**Customer**:
A Google-authenticated individual who browses the storefront, purchases Predefined Products via an Order, submits Commission Inquiries for bespoke temple work, and views their Order history in a personal dashboard. May optionally provide a phone number for WhatsApp/SMS follow-up.
_Avoid_: User, client, shopper, buyer

**Admin**:
The business owner and master craftsperson who manages the Predefined Product catalog and Portfolio Pieces, marks Orders as Shipped with tracking links, and reviews incoming Commission Inquiries for callback. Authenticates via Google OAuth; distinguished by an `ADMIN_EMAILS` environment variable whitelist.
_Avoid_: Staff, vendor, seller, moderator
