import type { AdminService, StoreRepository } from '@/domain/services';
import type {
  PredefinedProduct,
  PortfolioPiece,
  Order,
  CommissionInquiry,
  StoreSnapshot,
  CreateProductInput,
  UpdateProductInput,
  CreatePortfolioPieceInput,
  UpdatePortfolioPieceInput,
} from '@/domain/types';
import { getStoreRepository } from '@/repositories';

export class DefaultAdminService implements AdminService {
  constructor(private repo: StoreRepository = getStoreRepository()) {}

  // Products
  async getAllProducts(): Promise<PredefinedProduct[]> {
    return this.repo.listProducts();
  }

  async getProductById(id: string): Promise<PredefinedProduct | null> {
    return this.repo.findProductById(id);
  }

  async createProduct(
    _input: CreateProductInput,
    _correlationId?: string
  ): Promise<PredefinedProduct> {
    throw new Error('Not implemented: createProduct will be implemented in Task 04');
  }

  async updateProduct(
    _id: string,
    _input: UpdateProductInput,
    _correlationId?: string
  ): Promise<PredefinedProduct> {
    throw new Error('Not implemented: updateProduct will be implemented in Task 04');
  }

  async deleteProduct(_id: string, _correlationId?: string): Promise<void> {
    throw new Error('Not implemented: deleteProduct will be implemented in Task 04');
  }

  // Portfolio
  async getAllPortfolioPieces(): Promise<PortfolioPiece[]> {
    return this.repo.listPortfolioPieces();
  }

  async getPortfolioPieceById(id: string): Promise<PortfolioPiece | null> {
    return this.repo.findPortfolioPieceById(id);
  }

  async createPortfolioPiece(
    _input: CreatePortfolioPieceInput,
    _correlationId?: string
  ): Promise<PortfolioPiece> {
    throw new Error(
      'Not implemented: createPortfolioPiece will be implemented in Task 04'
    );
  }

  async updatePortfolioPiece(
    _id: string,
    _input: UpdatePortfolioPieceInput,
    _correlationId?: string
  ): Promise<PortfolioPiece> {
    throw new Error(
      'Not implemented: updatePortfolioPiece will be implemented in Task 04'
    );
  }

  async deletePortfolioPiece(
    _id: string,
    _correlationId?: string
  ): Promise<void> {
    throw new Error(
      'Not implemented: deletePortfolioPiece will be implemented in Task 04'
    );
  }

  // Orders & Commissions
  async getAllOrders(): Promise<Order[]> {
    return this.repo.listAllOrders();
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.repo.findOrderById(id);
  }

  async markOrderShipped(
    _orderId: string,
    _courierTrackingUrl: string,
    _correlationId?: string
  ): Promise<Order> {
    throw new Error(
      'Not implemented: markOrderShipped will be implemented in Issue 05'
    );
  }

  async getAllCommissionInquiries(): Promise<CommissionInquiry[]> {
    return this.repo.listCommissionInquiries();
  }

  async getCommissionInquiryById(
    id: string
  ): Promise<CommissionInquiry | null> {
    return this.repo.findCommissionInquiryById(id);
  }

  // Snapshot
  async exportSnapshot(_correlationId?: string): Promise<StoreSnapshot> {
    return this.repo.getSnapshotData();
  }

  async restoreSnapshot(
    snapshot: StoreSnapshot,
    _correlationId?: string
  ): Promise<void> {
    return this.repo.restoreSnapshotData(snapshot);
  }
}
