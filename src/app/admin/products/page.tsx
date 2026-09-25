import { DefaultAdminService } from '@/services/admin.service';
import { AdminNav } from '@/components/admin/AdminNav';
import { AdminTabs } from '@/components/admin/AdminTabs';
import { ProductTable } from '@/components/admin/ProductTable';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const adminService = new DefaultAdminService();
  const [products, portfolio, orders, inquiries] = await Promise.all([
    adminService.getAllProducts(),
    adminService.getAllPortfolioPieces(),
    adminService.getAllOrders(),
    adminService.getAllCommissionInquiries(),
  ]);

  return (
    <div className="min-h-screen bg-heritage-dark text-heritage-cream pb-20">
      <AdminNav currentTab="products" />
      <AdminTabs
        activeTab="products"
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
            Predefined Products Catalog
          </h1>
          <p className="text-xs text-heritage-muted mt-1">
            Manage your retail catalog. All additions, edits, and deletions reflect instantly across the storefront (/shop).
          </p>
        </div>

        <ProductTable initialProducts={products} />
      </main>
    </div>
  );
}
