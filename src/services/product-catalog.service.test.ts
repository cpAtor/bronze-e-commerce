import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductCatalogService } from './product-catalog.service';
import { InMemoryStoreRepository } from '@/repositories/in-memory-repository';
import type { CreateOrderInput } from '@/domain/types';

describe('ProductCatalogService (Seam)', () => {
  let repo: InMemoryStoreRepository;
  let service: ProductCatalogService;

  beforeEach(() => {
    repo = new InMemoryStoreRepository(true);
    service = new ProductCatalogService(repo);
  });

  describe('Catalog Browsing', () => {
    it('returns all predefined products', async () => {
      const products = await service.browseProducts();
      expect(products.length).toBe(6);
      expect(products[0].name).toBeDefined();
      expect(products[0].pricePaise).toBeGreaterThan(0);
    });

    it('finds a product by slug', async () => {
      const product = await service.getProductBySlug('traditional-bronze-kalash');
      expect(product).not.toBeNull();
      expect(product?.name).toBe('Traditional Bronze Kalash (Lota)');
    });

    it('returns null for nonexistent slug', async () => {
      const product = await service.getProductBySlug('nonexistent-product');
      expect(product).toBeNull();
    });

    it('finds a product by id', async () => {
      const product = await service.getProductById('prod-001');
      expect(product).not.toBeNull();
      expect(product?.slug).toBe('traditional-bronze-kalash');
    });
  });

  describe('Shipping Calculation', () => {
    it('charges flat ₹150 (15,000 paise) when subtotal is below ₹2,500 (250,000 paise)', () => {
      expect(service.calculateShipping(0)).toBe(15000);
      expect(service.calculateShipping(110000)).toBe(15000);
      expect(service.calculateShipping(249900)).toBe(15000);
    });

    it('grants free shipping (0 paise) when subtotal is exactly or greater than ₹2,500 (250,000 paise)', () => {
      expect(service.calculateShipping(250000)).toBe(0);
      expect(service.calculateShipping(350000)).toBe(0);
      expect(service.calculateShipping(1000000)).toBe(0);
    });
  });

  describe('Order Placement & Validation', () => {
    const validAddress = {
      fullName: 'Aarav Sharma',
      addressLine1: '42 Heritage Lane',
      city: 'Thanjavur',
      state: 'Tamil Nadu',
      postalCode: '613001',
      country: 'India',
      phone: '+919876543210',
    };

    it('rejects order with empty items array', async () => {
      const input: CreateOrderInput = {
        customerEmail: 'aarav@example.com',
        customerName: 'Aarav Sharma',
        items: [],
        shippingAddress: validAddress,
      };

      await expect(service.placeOrder(input)).rejects.toThrow(/at least one item/i);
    });

    it('rejects order with invalid item quantity (<= 0)', async () => {
      const input: CreateOrderInput = {
        customerEmail: 'aarav@example.com',
        customerName: 'Aarav Sharma',
        items: [{ productId: 'prod-001', quantity: 0 }],
        shippingAddress: validAddress,
      };

      await expect(service.placeOrder(input)).rejects.toThrow(/quantity/i);
    });

    it('rejects order with invalid/unknown productId', async () => {
      const input: CreateOrderInput = {
        customerEmail: 'aarav@example.com',
        customerName: 'Aarav Sharma',
        items: [{ productId: 'invalid-prod-999', quantity: 1 }],
        shippingAddress: validAddress,
      };

      await expect(service.placeOrder(input)).rejects.toThrow(/not found/i);
    });

    it('rejects order with missing customer email or name', async () => {
      const inputMissingEmail: CreateOrderInput = {
        customerEmail: '',
        customerName: 'Aarav Sharma',
        items: [{ productId: 'prod-001', quantity: 1 }],
        shippingAddress: validAddress,
      };
      await expect(service.placeOrder(inputMissingEmail)).rejects.toThrow(/email/i);

      const inputMissingName: CreateOrderInput = {
        customerEmail: 'aarav@example.com',
        customerName: '   ',
        items: [{ productId: 'prod-001', quantity: 1 }],
        shippingAddress: validAddress,
      };
      await expect(service.placeOrder(inputMissingName)).rejects.toThrow(/name/i);
    });

    it('rejects order with incomplete shipping address', async () => {
      const incompleteAddress = {
        ...validAddress,
        postalCode: '',
      };
      const input: CreateOrderInput = {
        customerEmail: 'aarav@example.com',
        customerName: 'Aarav Sharma',
        items: [{ productId: 'prod-001', quantity: 1 }],
        shippingAddress: incompleteAddress,
      };

      await expect(service.placeOrder(input)).rejects.toThrow(/postal code/i);
    });

    it('successfully places order, calculates totals with shipping, and generates ORD-XXXX code', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // prod-003 is ₹1,100 (110,000 paise). Quantity 1 -> subtotal ₹1,100 -> shipping ₹150 -> total ₹1,250 (125,000 paise)
      const input: CreateOrderInput = {
        customerEmail: 'aarav@example.com',
        customerName: 'Aarav Sharma',
        customerPhone: '+919876543210',
        items: [{ productId: 'prod-003', quantity: 1 }],
        shippingAddress: validAddress,
      };

      const correlationId = 'test-corr-123';
      const order = await service.placeOrder(input, correlationId);

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.orderCode).toMatch(/^ORD-[A-Z0-9]{4}$/);
      expect(order.status).toBe('Ordered');
      expect(order.shippingCostPaise).toBe(15000);
      expect(order.totalPaise).toBe(125000);
      expect(order.items.length).toBe(1);
      expect(order.items[0].productName).toBe('Artisanal Bronze Coffee Mug');
      expect(order.items[0].unitPricePaise).toBe(110000);
      expect(order.items[0].quantity).toBe(1);

      // Verify persistence in repository
      const fetchedOrder = await service.getOrderByCode(order.orderCode);
      expect(fetchedOrder).not.toBeNull();
      expect(fetchedOrder?.id).toBe(order.id);
      expect(fetchedOrder?.orderCode).toBe(order.orderCode);

      // Verify domain event emitted
      expect(consoleSpy).toHaveBeenCalled();
      const emittedLog = consoleSpy.mock.calls
        .map((args) => {
          try {
            return JSON.parse(args[0]);
          } catch {
            return null;
          }
        })
        .find((log) => log?.event === 'order.created');

      expect(emittedLog).toBeDefined();
      expect(emittedLog.correlationId).toBe(correlationId);
      expect(emittedLog.payload.orderCode).toBe(order.orderCode);

      consoleSpy.mockRestore();
    });

    it('applies free shipping when order subtotal >= ₹2,500', async () => {
      // prod-001 is ₹2,800 (280,000 paise). Free shipping applies!
      const input: CreateOrderInput = {
        customerEmail: 'priya@example.com',
        customerName: 'Priya Sundaram',
        items: [{ productId: 'prod-001', quantity: 1 }],
        shippingAddress: validAddress,
      };

      const order = await service.placeOrder(input);
      expect(order.shippingCostPaise).toBe(0);
      expect(order.totalPaise).toBe(280000);
    });

    it('retrieves orders by customer ID', async () => {
      const input: CreateOrderInput = {
        customerId: 'cust-special-77',
        customerEmail: 'cust77@example.com',
        customerName: 'Devi Prasad',
        items: [{ productId: 'prod-002', quantity: 2 }],
        shippingAddress: validAddress,
      };

      const order = await service.placeOrder(input);
      const customerOrders = await service.getOrdersByCustomer('cust-special-77');
      expect(customerOrders.length).toBeGreaterThanOrEqual(1);
      expect(customerOrders.some((o) => o.id === order.id)).toBe(true);
    });
  });
});
