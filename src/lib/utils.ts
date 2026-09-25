import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format price in paise to Indian Rupee currency string.
 * Example: 280000 paise -> "₹2,800"
 */
export function formatPaiseToInr(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Calculate shipping based on subtotal.
 * Free (₹0) above ₹2,500 (250000 paise), else flat ₹150 (15000 paise).
 */
export function calculateShippingPaise(subtotalPaise: number): number {
  const FREE_SHIPPING_THRESHOLD_PAISE = 250000;
  const FLAT_SHIPPING_FEE_PAISE = 15000;

  if (subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE) {
    return 0;
  }
  return FLAT_SHIPPING_FEE_PAISE;
}
