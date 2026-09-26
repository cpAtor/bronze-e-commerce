import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProductCatalogService } from '@/services/product-catalog.service';
import { ProductDetailView } from '@/components/shop/ProductDetailView';

export const revalidate = 0; // Dynamic server-rendered to reflect repository updates instantly

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = new ProductCatalogService();
  const product = await service.getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Heritage Storefront',
    };
  }

  return {
    title: `${product.name} | Heritage Storefront`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = new ProductCatalogService();
  const product = await service.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await service.browseProducts();
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <main className="bg-heritage-dark text-heritage-cream min-h-screen pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetailView product={product} relatedProducts={relatedProducts} />
      </div>
    </main>
  );
}
