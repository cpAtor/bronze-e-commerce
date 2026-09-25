import { notFound } from 'next/navigation';
import { DefaultAdminService } from '@/services/admin.service';
import { AdminNav } from '@/components/admin/AdminNav';
import { ProductForm } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const adminService = new DefaultAdminService();
  const product = await adminService.getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-heritage-dark text-heritage-cream pb-20">
      <AdminNav currentTab="products" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ProductForm initialProduct={product} isEdit={true} />
      </main>
    </div>
  );
}
