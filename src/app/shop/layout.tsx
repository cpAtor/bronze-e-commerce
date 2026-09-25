import React from 'react';
import { CartProvider } from '@/components/shop/CartContext';
import { CartDrawer } from '@/components/shop/CartDrawer';
import { CheckoutModal } from '@/components/shop/CheckoutModal';
import { FloatingCartButton } from '@/components/shop/FloatingCartButton';

export const metadata = {
  title: 'Artisanal Bronze Wares | Heritage Storefront',
  description:
    'Handcrafted sacred Panchaloha vessels, traditional bell-metal tableware, and ritual bronze objects forged in Tamil Nadu.',
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="relative min-h-screen">
        {children}
        <CartDrawer />
        <CheckoutModal />
        <FloatingCartButton />
      </div>
    </CartProvider>
  );
}
