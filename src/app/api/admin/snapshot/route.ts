import { NextResponse } from 'next/server';
import { DefaultAdminService } from '@/services/admin.service';
import { generateCorrelationId } from '@/domain/events';

export async function GET(request: Request) {
  const correlationId =
    request.headers.get('x-correlation-id') || generateCorrelationId();

  try {
    const adminService = new DefaultAdminService();
    const snapshot = await adminService.exportSnapshot(correlationId);
    return NextResponse.json({ success: true, snapshot });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to export snapshot' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const correlationId =
    request.headers.get('x-correlation-id') || generateCorrelationId();

  try {
    const body = await request.json();
    const adminService = new DefaultAdminService();
    await adminService.restoreSnapshot(body.snapshot, correlationId);
    return NextResponse.json({ success: true, message: 'Snapshot restored successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to restore snapshot' },
      { status: 400 }
    );
  }
}
