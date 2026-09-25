import type { CatalogService } from '@/domain/services';
import type {
  PredefinedProduct,
  PortfolioPiece,
  Order,
  CommissionInquiry,
  CreateOrderInput,
  SubmitCommissionInquiryInput,
} from '@/domain/types';
import { ProductCatalogService } from './product-catalog.service';
import { PortfolioCatalogService } from './portfolio-catalog.service';

export class DefaultCatalogService implements CatalogService {
  constructor(
    private products: ProductCatalogService = new ProductCatalogService(),
    private portfolio: PortfolioCatalogService = new PortfolioCatalogService()
  ) {}

  // Delegated Product methods
  getProducts = (): Promise<PredefinedProduct[]> => this.products.getProducts();
  browseProducts = (): Promise<PredefinedProduct[]> =>
    this.products.browseProducts();
  getProductBySlug = (slug: string): Promise<PredefinedProduct | null> =>
    this.products.getProductBySlug(slug);
  getProduct = (slug: string): Promise<PredefinedProduct | null> =>
    this.products.getProduct(slug);
  getProductById = (id: string): Promise<PredefinedProduct | null> =>
    this.products.getProductById(id);
  calculateShipping = (subtotalPaise: number): number =>
    this.products.calculateShipping(subtotalPaise);
  createOrder = (
    input: CreateOrderInput,
    correlationId?: string
  ): Promise<Order> => this.products.createOrder(input, correlationId);
  placeOrder = (
    input: CreateOrderInput,
    correlationId?: string
  ): Promise<Order> => this.products.placeOrder(input, correlationId);
  getOrdersByCustomer = (customerId: string): Promise<Order[]> =>
    this.products.getOrdersByCustomer(customerId);
  getOrderById = (orderId: string, customerId: string): Promise<Order | null> =>
    this.products.getOrderById(orderId, customerId);
  getOrderByCode = (code: string): Promise<Order | null> =>
    this.products.getOrderByCode(code);

  // Delegated Portfolio methods
  getPortfolioPieces = (): Promise<PortfolioPiece[]> =>
    this.portfolio.getPortfolioPieces();
  browsePortfolio = (): Promise<PortfolioPiece[]> =>
    this.portfolio.browsePortfolio();
  getPortfolioPieceBySlug = (slug: string): Promise<PortfolioPiece | null> =>
    this.portfolio.getPortfolioPieceBySlug(slug);
  getPortfolioPiece = (slug: string): Promise<PortfolioPiece | null> =>
    this.portfolio.getPortfolioPiece(slug);
  getPortfolioPieceById = (id: string): Promise<PortfolioPiece | null> =>
    this.portfolio.getPortfolioPieceById(id);
  submitCommissionInquiry = (
    input: SubmitCommissionInquiryInput,
    correlationId?: string
  ): Promise<CommissionInquiry> =>
    this.portfolio.submitCommissionInquiry(input, correlationId);
  getCommissionInquiryByCode = (
    code: string
  ): Promise<CommissionInquiry | null> =>
    this.portfolio.getCommissionInquiryByCode(code);
}
