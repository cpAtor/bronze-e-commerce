/**
 * Domain types for Bronze Craft & Temple Commissions Storefront.
 * Aligns with CONTEXT.md and spec.md.
 */

export type OrderStatus = 'Ordered' | 'Shipped';

export interface PredefinedProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricePaise: number; // Stored in paise (integer) e.g. 280000 = ₹2,800
  weight: string; // e.g. "850g", "1.4kg"
  dimensions: string; // e.g. "15cm x 10cm"
  alloyDescription: string; // e.g. "Traditional Panchaloha (copper, zinc, tin, lead, silver)"
  careGuide: string; // Care instructions
  stockQuantity: number;
  images: string[];
  createdAt: number; // Unix timestamp ms
  updatedAt: number;
}

export interface PortfolioPiece {
  id: string;
  name: string;
  slug: string;
  description: string;
  referenceDimensions: string; // e.g. "24\" H x 18\" W"
  castingTechnique: string; // e.g. "Cire perdue (lost-wax casting)"
  finishOptions: string[]; // e.g. ["Antique Patina", "Mirror Polish"]
  typicalLeadTime: string; // e.g. "6–8 weeks"
  images: string[];
  createdAt: number;
  updatedAt: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPricePaise: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderCode: string; // e.g. "ORD-1001"
  customerId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingCostPaise: number; // 0 if >= ₹2,500, else 15000 (₹150)
  totalPaise: number;
  status: OrderStatus;
  courierTrackingUrl?: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface CommissionInquiry {
  id: string;
  commissionCode: string; // e.g. "COM-1001"
  customerId: string;
  itemType: string; // e.g. "Deity Idol", "Prabhavali Arch"
  deityIconography: string;
  dimensions: string;
  finishPreference: string;
  targetDate: string;
  phoneNumber: string; // Phone number for off-platform callback
  inspiredByPortfolioId?: string | null;
  createdAt: number;
}

export interface Customer {
  id: string;
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  createdAt: number;
}

export interface StoreSnapshot {
  version: string;
  exportedAt: number;
  products: PredefinedProduct[];
  portfolioPieces: PortfolioPiece[];
  orders: Order[];
  commissionInquiries: CommissionInquiry[];
  customers: Customer[];
}
