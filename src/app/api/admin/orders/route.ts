import { NextResponse } from 'next/server';
import { DefaultAdminService } from '@/services/admin.service';

export async function GET() {
  try {
    const adminService = new DefaultAdminService();
    const orders = await adminService.getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
