import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, GET } from './route';
import { getStoreRepository } from '@/repositories';
import { InMemoryStoreRepository } from '@/repositories/in-memory-repository';

describe('Orders API Route (/api/orders)', () => {
  beforeEach(() => {
    const repo = getStoreRepository();
    if (repo instanceof InMemoryStoreRepository) {
      repo.resetToSeed();
    }
  });

  const validOrderPayload = {
    customerEmail: 'kavitha@example.com',
    customerName: 'Kavitha Raman',
    customerPhone: '+919876543210',
    items: [
      {
        productId: 'prod-002',
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Kavitha Raman',
      addressLine1: '14 Sannadhi Street',
      city: 'Madurai',
      state: 'Tamil Nadu',
      postalCode: '625001',
      country: 'India',
      phone: '+919876543210',
    },
  };

  it('rejects POST with missing body or empty items with HTTP 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validOrderPayload,
        items: [],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/at least one item/i);
  });

  it('rejects POST with missing shipping address with HTTP 400', async () => {
    const req = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validOrderPayload,
        shippingAddress: null,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/shipping address is required/i);
  });

  it('successfully creates an order via POST with HTTP 201 and ORD-XXXX code', async () => {
    const req = new NextRequest('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-correlation-id': 'test-corr-api-1',
      },
      body: JSON.stringify(validOrderPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.order).toBeDefined();
    expect(data.order.orderCode).toMatch(/^ORD-[A-Z0-9]{4}$/);
    expect(data.order.status).toBe('Ordered');
    expect(res.headers.get('x-correlation-id')).toBe('test-corr-api-1');

    // Verify GET /api/orders?code=...
    const getReq = new NextRequest(
      `http://localhost:3000/api/orders?code=${data.order.orderCode}`
    );
    const getRes = await GET(getReq);
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.order.orderCode).toBe(data.order.orderCode);
    expect(getData.order.id).toBe(data.order.id);
  });

  it('returns HTTP 404 for nonexistent order code in GET', async () => {
    const req = new NextRequest('http://localhost:3000/api/orders?code=ORD-9999');
    const res = await GET(req);
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toMatch(/not found/i);
  });

  it('returns HTTP 400 for GET when no query parameters are provided', async () => {
    const req = new NextRequest('http://localhost:3000/api/orders');
    const res = await GET(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/required/i);
  });
});
