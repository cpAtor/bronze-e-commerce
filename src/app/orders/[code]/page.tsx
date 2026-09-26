import React from 'react';
import type { Metadata } from 'next';
import { ProductCatalogService } from '@/services/product-catalog.service';
import { OrderTrackerView } from '@/components/shop/OrderTrackerView';

export const revalidate = 0; // Dynamic rendering to reflect status updates immediately

interface PageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Order ${code} Status | Heritage Storefront`,
    description: `Track status and dispatch details for order ${code}.`,
  };
}

export default async function OrderStatusPage({ params }: PageProps) {
  const { code } = await params;
  const normalizedCode = code.trim().toUpperCase();

  const service = new ProductCatalogService();
  const order = await service.getOrderByCode(normalizedCode);

  return <OrderTrackerView initialOrder={order} code={normalizedCode} />;
}
