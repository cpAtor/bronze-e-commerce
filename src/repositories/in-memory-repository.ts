import fs from 'fs';
import path from 'path';
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

const TMP_STATE_PATH = path.join('/tmp', 'heritage_store_state.json');

export class InMemoryStoreRepository implements StoreRepository {
  private products = new Map<string, PredefinedProduct>();
  private portfolioPieces = new Map<string, PortfolioPiece>();
  private orders = new Map<string, Order>();
  private commissionInquiries = new Map<string, CommissionInquiry>();
  private customers = new Map<string, Customer>();

  private clone<T>(val: T): T {
    return JSON.parse(JSON.stringify(val));
  }

  private loadFromDisk(): void {
    try {
      if (
        typeof window === 'undefined' &&
        process.env.NODE_ENV !== 'test' &&
        !process.env.VITEST &&
        fs.existsSync(TMP_STATE_PATH)
      ) {
        const raw = fs.readFileSync(TMP_STATE_PATH, 'utf-8');
        const data = JSON.parse(raw);
        if (data.orders && Array.isArray(data.orders)) {
          for (const o of data.orders) {
            this.orders.set(o.id, o);
          }
        }
        if (data.commissionInquiries && Array.isArray(data.commissionInquiries)) {
          for (const c of data.commissionInquiries) {
            this.commissionInquiries.set(c.id, c);
          }
        }
      }
    } catch {
      // Ignore disk read errors
    }
  }

  private saveToDisk(): void {
    try {
      if (
        typeof window === 'undefined' &&
        process.env.NODE_ENV !== 'test' &&
        !process.env.VITEST
      ) {
        const data = {
          orders: Array.from(this.orders.values()),
          commissionInquiries: Array.from(this.commissionInquiries.values()),
        };
        fs.writeFileSync(TMP_STATE_PATH, JSON.stringify(data), 'utf-8');
      }
    } catch {
      // Ignore disk write errors
    }
  }

  constructor(seed = true) {
    if (seed) {
      this.resetToSeed();
      this.loadFromDisk();
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
    if (order) return JSON.parse(JSON.stringify(order));
    this.loadFromDisk();
    const diskOrder = this.orders.get(id);
    return diskOrder ? JSON.parse(JSON.stringify(diskOrder)) : null;
  }

  async findOrderByCode(orderCode: string): Promise<Order | null> {
    for (const order of this.orders.values()) {
      if (order.orderCode === orderCode) {
        return JSON.parse(JSON.stringify(order));
      }
    }
    this.loadFromDisk();
    for (const order of this.orders.values()) {
      if (order.orderCode === orderCode) {
        return JSON.parse(JSON.stringify(order));
      }
    }
    return null;
  }

  async listOrdersByCustomerId(customerId: string): Promise<Order[]> {
    this.loadFromDisk();
    const results: Order[] = [];
    for (const order of this.orders.values()) {
      if (order.customerId === customerId) {
        results.push(JSON.parse(JSON.stringify(order)));
      }
    }
    return results.sort((a, b) => b.createdAt - a.createdAt);
  }

  async listAllOrders(): Promise<Order[]> {
    this.loadFromDisk();
    return Array.from(this.orders.values())
      .map((o) => JSON.parse(JSON.stringify(o)))
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async saveOrder(order: Order): Promise<void> {
    this.orders.set(order.id, JSON.parse(JSON.stringify(order)));
    this.saveToDisk();
  }

  // Commission Inquiries
  async findCommissionInquiryById(
    id: string
  ): Promise<CommissionInquiry | null> {
    const item = this.commissionInquiries.get(id);
    if (item) return JSON.parse(JSON.stringify(item));
    this.loadFromDisk();
    const diskItem = this.commissionInquiries.get(id);
    return diskItem ? JSON.parse(JSON.stringify(diskItem)) : null;
  }

  async findCommissionInquiryByCode(
    commissionCode: string
  ): Promise<CommissionInquiry | null> {
    for (const item of this.commissionInquiries.values()) {
      if (item.commissionCode === commissionCode) {
        return JSON.parse(JSON.stringify(item));
      }
    }
    this.loadFromDisk();
    for (const item of this.commissionInquiries.values()) {
      if (item.commissionCode === commissionCode) {
        return JSON.parse(JSON.stringify(item));
      }
    }
    return null;
  }

  async listCommissionInquiries(): Promise<CommissionInquiry[]> {
    this.loadFromDisk();
    return Array.from(this.commissionInquiries.values())
      .map((item) => JSON.parse(JSON.stringify(item)))
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async saveCommissionInquiry(inquiry: CommissionInquiry): Promise<void> {
    this.commissionInquiries.set(
      inquiry.id,
      JSON.parse(JSON.stringify(inquiry))
    );
    this.saveToDisk();
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
      customers: Array.from(this.customers.values()).map((c) => this.clone(c)),
    };
  }

  async restoreSnapshotData(snapshot: StoreSnapshot): Promise<void> {
    this.products.clear();
    this.portfolioPieces.clear();
    this.orders.clear();
    this.commissionInquiries.clear();
    this.customers.clear();

    for (const p of snapshot.products) {
      this.products.set(p.id, this.clone(p));
    }
    for (const piece of snapshot.portfolioPieces) {
      this.portfolioPieces.set(piece.id, this.clone(piece));
    }
    for (const o of snapshot.orders) {
      this.orders.set(o.id, this.clone(o));
    }
    for (const c of snapshot.commissionInquiries) {
      this.commissionInquiries.set(c.id, this.clone(c));
    }
    for (const customer of snapshot.customers) {
      this.customers.set(customer.id, this.clone(customer));
    }
  }
}
