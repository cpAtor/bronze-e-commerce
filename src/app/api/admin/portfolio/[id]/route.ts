import { NextResponse } from 'next/server';
import { DefaultAdminService } from '@/services/admin.service';
import { generateCorrelationId } from '@/domain/events';
import type { UpdatePortfolioPieceInput } from '@/domain/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminService = new DefaultAdminService();
    const piece = await adminService.getPortfolioPieceById(id);

    if (!piece) {
      return NextResponse.json(
        { success: false, error: `Portfolio piece with id "${id}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, piece });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch portfolio piece' },
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
    const body: UpdatePortfolioPieceInput = await request.json();

    const adminService = new DefaultAdminService();
    const piece = await adminService.updatePortfolioPiece(id, body, correlationId);

    return NextResponse.json({ success: true, piece });
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
    await adminService.deletePortfolioPiece(id, correlationId);

    return NextResponse.json({ success: true, message: `Portfolio piece ${id} deleted` });
  } catch (error: any) {
    const msg = error.message || '';
    if (msg.includes('not found')) {
      return NextResponse.json({ success: false, error: msg }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
