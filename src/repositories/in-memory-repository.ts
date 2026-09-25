import type { StoreRepository } from '@/domain/services';
import type {
  PredefinedProduct,
  PortfolioPiece,
  Order,
  CommissionInquiry,
  Customer,
  StoreSnapshot,
} from '@/domain/types';
import {
  SEED_PREDEFINED_PRODUCTS,
  SEED_PORTFOLIO_PIECES,
} from '@/data/seed-data';

export class InMemoryStoreRepository implements StoreRepository {
  private products = new Map<string, PredefinedProduct>();
  private portfolioPieces = new Map<string, PortfolioPiece>();
  private orders = new Map<string, Order>();
  private commissionInquiries = new Map<string, CommissionInquiry>();
  private customers = new Map<string, Customer>();

  constructor(seed = true) {
    if (seed) {
      this.resetToSeed();
    }
  }

  public resetToSeed(): void {
    this.products.clear();
    this.portfolioPieces.clear();
    this.orders.clear();
    this.commissionInquiries.clear();
    this.customers.clear();

    for (const p of SEED_PREDEFINED_PRODUCTS) {
      this.products.set(p.id, JSON.parse(JSON.stringify(p)));
    }

    for (const piece of SEED_PORTFOLIO_PIECES) {
      this.portfolioPieces.set(piece.id, JSON.parse(JSON.stringify(piece)));
    }
  }

  // Predefined Products
  async findProductById(id: string): Promise<PredefinedProduct | null> {
    const item = this.products.get(id);
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async findProductBySlug(slug: string): Promise<PredefinedProduct | null> {
    for (const item of this.products.values()) {
      if (item.slug === slug) {
        return JSON.parse(JSON.stringify(item));
      }
    }
    return null;
  }

  async listProducts(): Promise<PredefinedProduct[]> {
    return Array.from(this.products.values()).map((p) =>
      JSON.parse(JSON.stringify(p))
    );
  }

  async saveProduct(product: PredefinedProduct): Promise<void> {
    this.products.set(product.id, JSON.parse(JSON.stringify(product)));
  }

  async deleteProduct(id: string): Promise<void> {
    this.products.delete(id);
  }

  // Portfolio Pieces
  async findPortfolioPieceById(id: string): Promise<PortfolioPiece | null> {
    const item = this.portfolioPieces.get(id);
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async findPortfolioPieceBySlug(slug: string): Promise<PortfolioPiece | null> {
    for (const item of this.portfolioPieces.values()) {
      if (item.slug === slug) {
        return JSON.parse(JSON.stringify(item));
      }
    }
    return null;
  }

  async listPortfolioPieces(): Promise<PortfolioPiece[]> {
    return Array.from(this.portfolioPieces.values()).map((p) =>
      JSON.parse(JSON.stringify(p))
    );
  }

  async savePortfolioPiece(piece: PortfolioPiece): Promise<void> {
    this.portfolioPieces.set(piece.id, JSON.parse(JSON.stringify(piece)));
  }

  async deletePortfolioPiece(id: string): Promise<void> {
    this.portfolioPieces.delete(id);
  }

  // Orders
  async findOrderById(id: string): Promise<Order | null> {
    const order = this.orders.get(id);
    return order ? JSON.parse(JSON.stringify(order)) : null;
  }

  async findOrderByCode(orderCode: string): Promise<Order | null> {
    for (const order of this.orders.values()) {
      if (order.orderCode === orderCode) {
        return JSON.parse(JSON.stringify(order));
      }
    }
    return null;
  }

  async listOrdersByCustomerId(customerId: string): Promise<Order[]> {
    const results: Order[] = [];
    for (const order of this.orders.values()) {
      if (order.customerId === customerId) {
        results.push(JSON.parse(JSON.stringify(order)));
      }
    }
    return results.sort((a, b) => b.createdAt - a.createdAt);
  }

  async listAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values())
      .map((o) => JSON.parse(JSON.stringify(o)))
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async saveOrder(order: Order): Promise<void> {
    this.orders.set(order.id, JSON.parse(JSON.stringify(order)));
  }

  // Commission Inquiries
  async findCommissionInquiryById(
    id: string
  ): Promise<CommissionInquiry | null> {
    const item = this.commissionInquiries.get(id);
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async findCommissionInquiryByCode(
    commissionCode: string
  ): Promise<CommissionInquiry | null> {
    for (const item of this.commissionInquiries.values()) {
      if (item.commissionCode === commissionCode) {
        return JSON.parse(JSON.stringify(item));
      }
    }
    return null;
  }

  async listCommissionInquiries(): Promise<CommissionInquiry[]> {
    return Array.from(this.commissionInquiries.values())
      .map((item) => JSON.parse(JSON.stringify(item)))
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async saveCommissionInquiry(inquiry: CommissionInquiry): Promise<void> {
    this.commissionInquiries.set(
      inquiry.id,
      JSON.parse(JSON.stringify(inquiry))
    );
  }

  // Customers
  async findCustomerById(id: string): Promise<Customer | null> {
    const cust = this.customers.get(id);
    return cust ? JSON.parse(JSON.stringify(cust)) : null;
  }

  async findCustomerByGoogleId(googleId: string): Promise<Customer | null> {
    for (const cust of this.customers.values()) {
      if (cust.googleId === googleId) {
        return JSON.parse(JSON.stringify(cust));
      }
    }
    return null;
  }

  async saveCustomer(customer: Customer): Promise<void> {
    this.customers.set(customer.id, JSON.parse(JSON.stringify(customer)));
  }

  // Snapshot Export / Restore
  async getSnapshotData(): Promise<StoreSnapshot> {
    return {
      version: '1.0.0',
      exportedAt: Date.now(),
      products: await this.listProducts(),
      portfolioPieces: await this.listPortfolioPieces(),
      orders: await this.listAllOrders(),
      commissionInquiries: await this.listCommissionInquiries(),
      customers: Array.from(this.customers.values()).map((c) =>
        JSON.parse(JSON.stringify(c))
      ),
    };
  }

  async restoreSnapshotData(snapshot: StoreSnapshot): Promise<void> {
    this.products.clear();
    this.portfolioPieces.clear();
    this.orders.clear();
    this.commissionInquiries.clear();
    this.customers.clear();

    for (const p of snapshot.products) {
      this.products.set(p.id, JSON.parse(JSON.stringify(p)));
    }
    for (const piece of snapshot.portfolioPieces) {
      this.portfolioPieces.set(piece.id, JSON.parse(JSON.stringify(piece)));
    }
    for (const o of snapshot.orders) {
      this.orders.set(o.id, JSON.parse(JSON.stringify(o)));
    }
    for (const c of snapshot.commissionInquiries) {
      this.commissionInquiries.set(c.id, JSON.parse(JSON.stringify(c)));
    }
    for (const u of snapshot.customers) {
      this.customers.set(u.id, JSON.parse(JSON.stringify(u)));
    }
  }
}
