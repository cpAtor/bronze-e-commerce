import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DefaultAdminService } from './admin.service';
import { InMemoryStoreRepository } from '@/repositories/in-memory-repository';
import type { CreateProductInput, CreatePortfolioPieceInput, Order } from '@/domain/types';

describe('DefaultAdminService', () => {
  let repo: InMemoryStoreRepository;
  let service: DefaultAdminService;

  beforeEach(() => {
    repo = new InMemoryStoreRepository();
    service = new DefaultAdminService(repo);
    vi.restoreAllMocks();
  });

  describe('Product CRUD', () => {
    it('retrieves all initial products', async () => {
      const products = await service.getAllProducts();
      expect(products).toHaveLength(6);
    });

    it('retrieves a product by id', async () => {
      const product = await service.getProductById('prod-001');
      expect(product).toBeDefined();
      expect(product?.name).toBe('Traditional Bronze Kalash (Lota)');
    });

    it('returns null when product id does not exist', async () => {
      const product = await service.getProductById('non-existent-id');
      expect(product).toBeNull();
    });

    it('creates a new product and reflects immediately in repository', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const input: CreateProductInput = {
        name: 'Sacred Nandi Figurine',
        slug: 'sacred-nandi-figurine',
        description: 'Handcrafted sacred bull Nandi in solid panchaloha bronze.',
        pricePaise: 350000,
        weight: '1.8 kg',
        dimensions: '14cm x 8cm x 12cm',
        alloyDescription: 'Traditional Panchaloha alloy',
        careGuide: 'Clean with lemon and tamarind paste',
        stockQuantity: 5,
        images: ['/images/products/nandi.jpg'],
      };

      const created = await service.createProduct(input, 'test-correlation-101');

      expect(created.id).toBeDefined();
      expect(created.name).toBe(input.name);
      expect(created.slug).toBe(input.slug);
      expect(created.pricePaise).toBe(350000);
      expect(created.stockQuantity).toBe(5);
      expect(created.createdAt).toBeGreaterThan(0);
      expect(created.updatedAt).toBeGreaterThan(0);

      // Verify immediate reflection in repo
      const fetched = await service.getProductById(created.id);
      expect(fetched).toEqual(created);

      const all = await service.getAllProducts();
      expect(all).toHaveLength(7);
      expect(all.some((p) => p.id === created.id)).toBe(true);

      // Verify domain event emitted
      expect(consoleSpy).toHaveBeenCalled();
      const loggedJson = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(loggedJson.event).toBe('product.created');
      expect(loggedJson.correlationId).toBe('test-correlation-101');
      expect(loggedJson.payload.id).toBe(created.id);
    });

    it('rejects creation when slug already exists', async () => {
      const input: CreateProductInput = {
        name: 'Duplicate Kalash',
        slug: 'traditional-bronze-kalash', // already exists as prod-001
        description: 'Duplicate slug test',
        pricePaise: 200000,
        weight: '1 kg',
        dimensions: '10cm x 10cm',
        alloyDescription: 'Bronze',
        careGuide: 'Wipe clean',
        stockQuantity: 2,
        images: ['/img.jpg'],
      };

      await expect(service.createProduct(input)).rejects.toThrow(/already exists/i);
    });

    it('rejects product creation with negative price or stock', async () => {
      const invalidPriceInput: CreateProductInput = {
        name: 'Bad Price Item',
        slug: 'bad-price-item',
        description: 'Test',
        pricePaise: -500,
        weight: '1kg',
        dimensions: '10x10',
        alloyDescription: 'Alloy',
        careGuide: 'Guide',
        stockQuantity: 5,
        images: [],
      };
      await expect(service.createProduct(invalidPriceInput)).rejects.toThrow(/price/i);

      const invalidStockInput: CreateProductInput = {
        ...invalidPriceInput,
        slug: 'bad-stock-item',
        pricePaise: 10000,
        stockQuantity: -1,
      };
      await expect(service.createProduct(invalidStockInput)).rejects.toThrow(/stock/i);
    });

    it('updates an existing product and logs domain event', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const updated = await service.updateProduct(
        'prod-001',
        {
          name: 'Updated Bronze Kalash (Lota)',
          pricePaise: 299900,
          stockQuantity: 15,
        },
        'test-update-cid'
      );

      expect(updated.id).toBe('prod-001');
      expect(updated.name).toBe('Updated Bronze Kalash (Lota)');
      expect(updated.pricePaise).toBe(299900);
      expect(updated.stockQuantity).toBe(15);

      const fetched = await service.getProductById('prod-001');
      expect(fetched?.name).toBe('Updated Bronze Kalash (Lota)');
      expect(fetched?.pricePaise).toBe(299900);

      // Verify domain event
      expect(consoleSpy).toHaveBeenCalled();
      const loggedJson = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(loggedJson.event).toBe('product.updated');
      expect(loggedJson.correlationId).toBe('test-update-cid');
      expect(loggedJson.payload.id).toBe('prod-001');
    });

    it('rejects update if product does not exist', async () => {
      await expect(
        service.updateProduct('prod-999', { name: 'Non Existent' })
      ).rejects.toThrow(/not found/i);
    });

    it('rejects update if new slug conflicts with another product', async () => {
      await expect(
        service.updateProduct('prod-001', { slug: 'handcrafted-bronze-water-bottle' })
      ).rejects.toThrow(/already exists/i);
    });

    it('deletes an existing product and logs domain event', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      await service.deleteProduct('prod-001', 'test-del-cid');

      const fetched = await service.getProductById('prod-001');
      expect(fetched).toBeNull();

      const all = await service.getAllProducts();
      expect(all).toHaveLength(5);
      expect(all.some((p) => p.id === 'prod-001')).toBe(false);

      expect(consoleSpy).toHaveBeenCalled();
      const loggedJson = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(loggedJson.event).toBe('product.deleted');
      expect(loggedJson.correlationId).toBe('test-del-cid');
      expect(loggedJson.payload.id).toBe('prod-001');
    });

    it('throws error when deleting non-existent product', async () => {
      await expect(service.deleteProduct('prod-missing')).rejects.toThrow(/not found/i);
    });
  });

  describe('Portfolio CRUD', () => {
    it('retrieves all initial portfolio pieces', async () => {
      const pieces = await service.getAllPortfolioPieces();
      expect(pieces).toHaveLength(5);
    });

    it('retrieves portfolio piece by id', async () => {
      const piece = await service.getPortfolioPieceById('port-001');
      expect(piece).toBeDefined();
      expect(piece?.name).toBe('Nataraja Ananda Tandava Murti');
    });

    it('creates a new portfolio piece and reflects immediately in repository', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const input: CreatePortfolioPieceInput = {
        name: 'Mahavishnu Anantasayana',
        slug: 'mahavishnu-anantasayana',
        description: 'Reclining Vishnu on Adisesha with Lakshmi at feet.',
        referenceDimensions: '36" L x 18" H x 12" D (approx. 45 kg)',
        castingTechnique: 'Traditional lost-wax Madhuchishtavidhana with solid core',
        finishOptions: ['Antique Patina', 'Gold Leaf Accents'],
        typicalLeadTime: '12–14 weeks',
        images: ['/images/portfolio/vishnu.jpg'],
      };

      const created = await service.createPortfolioPiece(input, 'cid-port-create');
      expect(created.id).toBeDefined();
      expect(created.name).toBe(input.name);
      expect(created.slug).toBe(input.slug);
      expect(created.finishOptions).toEqual(input.finishOptions);

      const fetched = await service.getPortfolioPieceById(created.id);
      expect(fetched).toEqual(created);

      const all = await service.getAllPortfolioPieces();
      expect(all).toHaveLength(6);

      expect(consoleSpy).toHaveBeenCalled();
      const loggedJson = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(loggedJson.event).toBe('portfolio.created');
      expect(loggedJson.correlationId).toBe('cid-port-create');
    });

    it('rejects portfolio piece creation with duplicate slug', async () => {
      const input: CreatePortfolioPieceInput = {
        name: 'Duplicate Nataraja',
        slug: 'nataraja-ananda-tandava-murti',
        description: 'Test duplicate',
        referenceDimensions: '24" H',
        castingTechnique: 'Lost wax',
        finishOptions: ['Patina'],
        typicalLeadTime: '8 weeks',
        images: [],
      };
      await expect(service.createPortfolioPiece(input)).rejects.toThrow(/already exists/i);
    });

    it('updates an existing portfolio piece and logs domain event', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const updated = await service.updatePortfolioPiece(
        'port-001',
        {
          typicalLeadTime: '10–12 weeks',
          referenceDimensions: '28" H x 20" W x 10" D',
        },
        'cid-port-update'
      );

      expect(updated.typicalLeadTime).toBe('10–12 weeks');
      expect(updated.referenceDimensions).toBe('28" H x 20" W x 10" D');

      const fetched = await service.getPortfolioPieceById('port-001');
      expect(fetched?.typicalLeadTime).toBe('10–12 weeks');

      expect(consoleSpy).toHaveBeenCalled();
      const loggedJson = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(loggedJson.event).toBe('portfolio.updated');
      expect(loggedJson.correlationId).toBe('cid-port-update');
    });

    it('rejects updating non-existent portfolio piece', async () => {
      await expect(
        service.updatePortfolioPiece('port-fake', { name: 'Ghost' })
      ).rejects.toThrow(/not found/i);
    });

    it('rejects updating portfolio piece if new slug conflicts with another piece', async () => {
      await expect(
        service.updatePortfolioPiece('port-001', { slug: 'temple-prabhavali-arch' })
      ).rejects.toThrow(/already exists/i);
    });

    it('deletes an existing portfolio piece and logs domain event', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      await service.deletePortfolioPiece('port-001', 'cid-port-del');

      const fetched = await service.getPortfolioPieceById('port-001');
      expect(fetched).toBeNull();

      const all = await service.getAllPortfolioPieces();
      expect(all).toHaveLength(4);

      expect(consoleSpy).toHaveBeenCalled();
      const loggedJson = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(loggedJson.event).toBe('portfolio.deleted');
      expect(loggedJson.correlationId).toBe('cid-port-del');
    });

    it('rejects deleting non-existent portfolio piece', async () => {
      await expect(service.deletePortfolioPiece('port-none')).rejects.toThrow(/not found/i);
    });
  });

  describe('Order and Commission Management', () => {
    it('retrieves all orders and gets an order by id', async () => {
      const initialOrders = await service.getAllOrders();
      expect(Array.isArray(initialOrders)).toBe(true);

      // Save a sample order to repo
      const sampleOrder: Order = {
        id: 'ord-test-1',
        orderCode: 'ORD-1001',
        customerId: 'cust-1',
        items: [
          {
            productId: 'prod-001',
            productName: 'Traditional Bronze Kalash',
            quantity: 1,
            unitPricePaise: 280000,
          },
        ],
        shippingAddress: {
          fullName: 'Sundaram Iyer',
          addressLine1: '12 Car Street',
          city: 'Thanjavur',
          state: 'Tamil Nadu',
          postalCode: '613001',
          country: 'India',
        },
        shippingCostPaise: 0,
        totalPaise: 280000,
        status: 'Ordered',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await repo.saveOrder(sampleOrder);

      const orders = await service.getAllOrders();
      expect(orders).toHaveLength(initialOrders.length + 1);

      const fetched = await service.getOrderById('ord-test-1');
      expect(fetched?.orderCode).toBe('ORD-1001');
      expect(fetched?.status).toBe('Ordered');
    });

    it('marks an order as shipped and logs domain event', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const sampleOrder: Order = {
        id: 'ord-test-2',
        orderCode: 'ORD-1002',
        customerId: 'cust-2',
        items: [],
        shippingAddress: {
          fullName: 'Meenakshi Raman',
          addressLine1: '45 South Mada St',
          city: 'Chennai',
          state: 'Tamil Nadu',
          postalCode: '600004',
          country: 'India',
        },
        shippingCostPaise: 15000,
        totalPaise: 150000,
        status: 'Ordered',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await repo.saveOrder(sampleOrder);

      const trackingUrl = 'https://bluedart.com/track?ref=BD987654';
      const updated = await service.markOrderShipped('ord-test-2', trackingUrl, 'cid-ship-1');

      expect(updated.status).toBe('Shipped');
      expect(updated.courierTrackingUrl).toBe(trackingUrl);

      const fetched = await service.getOrderById('ord-test-2');
      expect(fetched?.status).toBe('Shipped');
      expect(fetched?.courierTrackingUrl).toBe(trackingUrl);

      expect(consoleSpy).toHaveBeenCalled();
      const loggedJson = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(loggedJson.event).toBe('order.shipped');
      expect(loggedJson.correlationId).toBe('cid-ship-1');
      expect(loggedJson.payload.orderId).toBe('ord-test-2');
    });

    it('throws when marking non-existent order as shipped', async () => {
      await expect(
        service.markOrderShipped('ord-non-existent', 'https://track.com')
      ).rejects.toThrow(/not found/i);
    });

    it('retrieves commission inquiries and by id', async () => {
      const inquiries = await service.getAllCommissionInquiries();
      expect(Array.isArray(inquiries)).toBe(true);

      const inquiry = {
        id: 'inq-test-1',
        commissionCode: 'COM-1001',
        customerId: 'cust-1',
        itemType: 'Deity Idol / Murti',
        deityIconography: 'Lord Murugan with Vel and peacock',
        dimensions: '18" H x 10" W',
        finishPreference: 'Antique Patina',
        targetDate: '2026-12-01',
        phoneNumber: '+919876543210',
        createdAt: Date.now(),
      };
      await repo.saveCommissionInquiry(inquiry);

      const all = await service.getAllCommissionInquiries();
      expect(all).toHaveLength(inquiries.length + 1);

      const fetched = await service.getCommissionInquiryById('inq-test-1');
      expect(fetched?.commissionCode).toBe('COM-1001');
      expect(fetched?.phoneNumber).toBe('+919876543210');
    });
  });

  describe('Snapshot Export & Restore', () => {
    it('exports snapshot and logs domain event', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const snapshot = await service.exportSnapshot('cid-snap-exp');

      expect(snapshot.version).toBeDefined();
      expect(snapshot.products).toHaveLength(6);
      expect(snapshot.portfolioPieces).toHaveLength(5);

      expect(consoleSpy).toHaveBeenCalled();
      const loggedJson = JSON.parse(consoleSpy.mock.calls[0][0]);
      expect(loggedJson.event).toBe('snapshot.exported');
      expect(loggedJson.correlationId).toBe('cid-snap-exp');
    });

    it('restores snapshot and logs domain event', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const initialSnapshot = await service.exportSnapshot();

      // Delete an item
      await service.deleteProduct('prod-001');
      expect(await service.getAllProducts()).toHaveLength(5);

      // Restore snapshot
      await service.restoreSnapshot(initialSnapshot, 'cid-snap-rst');
      expect(await service.getAllProducts()).toHaveLength(6);
      expect(await service.getProductById('prod-001')).toBeDefined();

      expect(consoleSpy).toHaveBeenCalled();
      const calls = consoleSpy.mock.calls.map((c) => JSON.parse(c[0]));
      const restoreLog = calls.find((c) => c.event === 'snapshot.restored');
      expect(restoreLog).toBeDefined();
      expect(restoreLog.correlationId).toBe('cid-snap-rst');
    });
  });
});
