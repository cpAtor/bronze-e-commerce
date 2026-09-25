import { notFound } from 'next/navigation';
import { DefaultAdminService } from '@/services/admin.service';
import { AdminNav } from '@/components/admin/AdminNav';
import { PortfolioForm } from '@/components/admin/PortfolioForm';

export const dynamic = 'force-dynamic';

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const adminService = new DefaultAdminService();
  const piece = await adminService.getPortfolioPieceById(id);

  if (!piece) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-heritage-dark text-heritage-cream pb-20">
      <AdminNav currentTab="portfolio" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <PortfolioForm initialPiece={piece} isEdit={true} />
      </main>
    </div>
  );
}
