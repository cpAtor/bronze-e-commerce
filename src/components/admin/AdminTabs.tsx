'use client';

import Link from 'next/link';
import { Package, Sparkles, ShoppingCart, MessageSquare } from 'lucide-react';

export type AdminTabKey = 'products' | 'portfolio' | 'orders' | 'inquiries';

interface TabItem {
  key: AdminTabKey;
  label: string;
  href: string;
  icon: typeof Package;
  count?: number;
}

interface AdminTabsProps {
  activeTab: AdminTabKey;
  counts?: {
    products?: number;
    portfolio?: number;
    orders?: number;
    inquiries?: number;
  };
  onSelectTab?: (tab: AdminTabKey) => void;
}

export function AdminTabs({ activeTab, counts, onSelectTab }: AdminTabsProps) {
  const tabs: TabItem[] = [
    {
      key: 'products',
      label: 'Products',
      href: '/admin/products',
      icon: Package,
      count: counts?.products,
    },
    {
      key: 'portfolio',
      label: 'Portfolio',
      href: '/admin/portfolio',
      icon: Sparkles,
      count: counts?.portfolio,
    },
    {
      key: 'orders',
      label: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
      count: counts?.orders,
    },
    {
      key: 'inquiries',
      label: 'Inquiries',
      href: '/admin/inquiries',
      icon: MessageSquare,
      count: counts?.inquiries,
    },
  ];

  return (
    <div className="w-full border-b border-heritage-border bg-heritage-surface/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex space-x-2 sm:space-x-3 overflow-x-auto py-2.5 no-scrollbar"
          aria-label="Admin Navigation Tabs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            const buttonClasses = `shrink-0 inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all whitespace-nowrap min-h-[44px] min-w-[44px] ${
              isActive
                ? 'bg-heritage-cream text-heritage-dark shadow-md shadow-black/20 font-semibold'
                : 'text-heritage-muted hover:text-heritage-cream hover:bg-heritage-cream/10 active:scale-[0.98]'
            }`;

            if (onSelectTab) {
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onSelectTab(tab.key)}
                  className={buttonClasses}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        isActive
                          ? 'bg-heritage-dark text-heritage-cream'
                          : 'bg-heritage-border text-heritage-cream'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            }

            return (
              <Link
                key={tab.key}
                href={tab.href}
                className={buttonClasses}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-heritage-dark text-heritage-cream'
                        : 'bg-heritage-border text-heritage-cream'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
