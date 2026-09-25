import { NextResponse } from 'next/server';
import { DefaultAdminService } from '@/services/admin.service';
import { generateCorrelationId } from '@/domain/events';
import type { CreateProductInput } from '@/domain/types';

export async function GET() {
  try {
    const adminService = new DefaultAdminService();
    const products = await adminService.getAllProducts();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const correlationId =
    request.headers.get('x-correlation-id') || generateCorrelationId();

  try {
    const body: CreateProductInput = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Product name is required' },
        { status: 400 }
      );
    }
    if (!body.slug || !body.slug.trim()) {
      return NextResponse.json(
        { success: false, error: 'Product slug is required' },
        { status: 400 }
      );
    }
    if (body.pricePaise === undefined || body.pricePaise < 0) {
      return NextResponse.json(
        { success: false, error: 'Price must be a non-negative number' },
        { status: 400 }
      );
    }

    const adminService = new DefaultAdminService();
    const product = await adminService.createProduct(body, correlationId);

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    const isConflict = error.message?.includes('already exists');
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: isConflict ? 409 : 400 }
    );
  }
}
