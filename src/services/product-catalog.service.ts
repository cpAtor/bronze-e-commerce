import type { StoreRepository } from '@/domain/services';
import type { PredefinedProduct, Order, CreateOrderInput } from '@/domain/types';
import { getStoreRepository } from '@/repositories';
import { calculateShippingPaise } from '@/lib/utils';

export class ProductCatalogService {
  constructor(private repo: StoreRepository = getStoreRepository()) {}

  async browseProducts(): Promise<PredefinedProduct[]> {
    return this.repo.listProducts();
  }

  async getProducts(): Promise<PredefinedProduct[]> {
    return this.browseProducts();
  }

  async getProduct(slug: string): Promise<PredefinedProduct | null> {
    return this.repo.findProductBySlug(slug);
  }

  async getProductBySlug(slug: string): Promise<PredefinedProduct | null> {
    return this.getProduct(slug);
  }

  async getProductById(id: string): Promise<PredefinedProduct | null> {
    return this.repo.findProductById(id);
  }

  calculateShipping(subtotalPaise: number): number {
    return calculateShippingPaise(subtotalPaise);
  }

  async placeOrder(input: CreateOrderInput, correlationId?: string): Promise<Order> {
    throw new Error('Not implemented: placeOrder will be implemented in Task 02');
  }

  async createOrder(input: CreateOrderInput, correlationId?: string): Promise<Order> {
    return this.placeOrder(input, correlationId);
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return this.repo.listOrdersByCustomerId(customerId);
  }

  async getOrderById(orderId: string, customerId: string): Promise<Order | null> {
    const order = await this.repo.findOrderById(orderId);
    return order && order.customerId === customerId ? order : null;
  }

  async getOrderByCode(code: string): Promise<Order | null> {
    return this.repo.findOrderByCode(code);
  }
}
