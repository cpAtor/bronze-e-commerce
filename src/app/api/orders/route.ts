import { NextRequest, NextResponse } from 'next/server';
import { ProductCatalogService } from '@/services/product-catalog.service';
import { generateCorrelationId } from '@/domain/events';
import type { CreateOrderInput } from '@/domain/types';

export async function POST(req: NextRequest) {
  const correlationId =
    req.headers.get('x-correlation-id') || generateCorrelationId();

  try {
    const body = (await req.json()) as any;

    if (!body) {
      return NextResponse.json(
        { error: 'Missing request body' },
        { status: 400, headers: { 'x-correlation-id': correlationId } }
      );
    }

    const service = new ProductCatalogService();
    const order = await service.placeOrder(body as CreateOrderInput, correlationId);

    return NextResponse.json(
      { success: true, order },
      { status: 201, headers: { 'x-correlation-id': correlationId } }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to place order';

    // Distinguish validation errors from internal server errors
    const isValidationError =
      message.includes('required') ||
      message.includes('at least one item') ||
      message.includes('Invalid') ||
      message.includes('not found with ID');

    const status = isValidationError ? 400 : 500;

    return NextResponse.json(
      { error: message },
      { status, headers: { 'x-correlation-id': correlationId } }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const customerId = searchParams.get('customerId');

  const service = new ProductCatalogService();

  if (code) {
    const order = await service.getOrderByCode(code.trim().toUpperCase());
    if (!order) {
      return NextResponse.json(
        { error: `Order with reference code ${code} not found` },
        { status: 404 }
      );
    }
    return NextResponse.json({ order }, { status: 200 });
  }

  if (customerId) {
    const orders = await service.getOrdersByCustomer(customerId.trim());
    return NextResponse.json({ orders }, { status: 200 });
  }

  return NextResponse.json(
    { error: 'Query parameter "code" or "customerId" is required' },
    { status: 400 }
  );
}
