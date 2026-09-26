import { eq } from 'drizzle-orm';
import { getDb, ensureDatabaseReady } from '@/db';
import {
  predefinedProducts,
  portfolioPieces,
  orders,
  commissionInquiries,
  customers,
} from '@/db/schema';
import type { StoreRepository } from '@/domain/services';
import type {
  PredefinedProduct,
  PortfolioPiece,
  Order,
  CommissionInquiry,
  Customer,
  StoreSnapshot,
  OrderItem,
  ShippingAddress,
  OrderStatus,
} from '@/domain/types';

export class DrizzleStoreRepository implements StoreRepository {
  private async ready(): Promise<ReturnType<typeof getDb>> {
    await ensureDatabaseReady();
    return getDb();
  }

  // ── Predefined Products ───────────────────────────────────────────────
  async findProductById(id: string): Promise<PredefinedProduct | null> {
    const db = await this.ready();
    const rows = await db
      .select()
      .from(predefinedProducts)
      .where(eq(predefinedProducts.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    return this.mapProductRow(rows[0]);
  }

  async findProductBySlug(slug: string): Promise<PredefinedProduct | null> {
    const db = await this.ready();
    const rows = await db
      .select()
      .from(predefinedProducts)
      .where(eq(predefinedProducts.slug, slug))
      .limit(1);

    if (rows.length === 0) return null;
    return this.mapProductRow(rows[0]);
  }

  async listProducts(): Promise<PredefinedProduct[]> {
    const db = await this.ready();
    const rows = await db.select().from(predefinedProducts);
    return rows.map((r) => this.mapProductRow(r));
  }

  async saveProduct(product: PredefinedProduct): Promise<void> {
    const db = await this.ready();
    await db
      .insert(predefinedProducts)
      .values({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        pricePaise: product.pricePaise,
        weight: product.weight,
        dimensions: product.dimensions,
        alloyDescription: product.alloyDescription,
        careGuide: product.careGuide,
        stockQuantity: product.stockQuantity,
        images: JSON.stringify(product.images),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })
      .onConflictDoUpdate({
        target: predefinedProducts.id,
        set: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          pricePaise: product.pricePaise,
          weight: product.weight,
          dimensions: product.dimensions,
          alloyDescription: product.alloyDescription,
          careGuide: product.careGuide,
          stockQuantity: product.stockQuantity,
          images: JSON.stringify(product.images),
          updatedAt: product.updatedAt,
        },
      });
  }

  async deleteProduct(id: string): Promise<void> {
    const db = await this.ready();
    await db.delete(predefinedProducts).where(eq(predefinedProducts.id, id));
  }

  // ── Portfolio Pieces ──────────────────────────────────────────────────
  async findPortfolioPieceById(id: string): Promise<PortfolioPiece | null> {
    const db = await this.ready();
    const rows = await db
      .select()
      .from(portfolioPieces)
      .where(eq(portfolioPieces.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    return this.mapPortfolioRow(rows[0]);
  }

  async findPortfolioPieceBySlug(slug: string): Promise<PortfolioPiece | null> {
    const db = await this.ready();
    const rows = await db
      .select()
      .from(portfolioPieces)
      .where(eq(portfolioPieces.slug, slug))
      .limit(1);

    if (rows.length === 0) return null;
    return this.mapPortfolioRow(rows[0]);
  }

  async listPortfolioPieces(): Promise<PortfolioPiece[]> {
    const db = await this.ready();
    const rows = await db.select().from(portfolioPieces);
    return rows.map((r) => this.mapPortfolioRow(r));
  }

  async savePortfolioPiece(piece: PortfolioPiece): Promise<void> {
    const db = await this.ready();
    await db
      .insert(portfolioPieces)
      .values({
        id: piece.id,
        name: piece.name,
        slug: piece.slug,
        description: piece.description,
        referenceDimensions: piece.referenceDimensions,
        castingTechnique: piece.castingTechnique,
        finishOptions: JSON.stringify(piece.finishOptions),
        typicalLeadTime: piece.typicalLeadTime,
        images: JSON.stringify(piece.images),
        createdAt: piece.createdAt,
        updatedAt: piece.updatedAt,
      })
      .onConflictDoUpdate({
        target: portfolioPieces.id,
        set: {
          name: piece.name,
          slug: piece.slug,
          description: piece.description,
          referenceDimensions: piece.referenceDimensions,
          castingTechnique: piece.castingTechnique,
          finishOptions: JSON.stringify(piece.finishOptions),
          typicalLeadTime: piece.typicalLeadTime,
          images: JSON.stringify(piece.images),
          updatedAt: piece.updatedAt,
        },
      });
  }

  async deletePortfolioPiece(id: string): Promise<void> {
    const db = await this.ready();
    await db.delete(portfolioPieces).where(eq(portfolioPieces.id, id));
  }

  // ── Orders ────────────────────────────────────────────────────────────
  async findOrderById(id: string): Promise<Order | null> {
    const db = await this.ready();
    const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (rows.length === 0) return null;
    return this.mapOrderRow(rows[0]);
  }

  async findOrderByCode(orderCode: string): Promise<Order | null> {
    const db = await this.ready();
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.orderCode, orderCode))
      .limit(1);
    if (rows.length === 0) return null;
    return this.mapOrderRow(rows[0]);
  }

  async listOrdersByCustomerId(customerId: string): Promise<Order[]> {
    const db = await this.ready();
    const rows = await db
      .select()
      .from(orders)
      .where(eq(orders.customerId, customerId));
    return rows.map((r) => this.mapOrderRow(r));
  }

  async listAllOrders(): Promise<Order[]> {
    const db = await this.ready();
    const rows = await db.select().from(orders);
    return rows.map((r) => this.mapOrderRow(r));
  }

  async saveOrder(order: Order): Promise<void> {
    const db = await this.ready();

    // Ensure customer exists before inserting order (foreign key constraint)
    const existingCustomer = await this.findCustomerById(order.customerId);
    if (!existingCustomer) {
      await this.saveCustomer({
        id: order.customerId,
        googleId: order.customerId,
        email: `${order.customerId}@guest.local`,
        name: order.shippingAddress.fullName || 'Guest Customer',
        phoneNumber: order.shippingAddress.phone ?? null,
        createdAt: order.createdAt,
      });
    }

    await db
      .insert(orders)
      .values({
        id: order.id,
        orderCode: order.orderCode,
        customerId: order.customerId,
        items: JSON.stringify(order.items),
        shippingAddress: JSON.stringify(order.shippingAddress),
        shippingCostPaise: order.shippingCostPaise,
        totalPaise: order.totalPaise,
        status: order.status,
        courierTrackingUrl: order.courierTrackingUrl ?? null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })
      .onConflictDoUpdate({
        target: orders.id,
        set: {
          status: order.status,
          courierTrackingUrl: order.courierTrackingUrl ?? null,
          updatedAt: order.updatedAt,
        },
      });
  }

  // ── Commission Inquiries ──────────────────────────────────────────────
  async findCommissionInquiryById(id: string): Promise<CommissionInquiry | null> {
    const db = await this.ready();
    const rows = await db
      .select()
      .from(commissionInquiries)
      .where(eq(commissionInquiries.id, id))
      .limit(1);
    if (rows.length === 0) return null;
    return this.mapCommissionRow(rows[0]);
  }

  async findCommissionInquiryByCode(
    commissionCode: string
  ): Promise<CommissionInquiry | null> {
    const db = await this.ready();
    const rows = await db
      .select()
      .from(commissionInquiries)
      .where(eq(commissionInquiries.commissionCode, commissionCode))
      .limit(1);
    if (rows.length === 0) return null;
    return this.mapCommissionRow(rows[0]);
  }

  async listCommissionInquiries(): Promise<CommissionInquiry[]> {
    const db = await this.ready();
    const rows = await db.select().from(commissionInquiries);
    return rows.map((r) => this.mapCommissionRow(r));
  }

  async saveCommissionInquiry(inquiry: CommissionInquiry): Promise<void> {
    const db = await this.ready();

    // Ensure customer exists before inserting commission inquiry (foreign key constraint)
    const existingCustomer = await this.findCustomerById(inquiry.customerId);
    if (!existingCustomer) {
      await this.saveCustomer({
        id: inquiry.customerId,
        googleId: inquiry.customerId,
        email: `${inquiry.customerId}@guest.local`,
        name: 'Patron',
        phoneNumber: inquiry.phoneNumber,
        createdAt: inquiry.createdAt,
      });
    }

    await db
      .insert(commissionInquiries)
      .values({
        id: inquiry.id,
        commissionCode: inquiry.commissionCode,
        customerId: inquiry.customerId,
        itemType: inquiry.itemType,
        deityIconography: inquiry.deityIconography,
        dimensions: inquiry.dimensions,
        finishPreference: inquiry.finishPreference,
        targetDate: inquiry.targetDate,
        phoneNumber: inquiry.phoneNumber,
        inspiredByPortfolioId: inquiry.inspiredByPortfolioId ?? null,
        createdAt: inquiry.createdAt,
      })
      .onConflictDoUpdate({
        target: commissionInquiries.id,
        set: {
          itemType: inquiry.itemType,
          deityIconography: inquiry.deityIconography,
          dimensions: inquiry.dimensions,
          finishPreference: inquiry.finishPreference,
          targetDate: inquiry.targetDate,
          phoneNumber: inquiry.phoneNumber,
          inspiredByPortfolioId: inquiry.inspiredByPortfolioId ?? null,
        },
      });
  }

  // ── Customers ─────────────────────────────────────────────────────────
  async findCustomerById(id: string): Promise<Customer | null> {
    const db = await this.ready();
    const rows = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id))
      .limit(1);
    if (rows.length === 0) return null;
    return this.mapCustomerRow(rows[0]);
  }

  async findCustomerByGoogleId(googleId: string): Promise<Customer | null> {
    const db = await this.ready();
    const rows = await db
      .select()
      .from(customers)
      .where(eq(customers.googleId, googleId))
      .limit(1);
    if (rows.length === 0) return null;
    return this.mapCustomerRow(rows[0]);
  }

  async saveCustomer(customer: Customer): Promise<void> {
    const db = await this.ready();
    await db
      .insert(customers)
      .values({
        id: customer.id,
        googleId: customer.googleId,
        email: customer.email,
        name: customer.name,
        avatarUrl: customer.avatarUrl ?? null,
        phoneNumber: customer.phoneNumber ?? null,
        createdAt: customer.createdAt,
      })
      .onConflictDoUpdate({
        target: customers.id,
        set: {
          email: customer.email,
          name: customer.name,
          avatarUrl: customer.avatarUrl ?? null,
          phoneNumber: customer.phoneNumber ?? null,
        },
      });
  }

  // ── Snapshot Export / Restore ─────────────────────────────────────────
  async getSnapshotData(): Promise<StoreSnapshot> {
    const [productsList, piecesList, ordersList, inquiriesList, customersList] =
      await Promise.all([
        this.listProducts(),
        this.listPortfolioPieces(),
        this.listAllOrders(),
        this.listCommissionInquiries(),
        this.listAllCustomers(),
      ]);

    return {
      version: '1.0.0',
      exportedAt: Date.now(),
      products: productsList,
      portfolioPieces: piecesList,
      orders: ordersList,
      commissionInquiries: inquiriesList,
      customers: customersList,
    };
  }

  private async listAllCustomers(): Promise<Customer[]> {
    const db = await this.ready();
    const rows = await db.select().from(customers);
    return rows.map((r) => this.mapCustomerRow(r));
  }

  async restoreSnapshotData(snapshot: StoreSnapshot): Promise<void> {
    const db = await this.ready();

    // Clear existing data
    await db.delete(orders);
    await db.delete(commissionInquiries);
    await db.delete(customers);
    await db.delete(predefinedProducts);
    await db.delete(portfolioPieces);

    // Restore customers
    for (const c of snapshot.customers) {
      await this.saveCustomer(c);
    }

    // Restore products
    for (const p of snapshot.products) {
      await this.saveProduct(p);
    }

    // Restore portfolio pieces
    for (const piece of snapshot.portfolioPieces) {
      await this.savePortfolioPiece(piece);
    }

    // Restore orders
    for (const o of snapshot.orders) {
      await this.saveOrder(o);
    }

    // Restore inquiries
    for (const inq of snapshot.commissionInquiries) {
      await this.saveCommissionInquiry(inq);
    }
  }

  // ── Helper Row Mappers ────────────────────────────────────────────────
  private mapProductRow(row: typeof predefinedProducts.$inferSelect): PredefinedProduct {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      pricePaise: row.pricePaise,
      weight: row.weight,
      dimensions: row.dimensions,
      alloyDescription: row.alloyDescription,
      careGuide: row.careGuide,
      stockQuantity: row.stockQuantity,
      images: JSON.parse(row.images) as string[],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private mapPortfolioRow(row: typeof portfolioPieces.$inferSelect): PortfolioPiece {
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      referenceDimensions: row.referenceDimensions,
      castingTechnique: row.castingTechnique,
      finishOptions: JSON.parse(row.finishOptions) as string[],
      typicalLeadTime: row.typicalLeadTime,
      images: JSON.parse(row.images) as string[],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private mapOrderRow(row: typeof orders.$inferSelect): Order {
    return {
      id: row.id,
      orderCode: row.orderCode,
      customerId: row.customerId,
      items: JSON.parse(row.items) as OrderItem[],
      shippingAddress: JSON.parse(row.shippingAddress) as ShippingAddress,
      shippingCostPaise: row.shippingCostPaise,
      totalPaise: row.totalPaise,
      status: row.status as OrderStatus,
      courierTrackingUrl: row.courierTrackingUrl ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  private mapCommissionRow(
    row: typeof commissionInquiries.$inferSelect
  ): CommissionInquiry {
    return {
      id: row.id,
      commissionCode: row.commissionCode,
      customerId: row.customerId,
      itemType: row.itemType,
      deityIconography: row.deityIconography,
      dimensions: row.dimensions,
      finishPreference: row.finishPreference,
      targetDate: row.targetDate,
      phoneNumber: row.phoneNumber,
      inspiredByPortfolioId: row.inspiredByPortfolioId ?? undefined,
      createdAt: row.createdAt,
    };
  }

  private mapCustomerRow(row: typeof customers.$inferSelect): Customer {
    return {
      id: row.id,
      googleId: row.googleId,
      email: row.email,
      name: row.name,
      avatarUrl: row.avatarUrl ?? undefined,
      phoneNumber: row.phoneNumber ?? undefined,
      createdAt: row.createdAt,
    };
  }
}
