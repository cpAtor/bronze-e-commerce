import type { StoreRepository } from '@/domain/services';
import type { PredefinedProduct, Order, OrderItem, CreateOrderInput } from '@/domain/types';
import { getStoreRepository } from '@/repositories';
import { calculateShippingPaise } from '@/lib/utils';
import { logDomainEvent } from '@/domain/events';

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
    if (!input.items || !Array.isArray(input.items) || input.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    for (const item of input.items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new Error('Invalid item quantity. Each item must have a quantity greater than zero');
      }
    }

    if (!input.customerEmail || !input.customerEmail.trim()) {
      throw new Error('Customer email is required');
    }

    if (!input.customerName || !input.customerName.trim()) {
      throw new Error('Customer name is required');
    }

    if (!input.shippingAddress) {
      throw new Error('Shipping address is required');
    }

    const { fullName, addressLine1, city, state, postalCode } = input.shippingAddress;
    if (!fullName || !fullName.trim()) {
      throw new Error('Full name in shipping address is required');
    }
    if (!addressLine1 || !addressLine1.trim()) {
      throw new Error('Address line 1 is required');
    }
    if (!city || !city.trim()) {
      throw new Error('City is required');
    }
    if (!state || !state.trim()) {
      throw new Error('State is required');
    }
    if (!postalCode || !postalCode.trim()) {
      throw new Error('Postal code is required');
    }

    const orderItems: OrderItem[] = [];
    let subtotalPaise = 0;

    for (const item of input.items) {
      const product = await this.repo.findProductById(item.productId);
      if (!product) {
        throw new Error(`Product not found with ID: ${item.productId}`);
      }

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPricePaise: product.pricePaise,
      });

      subtotalPaise += product.pricePaise * item.quantity;
    }

    const shippingCostPaise = this.calculateShipping(subtotalPaise);
    const totalPaise = subtotalPaise + shippingCostPaise;

    // Generate reference code strictly matching ORD-XXXX format
    let code = '';
    const allOrders = await this.repo.listAllOrders();
    const candidateNumber = 1001 + allOrders.length;
    if (candidateNumber <= 9999) {
      const candidate = `ORD-${candidateNumber}`;
      const existing = await this.repo.findOrderByCode(candidate);
      if (!existing) {
        code = candidate;
      }
    }

    if (!code) {
      const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let attempts = 0;
      do {
        let rand = '';
        for (let i = 0; i < 4; i++) {
          rand += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        code = `ORD-${rand}`;
        attempts++;
      } while ((await this.repo.findOrderByCode(code)) && attempts < 50);
    }

    const now = Date.now();
    const orderId = `ord-${now}-${Math.random().toString(36).substring(2, 8)}`;
    const customerId =
      input.customerId || `guest-${input.customerEmail.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

    const order: Order = {
      id: orderId,
      orderCode: code,
      customerId,
      items: orderItems,
      shippingAddress: {
        fullName: fullName.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: input.shippingAddress.addressLine2?.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: input.shippingAddress.country?.trim() || 'India',
        phone: input.shippingAddress.phone?.trim() || input.customerPhone?.trim(),
      },
      shippingCostPaise,
      totalPaise,
      status: 'Ordered',
      courierTrackingUrl: null,
      createdAt: now,
      updatedAt: now,
    };

    await this.repo.saveOrder(order);

    logDomainEvent(
      'order.created',
      {
        orderId: order.id,
        orderCode: order.orderCode,
        customerId: order.customerId,
        totalPaise: order.totalPaise,
        itemCount: order.items.length,
        shippingCostPaise: order.shippingCostPaise,
        customerEmail: input.customerEmail,
      },
      correlationId
    );

    return order;
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
