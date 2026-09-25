import { NextResponse } from 'next/server';
import { DefaultAdminService } from '@/services/admin.service';

export async function GET() {
  try {
    const adminService = new DefaultAdminService();
    const inquiries = await adminService.getAllCommissionInquiries();
    return NextResponse.json({ success: true, inquiries });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}
