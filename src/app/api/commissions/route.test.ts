import { describe, it, expect, beforeEach } from 'vitest';
import { POST, GET } from './route';
import { NextRequest } from 'next/server';
import { getStoreRepository } from '@/repositories';
import { InMemoryStoreRepository } from '@/repositories/in-memory-repository';

describe('Commission API Route (/api/commissions)', () => {
  beforeEach(() => {
    const repo = getStoreRepository();
    if (repo instanceof InMemoryStoreRepository) {
      repo.resetToSeed();
    }
  });

  const validPayload = {
    phoneNumber: '+91 98765 43210',
    itemType: 'Deity Idol / Murti',
    deityIconography: 'Bespoke Shiva Nataraja in ananda tandava pose',
    dimensions: '30" H x 20" W',
    finishPreference: 'Antique Temple Patina',
    targetDate: '2026-11-15',
    customerName: 'Anand Raman',
    customerEmail: 'anand@example.com',
    inspiredByPortfolioId: 'port-001',
  };

  it('POST /api/commissions creates inquiry and returns 201 with COM-XXXX code', async () => {
    const req = new NextRequest('http://localhost:3000/api/commissions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-correlation-id': 'test-corr-api-1',
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.inquiry).toBeDefined();
    expect(data.inquiry.commissionCode).toMatch(/^COM-[A-Z0-9]{4}$/);
    expect(data.inquiry.phoneNumber).toBe('+91 98765 43210');
  });

  it('POST /api/commissions returns 400 when mandatory phoneNumber is missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/commissions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...validPayload, phoneNumber: '' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/phone number/i);
  });

  it('GET /api/commissions?code=COM-XXXX retrieves existing inquiry', async () => {
    // First create an inquiry
    const createReq = new NextRequest('http://localhost:3000/api/commissions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    });
    const createRes = await POST(createReq);
    const createdData = await createRes.json();
    const code = createdData.inquiry.commissionCode;

    // Now query by code
    const getReq = new NextRequest(`http://localhost:3000/api/commissions?code=${code}`);
    const getRes = await GET(getReq);
    expect(getRes.status).toBe(200);
    const getData = await getRes.json();
    expect(getData.inquiry).toBeDefined();
    expect(getData.inquiry.commissionCode).toBe(code);
  });

  it('GET /api/commissions returns 404 for unknown code', async () => {
    const getReq = new NextRequest('http://localhost:3000/api/commissions?code=COM-9999');
    const getRes = await GET(getReq);
    expect(getRes.status).toBe(404);
  });
});
