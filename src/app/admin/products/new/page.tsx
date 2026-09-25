import { AdminNav } from '@/components/admin/AdminNav';
import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-heritage-dark text-heritage-cream pb-20">
      <AdminNav currentTab="products" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ProductForm isEdit={false} />
      </main>
    </div>
  );
}
