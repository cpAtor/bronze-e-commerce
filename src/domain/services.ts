/**
 * Service and Repository Interfaces.
 * Enforces architectural boundaries specified in spec.md:
 * - CatalogService (Customer-facing, no mutation methods on Products/Portfolio)
 * - AdminService (Admin-facing, full CRUD & fulfillment)
 * - StoreRepository (Shared persistence seam)
 */

import type {
  PredefinedProduct,
  PortfolioPiece,
  Order,
  CommissionInquiry,
  Customer,
  StoreSnapshot,
  CreateOrderInput,
  SubmitCommissionInquiryInput,
  CreateProductInput,
  UpdateProductInput,
  CreatePortfolioPieceInput,
  UpdatePortfolioPieceInput,
} from './types';

export type {
  CreateOrderInput,
  SubmitCommissionInquiryInput,
  CreateProductInput,
  UpdateProductInput,
  CreatePortfolioPieceInput,
  UpdatePortfolioPieceInput,
};

/**
 * Customer-facing catalog & purchase operations.
 * Physically lacks mutation methods on Products/Portfolio.
 */
export interface CatalogService {
  getProducts(): Promise<PredefinedProduct[]>;
  getProductBySlug(slug: string): Promise<PredefinedProduct | null>;
  getProductById(id: string): Promise<PredefinedProduct | null>;
  getPortfolioPieces(): Promise<PortfolioPiece[]>;
  getPortfolioPieceBySlug(slug: string): Promise<PortfolioPiece | null>;
  getPortfolioPieceById(id: string): Promise<PortfolioPiece | null>;
  calculateShipping(subtotalPaise: number): number;
  createOrder(input: CreateOrderInput, correlationId?: string): Promise<Order>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  getOrderById(orderId: string, customerId: string): Promise<Order | null>;
  submitCommissionInquiry(
    input: SubmitCommissionInquiryInput,
    correlationId?: string
  ): Promise<CommissionInquiry>;
}

/**
 * Admin-facing management & fulfillment operations.
 */
export interface AdminService {
  getAllProducts(): Promise<PredefinedProduct[]>;
  getProductById(id: string): Promise<PredefinedProduct | null>;
  createProduct(input: CreateProductInput, correlationId?: string): Promise<PredefinedProduct>;
  updateProduct(id: string, input: UpdateProductInput, correlationId?: string): Promise<PredefinedProduct>;
  deleteProduct(id: string, correlationId?: string): Promise<void>;

  getAllPortfolioPieces(): Promise<PortfolioPiece[]>;
  getPortfolioPieceById(id: string): Promise<PortfolioPiece | null>;
  createPortfolioPiece(
    input: CreatePortfolioPieceInput,
    correlationId?: string
  ): Promise<PortfolioPiece>;
  updatePortfolioPiece(
    id: string,
    input: UpdatePortfolioPieceInput,
    correlationId?: string
  ): Promise<PortfolioPiece>;
  deletePortfolioPiece(id: string, correlationId?: string): Promise<void>;

  getAllOrders(): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
  markOrderShipped(
    orderId: string,
    courierTrackingUrl: string,
    correlationId?: string
  ): Promise<Order>;

  getAllCommissionInquiries(): Promise<CommissionInquiry[]>;
  getCommissionInquiryById(id: string): Promise<CommissionInquiry | null>;

  exportSnapshot(correlationId?: string): Promise<StoreSnapshot>;
  restoreSnapshot(snapshot: StoreSnapshot, correlationId?: string): Promise<void>;
}

/**
 * Pure persistence seam.
 * Adapts between storage mechanisms (In-Memory, SQLite/Turso, Postgres) without business logic.
 */
export interface StoreRepository {
  // Predefined Products
  findProductById(id: string): Promise<PredefinedProduct | null>;
  findProductBySlug(slug: string): Promise<PredefinedProduct | null>;
  listProducts(): Promise<PredefinedProduct[]>;
  saveProduct(product: PredefinedProduct): Promise<void>;
  deleteProduct(id: string): Promise<void>;

  // Portfolio Pieces
  findPortfolioPieceById(id: string): Promise<PortfolioPiece | null>;
  findPortfolioPieceBySlug(slug: string): Promise<PortfolioPiece | null>;
  listPortfolioPieces(): Promise<PortfolioPiece[]>;
  savePortfolioPiece(piece: PortfolioPiece): Promise<void>;
  deletePortfolioPiece(id: string): Promise<void>;

  // Orders
  findOrderById(id: string): Promise<Order | null>;
  findOrderByCode(orderCode: string): Promise<Order | null>;
  listOrdersByCustomerId(customerId: string): Promise<Order[]>;
  listAllOrders(): Promise<Order[]>;
  saveOrder(order: Order): Promise<void>;

  // Commission Inquiries
  findCommissionInquiryById(id: string): Promise<CommissionInquiry | null>;
  findCommissionInquiryByCode(commissionCode: string): Promise<CommissionInquiry | null>;
  listCommissionInquiries(): Promise<CommissionInquiry[]>;
  saveCommissionInquiry(inquiry: CommissionInquiry): Promise<void>;

  // Customers
  findCustomerById(id: string): Promise<Customer | null>;
  findCustomerByGoogleId(googleId: string): Promise<Customer | null>;
  saveCustomer(customer: Customer): Promise<void>;

  // Snapshot Export / Restore
  getSnapshotData(): Promise<StoreSnapshot>;
  restoreSnapshotData(snapshot: StoreSnapshot): Promise<void>;
}
