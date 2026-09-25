import { DefaultAdminService } from '@/services/admin.service';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import type { AdminTabKey } from '@/components/admin/AdminTabs';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const adminService = new DefaultAdminService();

  const [products, portfolio, orders, inquiries] = await Promise.all([
    adminService.getAllProducts(),
    adminService.getAllPortfolioPieces(),
    adminService.getAllOrders(),
    adminService.getAllCommissionInquiries(),
  ]);

  const validTab: AdminTabKey =
    tab === 'portfolio' || tab === 'orders' || tab === 'inquiries'
      ? tab
      : 'products';

  return (
    <AdminDashboard
      initialProducts={products}
      initialPortfolio={portfolio}
      initialOrders={orders}
      initialInquiries={inquiries}
      defaultTab={validTab}
    />
  );
}
