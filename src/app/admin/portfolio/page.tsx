import { DefaultAdminService } from '@/services/admin.service';
import { AdminNav } from '@/components/admin/AdminNav';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { PortfolioTable } from '@/components/admin/PortfolioTable';

export const dynamic = 'force-dynamic';

export default async function AdminPortfolioPage() {
  const adminService = new DefaultAdminService();
  const [products, portfolio, orders, inquiries] = await Promise.all([
    adminService.getAllProducts(),
    adminService.getAllPortfolioPieces(),
    adminService.getAllOrders(),
    adminService.getAllCommissionInquiries(),
  ]);

  return (
    <div className="min-h-screen bg-heritage-dark text-heritage-cream pb-20">
      <AdminNav currentTab="portfolio" />
      <AdminTabs
        activeTab="portfolio"
        counts={{
          products: products.length,
          portfolio: portfolio.length,
          orders: orders.length,
          inquiries: inquiries.length,
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-heritage-cream">
            Portfolio Masterwork Showcase
          </h1>
          <p className="text-xs text-heritage-muted mt-1">
            Manage showcase pieces, lost-wax casting technique notes, dimensions, and finishes. Reflects directly on /custom-work.
          </p>
        </div>

        <PortfolioTable initialPieces={portfolio} />
      </main>
    </div>
  );
}
