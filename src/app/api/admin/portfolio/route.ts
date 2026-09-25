import { NextResponse } from 'next/server';
import { DefaultAdminService } from '@/services/admin.service';
import { generateCorrelationId } from '@/domain/events';
import type { CreatePortfolioPieceInput } from '@/domain/types';

export async function GET() {
  try {
    const adminService = new DefaultAdminService();
    const portfolioPieces = await adminService.getAllPortfolioPieces();
    return NextResponse.json({ success: true, portfolioPieces });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch portfolio pieces' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const correlationId =
    request.headers.get('x-correlation-id') || generateCorrelationId();

  try {
    const body: CreatePortfolioPieceInput = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Portfolio piece name is required' },
        { status: 400 }
      );
    }
    if (!body.slug || !body.slug.trim()) {
      return NextResponse.json(
        { success: false, error: 'Portfolio piece slug is required' },
        { status: 400 }
      );
    }

    const adminService = new DefaultAdminService();
    const piece = await adminService.createPortfolioPiece(body, correlationId);

    return NextResponse.json({ success: true, piece }, { status: 201 });
  } catch (error: any) {
    const isConflict = error.message?.includes('already exists');
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create portfolio piece' },
      { status: isConflict ? 409 : 400 }
    );
  }
}
