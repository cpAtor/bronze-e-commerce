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
    { href: '#shop', label: 'Shop Wares' },
    { href: '#custom', label: 'Bespoke Commissions' },
    { href: '#craft', label: 'Craft & Metallurgy' },
    { href: '#story', label: 'Atelier Story' },
    { href: '/orders', label: 'My Orders' },
  ];

  return (
    <>
      {/* Heritage Announcement Bar */}
      <div className="bg-heritage-darker text-heritage-cream/80 text-[11px] font-medium tracking-[0.15em] uppercase py-2.5 px-4 text-center border-b border-heritage-border-light select-none">
        Complimentary insured shipping on orders ₹2,500+ &bull; Hand-cast Panchaloha from Swamimalai
      </div>

      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-heritage-dark/95 backdrop-blur-md border-b border-heritage-border shadow-lg shadow-black/20'
            : 'bg-heritage-dark border-b border-heritage-border/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo / Brand Name */}
            <Link
              href="/"
              className="flex items-center gap-3 text-heritage-cream group"
              aria-label="Heritage Storefront"
            >
              <div className="w-9 h-9 rounded-full border border-heritage-border flex items-center justify-center font-heading font-medium text-xs tracking-wider text-heritage-cream bg-heritage-surface group-hover:border-heritage-cream transition-colors">
                HB
              </div>
              <div className="flex flex-col">
                <span className="font-heading tracking-[0.2em] text-base sm:text-lg font-semibold uppercase text-heritage-cream">
                  Heritage
                </span>
                <span className="text-[10px] tracking-[0.22em] uppercase text-heritage-muted font-normal">
                  Swamimalai Atelier
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-9">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-normal tracking-[0.04em] text-heritage-cream/85 hover:text-heritage-cream transition-colors relative py-1 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-heritage-cream transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Desktop Right Utilities */}
            <div className="hidden md:flex items-center gap-5">
              <a
                href={`https://wa.me/${ADMIN_CONFIG.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target px-4 py-2 text-xs font-medium tracking-[0.08em] uppercase text-heritage-cream border border-heritage-border rounded-full hover:bg-heritage-cream/10 transition-colors flex items-center gap-2"
                title="Direct consultation with master artisan"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Consultation</span>
              </a>

              <Link
                href="/auth/signin"
                className="tap-target text-heritage-cream/80 hover:text-heritage-cream transition-colors p-2"
                aria-label="Sign In"
              >
                <User className="w-5 h-5" />
              </Link>

              <a
                href="#shop"
                className="tap-target text-heritage-cream/80 hover:text-heritage-cream transition-colors p-2 relative"
                aria-label="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-heritage-cream text-heritage-dark text-[10px] font-bold rounded-full flex items-center justify-center">
                  0
                </span>
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center lg:hidden gap-2">
              <a
                href="#shop"
                className="tap-target text-heritage-cream p-2 relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="tap-target p-2 text-heritage-cream rounded-lg hover:bg-heritage-surface transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="relative bg-heritage-dark border-t border-heritage-border rounded-t-3xl shadow-2xl p-6 z-10 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-heritage-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-heritage-border flex items-center justify-center font-heading text-xs text-heritage-cream bg-heritage-surface">
                  HB
                </div>
                <span className="font-heading font-semibold text-heritage-cream text-base tracking-[0.15em] uppercase">
                  Heritage
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="tap-target p-2 text-heritage-cream/70 hover:text-heritage-cream"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="tap-target w-full justify-between px-3 text-lg font-normal text-heritage-cream hover:text-heritage-cream-hover transition-colors border-b border-heritage-border-light py-4"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-heritage-muted" />
                </a>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-heritage-border space-y-3">
              <a
                href={`https://wa.me/${ADMIN_CONFIG.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="button-primary w-full"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span>Contact Sthapati via WhatsApp</span>
              </a>

              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="button-secondary w-full"
              >
                <User className="w-4 h-4 mr-2" />
                <span>Sign In to Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
