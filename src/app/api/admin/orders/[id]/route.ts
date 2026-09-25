import { NextResponse } from 'next/server';
import { DefaultAdminService } from '@/services/admin.service';
import { generateCorrelationId } from '@/domain/events';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminService = new DefaultAdminService();
    const order = await adminService.getOrderById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order with id "${id}" not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const correlationId =
    request.headers.get('x-correlation-id') || generateCorrelationId();

  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.courierTrackingUrl) {
      return NextResponse.json(
        { success: false, error: 'courierTrackingUrl is required' },
        { status: 400 }
      );
    }

    const adminService = new DefaultAdminService();
    const order = await adminService.markOrderShipped(
      id,
      body.courierTrackingUrl,
      correlationId
    );

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    const msg = error.message || '';
    if (msg.includes('not found')) {
      return NextResponse.json({ success: false, error: msg }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
