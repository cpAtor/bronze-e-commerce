import { describe, it, expect, afterAll } from 'vitest';
import fs from 'node:fs';
import { DrizzleStoreRepository } from './drizzle-repository';
import type { PredefinedProduct, Order, CommissionInquiry, Customer } from '@/domain/types';

describe('DrizzleStoreRepository with SQLite/Turso seam', () => {
  const repo = new DrizzleStoreRepository();

  afterAll(() => {
    if (fs.existsSync('local.db')) {
      try {
        fs.unlinkSync('local.db');
      } catch {}
    }
  });

  describe('Predefined Products in SQL', () => {
    it('initializes and seeds the 6 predefined products automatically', async () => {
      const products = await repo.listProducts();
      expect(products.length).toBeGreaterThanOrEqual(6);
      expect(products[0]).toHaveProperty('id');
      expect(products[0]).toHaveProperty('name');
      expect(products[0]).toHaveProperty('pricePaise');
      expect(Array.isArray(products[0].images)).toBe(true);
      expect(typeof products[0].createdAt).toBe('number');
    });

    it('finds a product by slug and id', async () => {
      const products = await repo.listProducts();
      const first = products[0];

      const bySlug = await repo.findProductBySlug(first.slug);
      expect(bySlug).not.toBeNull();
      expect(bySlug?.id).toBe(first.id);

      const byId = await repo.findProductById(first.id);
      expect(byId).not.toBeNull();
      expect(byId?.slug).toBe(first.slug);
    });

    it('creates, updates, and deletes a product in SQL', async () => {
      const newProduct: PredefinedProduct = {
        id: 'test-drizzle-prod-1',
        name: 'Drizzle Cast Bell',
        slug: 'drizzle-cast-bell',
        description: 'Cast using LibSQL',
        pricePaise: 250000,
        weight: '1.2 kg',
        dimensions: '6 inches',
        alloyDescription: 'Panchaloha alloy',
        careGuide: 'Wipe clean',
        stockQuantity: 10,
        images: ['/images/test.jpg'],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await repo.saveProduct(newProduct);
      const fetched = await repo.findProductById(newProduct.id);
      expect(fetched?.name).toBe('Drizzle Cast Bell');

      // Update
      const updated = { ...newProduct, name: 'Drizzle Cast Bell (Updated)' };
      await repo.saveProduct(updated);
      const refetched = await repo.findProductById(newProduct.id);
      expect(refetched?.name).toBe('Drizzle Cast Bell (Updated)');

      // Delete
      await repo.deleteProduct(newProduct.id);
      const deleted = await repo.findProductById(newProduct.id);
      expect(deleted).toBeNull();
    });
  });

  describe('Orders in SQL', () => {
    it('saves and retrieves orders', async () => {
      const customer: Customer = {
        id: 'cust-drizzle-1',
        googleId: 'google-drizzle-1',
        email: 'dev@example.com',
        name: 'Dev User',
        createdAt: Date.now(),
      };
      await repo.saveCustomer(customer);

      const order: Order = {
        id: 'ord-drizzle-1',
        orderCode: 'ORD-9999',
        customerId: customer.id,
        items: [
          {
            productId: 'prod-kalash',
            productName: 'Bronze Kalash',
            quantity: 1,
            unitPricePaise: 420000,
          },
        ],
        shippingAddress: {
          fullName: 'Dev User',
          addressLine1: 'Atelier Lane',
          city: 'Swamimalai',
          state: 'Tamil Nadu',
          postalCode: '612302',
          country: 'India',
        },
        shippingCostPaise: 0,
        totalPaise: 420000,
        status: 'Ordered',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await repo.saveOrder(order);
      const fetched = await repo.findOrderByCode('ORD-9999');
      expect(fetched).not.toBeNull();
      expect(fetched?.orderCode).toBe('ORD-9999');
      expect(fetched?.items[0].unitPricePaise).toBe(420000);
      expect(fetched?.shippingAddress.city).toBe('Swamimalai');
    });
  });

  describe('Commission Inquiries in SQL', () => {
    it('saves and retrieves commission inquiries', async () => {
      const customer: Customer = {
        id: 'cust-drizzle-2',
        googleId: 'google-drizzle-2',
        email: 'patron@example.com',
        name: 'Patron',
        createdAt: Date.now(),
      };
      await repo.saveCustomer(customer);

      const inquiry: CommissionInquiry = {
        id: 'inq-drizzle-1',
        commissionCode: 'COM-8888',
        customerId: customer.id,
        itemType: 'Temple Murti',
        deityIconography: 'Ganesha',
        dimensions: '24 inches',
        finishPreference: 'Antique Patina',
        targetDate: '2026-12-01',
        phoneNumber: '9078814372',
        createdAt: Date.now(),
      };

      await repo.saveCommissionInquiry(inquiry);
      const fetched = await repo.findCommissionInquiryByCode('COM-8888');
      expect(fetched).not.toBeNull();
      expect(fetched?.deityIconography).toBe('Ganesha');
    });
  });
});
