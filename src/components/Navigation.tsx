'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, Search, User, Phone, ArrowRight } from 'lucide-react';
import { ADMIN_CONFIG } from '@/lib/config';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { href: '/shop', label: 'Bestsellers & Wares' },
    { href: '/custom-work', label: 'Sanctum Commissions' },
    { href: '/orders', label: 'Track Order' },
    { href: '/admin', label: 'Admin Portal' },
  ];

  return (
    <>
      {/* Sticky Clean Heritage Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-heritage-dark/95 backdrop-blur-md border-b border-heritage-border-light shadow-md shadow-black/20'
            : 'bg-heritage-dark border-b border-heritage-border-light'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Hamburger & Search */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="tap-target p-2 text-heritage-cream/90 hover:text-heritage-cream transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <Link
                href="/shop"
                className="tap-target p-2 text-heritage-cream/90 hover:text-heritage-cream transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>
            </div>

            {/* Center: Brand Monogram / Logo */}
            <Link
              href="/"
              className="flex items-center justify-center group"
              aria-label="Heritage Storefront"
            >
              <div className="flex flex-col items-center">
                {/* Minimalist Heritage Monogram */}
                <div className="text-xl sm:text-2xl font-serif font-bold tracking-[0.25em] text-heritage-cream uppercase transition-transform group-hover:scale-105">
                  Heritage
                </div>
              </div>
            </Link>

            {/* Right: Account & Cart */}
            <div className="flex items-center gap-1 sm:gap-3">
              <Link
                href="/auth/signin"
                className="tap-target text-heritage-cream/90 hover:text-heritage-cream transition-colors p-2"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                href="/shop"
                className="tap-target text-heritage-cream/90 hover:text-heritage-cream transition-colors p-2 relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-heritage-cream text-heritage-dark text-[9px] font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Side Drawer Content */}
          <div className="relative w-full max-w-sm bg-heritage-dark border-r border-heritage-border h-full z-10 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-heritage-border">
                <span className="font-heading font-medium tracking-[0.2em] text-lg text-heritage-cream uppercase">
                  Heritage
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="tap-target p-2 text-heritage-cream/70 hover:text-heritage-cream"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="tap-target justify-between text-xl font-light text-heritage-cream hover:text-heritage-cream-hover transition-colors py-2"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-heritage-muted" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-8 border-t border-heritage-border space-y-3">
              <a
                href={`https://wa.me/${ADMIN_CONFIG.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="button-primary w-full text-xs"
              >
                <Phone className="w-3.5 h-3.5 mr-2" />
                <span>WhatsApp Sthapati</span>
              </a>

              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="button-secondary w-full text-xs"
              >
                <User className="w-3.5 h-3.5 mr-2" />
                <span>Sign In / Customer Portal</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
