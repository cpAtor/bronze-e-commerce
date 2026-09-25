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
import { logDomainEvent, type DomainEventType } from '@/domain/events';
import { getStoreRepository } from '@/repositories';

export class DefaultAdminService implements AdminService {
  constructor(private repo: StoreRepository = getStoreRepository()) {}

  // ---------------------------------------------------------------------------
  // Predefined Products
  // ---------------------------------------------------------------------------

  async getAllProducts(): Promise<PredefinedProduct[]> {
    return this.repo.listProducts();
  }

  async getProductById(id: string): Promise<PredefinedProduct | null> {
    return this.repo.findProductById(id);
  }

  async createProduct(
    input: CreateProductInput,
    correlationId?: string
  ): Promise<PredefinedProduct> {
    // 1. Validation
    if (!input.name || !input.name.trim()) {
      throw new Error('Product name is required');
    }
    if (!input.slug || !input.slug.trim()) {
      throw new Error('Product slug is required');
    }
    if (input.pricePaise === undefined || input.pricePaise < 0) {
      throw new Error('Product price must be a non-negative number of paise');
    }
    if (input.stockQuantity === undefined || input.stockQuantity < 0) {
      throw new Error('Product stock quantity must be a non-negative number');
    }

    const normalizedSlug = input.slug.trim().toLowerCase();
    const existing = await this.repo.findProductBySlug(normalizedSlug);
    if (existing) {
      throw new Error(`Product with slug "${normalizedSlug}" already exists`);
    }

    const now = Date.now();
    const product: PredefinedProduct = {
      id: `prod-${now.toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: input.name.trim(),
      slug: normalizedSlug,
      description: input.description || '',
      pricePaise: Math.round(input.pricePaise),
      weight: input.weight || '',
      dimensions: input.dimensions || '',
      alloyDescription: input.alloyDescription || '',
      careGuide: input.careGuide || '',
      stockQuantity: Math.round(input.stockQuantity),
      images: input.images || [],
      createdAt: now,
      updatedAt: now,
    };

    await this.repo.saveProduct(product);

    logDomainEvent(
      'product.created',
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        pricePaise: product.pricePaise,
        stockQuantity: product.stockQuantity,
      },
      correlationId
    );

    return product;
  }

  async updateProduct(
    id: string,
    input: UpdateProductInput,
    correlationId?: string
  ): Promise<PredefinedProduct> {
    const existing = await this.repo.findProductById(id);
    if (!existing) {
      throw new Error(`Product with id "${id}" not found`);
    }

    if (input.pricePaise !== undefined && input.pricePaise < 0) {
      throw new Error('Product price must be a non-negative number of paise');
    }
    if (input.stockQuantity !== undefined && input.stockQuantity < 0) {
      throw new Error('Product stock quantity must be a non-negative number');
    }

    let normalizedSlug = existing.slug;
    if (input.slug && input.slug.trim()) {
      normalizedSlug = input.slug.trim().toLowerCase();
      if (normalizedSlug !== existing.slug) {
        const slugConflict = await this.repo.findProductBySlug(normalizedSlug);
        if (slugConflict && slugConflict.id !== id) {
          throw new Error(`Product with slug "${normalizedSlug}" already exists`);
        }
      }
    }

    const updated: PredefinedProduct = {
      ...existing,
      ...input,
      slug: normalizedSlug,
      pricePaise:
        input.pricePaise !== undefined
          ? Math.round(input.pricePaise)
          : existing.pricePaise,
      stockQuantity:
        input.stockQuantity !== undefined
          ? Math.round(input.stockQuantity)
          : existing.stockQuantity,
      updatedAt: Date.now(),
    };

    await this.repo.saveProduct(updated);

    logDomainEvent(
      'product.updated',
      {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        changes: input,
      },
      correlationId
    );

    return updated;
  }

  async deleteProduct(id: string, correlationId?: string): Promise<void> {
    const existing = await this.repo.findProductById(id);
    if (!existing) {
      throw new Error(`Product with id "${id}" not found`);
    }

    await this.repo.deleteProduct(id);

    logDomainEvent(
      'product.deleted',
      {
        id,
        name: existing.name,
        slug: existing.slug,
      },
      correlationId
    );
  }

  // ---------------------------------------------------------------------------
  // Portfolio Showcase Pieces
  // ---------------------------------------------------------------------------

  async getAllPortfolioPieces(): Promise<PortfolioPiece[]> {
    return this.repo.listPortfolioPieces();
  }

  async getPortfolioPieceById(id: string): Promise<PortfolioPiece | null> {
    return this.repo.findPortfolioPieceById(id);
  }

  async createPortfolioPiece(
    input: CreatePortfolioPieceInput,
    correlationId?: string
  ): Promise<PortfolioPiece> {
    if (!input.name || !input.name.trim()) {
      throw new Error('Portfolio piece name is required');
    }
    if (!input.slug || !input.slug.trim()) {
      throw new Error('Portfolio piece slug is required');
    }

    const normalizedSlug = input.slug.trim().toLowerCase();
    const existing = await this.repo.findPortfolioPieceBySlug(normalizedSlug);
    if (existing) {
      throw new Error(`Portfolio piece with slug "${normalizedSlug}" already exists`);
    }

    const now = Date.now();
    const piece: PortfolioPiece = {
      id: `port-${now.toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: input.name.trim(),
      slug: normalizedSlug,
      description: input.description || '',
      referenceDimensions: input.referenceDimensions || '',
      castingTechnique: input.castingTechnique || '',
      finishOptions: input.finishOptions || [],
      typicalLeadTime: input.typicalLeadTime || '',
      images: input.images || [],
      createdAt: now,
      updatedAt: now,
    };

    await this.repo.savePortfolioPiece(piece);

    logDomainEvent(
      'portfolio.created' as DomainEventType,
      {
        id: piece.id,
        name: piece.name,
        slug: piece.slug,
      },
      correlationId
    );

    return piece;
  }

  async updatePortfolioPiece(
    id: string,
    input: UpdatePortfolioPieceInput,
    correlationId?: string
  ): Promise<PortfolioPiece> {
    const existing = await this.repo.findPortfolioPieceById(id);
    if (!existing) {
      throw new Error(`Portfolio piece with id "${id}" not found`);
    }

    let normalizedSlug = existing.slug;
    if (input.slug && input.slug.trim()) {
      normalizedSlug = input.slug.trim().toLowerCase();
      if (normalizedSlug !== existing.slug) {
        const slugConflict = await this.repo.findPortfolioPieceBySlug(normalizedSlug);
        if (slugConflict && slugConflict.id !== id) {
          throw new Error(`Portfolio piece with slug "${normalizedSlug}" already exists`);
        }
      }
    }

    const updated: PortfolioPiece = {
      ...existing,
      ...input,
      slug: normalizedSlug,
      updatedAt: Date.now(),
    };

    await this.repo.savePortfolioPiece(updated);

    logDomainEvent(
      'portfolio.updated' as DomainEventType,
      {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        changes: input,
      },
      correlationId
    );

    return updated;
  }

  async deletePortfolioPiece(
    id: string,
    correlationId?: string
  ): Promise<void> {
    const existing = await this.repo.findPortfolioPieceById(id);
    if (!existing) {
      throw new Error(`Portfolio piece with id "${id}" not found`);
    }

    await this.repo.deletePortfolioPiece(id);

    logDomainEvent(
      'portfolio.deleted' as DomainEventType,
      {
        id,
        name: existing.name,
        slug: existing.slug,
      },
      correlationId
    );
  }

  // ---------------------------------------------------------------------------
  // Orders & Commissions
  // ---------------------------------------------------------------------------

  async getAllOrders(): Promise<Order[]> {
    return this.repo.listAllOrders();
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.repo.findOrderById(id);
  }

  async markOrderShipped(
    orderId: string,
    courierTrackingUrl: string,
    correlationId?: string
  ): Promise<Order> {
    const order = await this.repo.findOrderById(orderId);
    if (!order) {
      throw new Error(`Order with id "${orderId}" not found`);
    }

    const updated: Order = {
      ...order,
      status: 'Shipped',
      courierTrackingUrl,
      updatedAt: Date.now(),
    };

    await this.repo.saveOrder(updated);

    logDomainEvent(
      'order.shipped',
      {
        orderId: updated.id,
        orderCode: updated.orderCode,
        courierTrackingUrl,
      },
      correlationId
    );

    return updated;
  }

  async getAllCommissionInquiries(): Promise<CommissionInquiry[]> {
    return this.repo.listCommissionInquiries();
  }

  async getCommissionInquiryById(
    id: string
  ): Promise<CommissionInquiry | null> {
    return this.repo.findCommissionInquiryById(id);
  }

  // ---------------------------------------------------------------------------
  // Snapshot Export / Restore
  // ---------------------------------------------------------------------------

  async exportSnapshot(correlationId?: string): Promise<StoreSnapshot> {
    const snapshot = await this.repo.getSnapshotData();
    logDomainEvent(
      'snapshot.exported',
      {
        version: snapshot.version,
        exportedAt: snapshot.exportedAt,
        productCount: snapshot.products.length,
        portfolioCount: snapshot.portfolioPieces.length,
      },
      correlationId
    );
    return snapshot;
  }

  async restoreSnapshot(
    snapshot: StoreSnapshot,
    correlationId?: string
  ): Promise<void> {
    await this.repo.restoreSnapshotData(snapshot);
    logDomainEvent(
      'snapshot.restored',
      {
        version: snapshot.version,
        restoredAt: Date.now(),
      },
      correlationId
    );
  }
}
