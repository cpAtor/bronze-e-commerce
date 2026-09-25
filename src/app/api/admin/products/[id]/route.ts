import { NextResponse } from 'next/server';
import { DefaultAdminService } from '@/services/admin.service';
import { generateCorrelationId } from '@/domain/events';
import type { UpdateProductInput } from '@/domain/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminService = new DefaultAdminService();
    const product = await adminService.getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: `Product with id "${id}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const correlationId =
    request.headers.get('x-correlation-id') || generateCorrelationId();

  try {
    const { id } = await params;
    const body: UpdateProductInput = await request.json();

    const adminService = new DefaultAdminService();
    const product = await adminService.updateProduct(id, body, correlationId);

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    const msg = error.message || '';
    if (msg.includes('not found')) {
      return NextResponse.json({ success: false, error: msg }, { status: 404 });
    }
    if (msg.includes('already exists')) {
      return NextResponse.json({ success: false, error: msg }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: msg }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const correlationId =
    request.headers.get('x-correlation-id') || generateCorrelationId();

  try {
    const { id } = await params;
    const adminService = new DefaultAdminService();
    await adminService.deleteProduct(id, correlationId);

    return NextResponse.json({ success: true, message: `Product ${id} deleted` });
  } catch (error: any) {
    const msg = error.message || '';
    if (msg.includes('not found')) {
      return NextResponse.json({ success: false, error: msg }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
