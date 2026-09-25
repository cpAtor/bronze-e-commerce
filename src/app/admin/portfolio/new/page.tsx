import { AdminNav } from '@/components/admin/AdminNav';
import { PortfolioForm } from '@/components/admin/PortfolioForm';

export default function NewPortfolioPage() {
  return (
    <div className="min-h-screen bg-heritage-dark text-heritage-cream pb-20">
      <AdminNav currentTab="portfolio" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <PortfolioForm isEdit={false} />
      </main>
    </div>
  );
}
