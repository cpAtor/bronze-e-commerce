/**
 * Drizzle ORM SQLite schemas for Bronze Craft & Temple Commissions Storefront.
 * Aligns with CONTEXT.md and spec.md entities.
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const predefinedProducts = sqliteTable('predefined_products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  pricePaise: integer('price_paise').notNull(),
  weight: text('weight').notNull(),
  dimensions: text('dimensions').notNull(),
  alloyDescription: text('alloy_description').notNull(),
  careGuide: text('care_guide').notNull(),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  images: text('images').notNull(), // JSON string array of URLs
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const portfolioPieces = sqliteTable('portfolio_pieces', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  referenceDimensions: text('reference_dimensions').notNull(),
  castingTechnique: text('casting_technique').notNull(),
  finishOptions: text('finish_options').notNull(), // JSON string array
  typicalLeadTime: text('typical_lead_time').notNull(),
  images: text('images').notNull(), // JSON string array of URLs
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  googleId: text('google_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  phoneNumber: text('phone_number'),
  createdAt: integer('created_at').notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  orderCode: text('order_code').notNull().unique(), // e.g. ORD-1001
  customerId: text('customer_id')
    .notNull()
    .references(() => customers.id),
  items: text('items').notNull(), // JSON string array of OrderItem
  shippingAddress: text('shipping_address').notNull(), // JSON string
  shippingCostPaise: integer('shipping_cost_paise').notNull(),
  totalPaise: integer('total_paise').notNull(),
  status: text('status', { enum: ['Ordered', 'Shipped'] }).notNull().default('Ordered'),
  courierTrackingUrl: text('courier_tracking_url'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const commissionInquiries = sqliteTable('commission_inquiries', {
  id: text('id').primaryKey(),
  commissionCode: text('commission_code').notNull().unique(), // e.g. COM-1001
  customerId: text('customer_id')
    .notNull()
    .references(() => customers.id),
  itemType: text('item_type').notNull(),
  deityIconography: text('deity_iconography').notNull(),
  dimensions: text('dimensions').notNull(),
  finishPreference: text('finish_preference').notNull(),
  targetDate: text('target_date').notNull(),
  phoneNumber: text('phone_number').notNull(),
  inspiredByPortfolioId: text('inspired_by_portfolio_id').references(
    () => portfolioPieces.id
  ),
  createdAt: integer('created_at').notNull(),
});
