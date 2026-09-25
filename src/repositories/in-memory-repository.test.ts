import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryStoreRepository } from './in-memory-repository';
import { logDomainEvent } from '@/domain/events';
import { formatPaiseToInr, calculateShippingPaise } from '@/lib/utils';
import type { Order, CommissionInquiry } from '@/domain/types';

describe('InMemoryStoreRepository seam', () => {
  let repo: InMemoryStoreRepository;

  beforeEach(() => {
    repo = new InMemoryStoreRepository(true);
  });

  describe('Predefined Products', () => {
    it('initializes with 6 predefined products', async () => {
      const products = await repo.listProducts();
      expect(products).toHaveLength(6);
      expect(products[0].name).toContain('Bronze Kalash');
      expect(products[0].pricePaise).toBe(280000);
      expect(products[0].images[0]).toContain('.jpg');
    });

    it('finds product by slug and id', async () => {
      const bySlug = await repo.findProductBySlug('traditional-bronze-kalash');
      expect(bySlug).not.toBeNull();
      expect(bySlug?.id).toBe('prod-001');

      const byId = await repo.findProductById('prod-001');
      expect(byId?.slug).toBe('traditional-bronze-kalash');
    });

    it('creates, updates, and deletes products', async () => {
      const newProduct = {
        id: 'prod-new',
        name: 'Handcrafted Bronze Bell',
        slug: 'handcrafted-bronze-bell',
        description: 'Deep resonant tone bell',
        pricePaise: 95000,
        weight: '350g',
        dimensions: '8cm x 8cm x 12cm',
        alloyDescription: 'Kansya Bell Metal',
        careGuide: 'Wipe with dry cloth',
        stockQuantity: 10,
        images: ['/images/products/bronze-mug.jpg'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await repo.saveProduct(newProduct);
      let found = await repo.findProductById('prod-new');
      expect(found?.name).toBe('Handcrafted Bronze Bell');

      // Update
      const updated = { ...newProduct, pricePaise: 120000 };
      await repo.saveProduct(updated);
      found = await repo.findProductById('prod-new');
      expect(found?.pricePaise).toBe(120000);

      // Delete
      await repo.deleteProduct('prod-new');
      found = await repo.findProductById('prod-new');
      expect(found).toBeNull();
    });
  });

  describe('Portfolio Pieces', () => {
    it('initializes with 5 portfolio showcase pieces', async () => {
      const pieces = await repo.listPortfolioPieces();
      expect(pieces).toHaveLength(5);
      expect(pieces[0].name).toContain('Nataraja');
      expect(pieces[0].castingTechnique).toContain('lost-wax');
      expect(pieces[0].images[0]).toContain('.jpg');
    });

    it('finds portfolio piece by slug and id', async () => {
      const piece = await repo.findPortfolioPieceBySlug('nataraja-ananda-tandava-murti');
      expect(piece).not.toBeNull();
      expect(piece?.id).toBe('port-001');
    });
  });

  describe('Orders', () => {
    it('saves and retrieves orders by customer and code', async () => {
      const testOrder: Order = {
        id: 'ord-test-1',
        orderCode: 'ORD-9001',
        customerId: 'cust-123',
        items: [
          {
            productId: 'prod-001',
            productName: 'Traditional Bronze Kalash',
            quantity: 1,
            unitPricePaise: 280000,
          },
        ],
        shippingAddress: {
          fullName: 'Ananya Sharma',
          addressLine1: '42 Heritage Lane',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
        },
        shippingCostPaise: 0,
        totalPaise: 280000,
        status: 'Ordered',
        courierTrackingUrl: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await repo.saveOrder(testOrder);

      const byId = await repo.findOrderById('ord-test-1');
      expect(byId?.orderCode).toBe('ORD-9001');

      const byCode = await repo.findOrderByCode('ORD-9001');
      expect(byCode?.id).toBe('ord-test-1');

      const customerOrders = await repo.listOrdersByCustomerId('cust-123');
      expect(customerOrders).toHaveLength(1);
      expect(customerOrders[0].orderCode).toBe('ORD-9001');
    });
  });

  describe('Commission Inquiries', () => {
    it('saves and retrieves commission inquiries', async () => {
      const inquiry: CommissionInquiry = {
        id: 'comm-test-1',
        commissionCode: 'COM-9001',
        customerId: 'cust-123',
        itemType: 'Deity Idol',
        deityIconography: 'Ganesha in Tribhanga posture',
        dimensions: '18" H x 12" W',
        finishPreference: 'Antique Temple Patina',
        targetDate: '2026-12-01',
        phoneNumber: '+919876543210',
        inspiredByPortfolioId: 'port-001',
        createdAt: Date.now(),
      };

      await repo.saveCommissionInquiry(inquiry);

      const byCode = await repo.findCommissionInquiryByCode('COM-9001');
      expect(byCode?.itemType).toBe('Deity Idol');
      expect(byCode?.phoneNumber).toBe('+919876543210');
    });
  });

  describe('Snapshot Export & Restore', () => {
    it('exports all entities and restores faithfully', async () => {
      const snapshot = await repo.getSnapshotData();
      expect(snapshot.version).toBe('1.0.0');
      expect(snapshot.products.length).toBe(6);
      expect(snapshot.portfolioPieces.length).toBe(5);

      // Modify state
      await repo.deleteProduct('prod-001');
      let productsAfterDelete = await repo.listProducts();
      expect(productsAfterDelete.length).toBe(5);

      // Restore
      await repo.restoreSnapshotData(snapshot);
      const restored = await repo.listProducts();
      expect(restored.length).toBe(6);
      expect(await repo.findProductById('prod-001')).not.toBeNull();
    });
  });
});

describe('Domain Telemetry and Utilities', () => {
  it('formats paise into INR display strings correctly', () => {
    expect(formatPaiseToInr(280000)).toBe('₹2,80,000'.replace('2,80,000', '2,800')); // Indian locale format ₹2,800
    expect(formatPaiseToInr(80000)).toContain('800');
    expect(formatPaiseToInr(450000)).toContain('4,500');
  });

  it('calculates shipping costs correctly (free above ₹2,500, flat ₹150 below)', () => {
    // 250000 paise = ₹2,500 -> free shipping
    expect(calculateShippingPaise(250000)).toBe(0);
    expect(calculateShippingPaise(350000)).toBe(0);

    // Below ₹2,500 -> ₹150 (15000 paise)
    expect(calculateShippingPaise(249900)).toBe(15000);
    expect(calculateShippingPaise(110000)).toBe(15000);
    expect(calculateShippingPaise(0)).toBe(15000);
  });

  it('emits structured domain logs to stdout with correlation ID', () => {
    const log = logDomainEvent('product.created', { id: 'prod-test', name: 'Test' }, 'test-cid-1');
    expect(log.event).toBe('product.created');
    expect(log.correlationId).toBe('test-cid-1');
    expect(log.payload).toEqual({ id: 'prod-test', name: 'Test' });
    expect(log.timestamp).toBeDefined();
  });
});
