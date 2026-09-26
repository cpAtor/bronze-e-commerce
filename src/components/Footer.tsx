import Link from 'next/link';
import { Mail, Phone, MessageSquare, ArrowUpRight } from 'lucide-react';
import { ADMIN_CONFIG } from '@/lib/config';

export function Footer() {
  const cleanPhone = ADMIN_CONFIG.phone.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-heritage-darker text-heritage-cream border-t border-heritage-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-heritage-border">
          {/* Brand Manifesto */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-heritage-border flex items-center justify-center font-heading text-xs text-heritage-cream bg-heritage-surface">
                HB
              </div>
              <span className="font-heading tracking-[0.2em] text-lg font-semibold uppercase text-heritage-cream">
                Heritage
              </span>
            </div>
            <p className="text-sm text-heritage-muted leading-relaxed font-sans max-w-sm">
              Heirloom bronze wares and bespoke temple sanctum vigrahas cast in the sacred metallurgical lineage of Swamimalai, Tamil Nadu. Every piece is hand-sculpted in lost-wax and alloyed with authentic five-metal Panchaloha.
            </p>
            <div className="pt-2 text-xs text-heritage-subtle tracking-[0.1em] uppercase">
              Madhuchishtavidhana &bull; Shilpa Shastra Canonical Proportions
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-medium tracking-[0.18em] uppercase text-heritage-cream/60">
              Collections
            </h4>
            <ul className="space-y-3 text-sm text-heritage-muted">
              <li>
                <Link href="/shop" className="hover:text-heritage-cream transition-colors">
                  Artisanal Wares
                </Link>
              </li>
              <li>
                <Link href="/custom-work" className="hover:text-heritage-cream transition-colors">
                  Temple Commissions
                </Link>
              </li>
              <li>
                <Link href="/custom-work" className="hover:text-heritage-cream transition-colors">
                  Panchaloha Metallurgy
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-heritage-cream transition-colors">
                  My Orders & Tracking
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-heritage-cream transition-colors text-xs text-heritage-subtle">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Communication Seam */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-medium tracking-[0.18em] uppercase text-heritage-cream/60">
              Atelier Direct Contact
            </h4>
            <p className="text-xs text-heritage-muted leading-relaxed">
              All bespoke commissions and order updates are handled directly by the master sthapati:
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-heritage-cream hover:underline decoration-heritage-muted underline-offset-4"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: {ADMIN_CONFIG.phone}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-heritage-subtle" />
                </a>
              </li>
              <li>
                <a
                  href={`tel:${ADMIN_CONFIG.phone}`}
                  className="inline-flex items-center gap-2.5 text-heritage-cream hover:underline decoration-heritage-muted underline-offset-4"
                >
                  <Phone className="w-4 h-4" />
                  <span>Direct: {ADMIN_CONFIG.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${ADMIN_CONFIG.email}`}
                  className="inline-flex items-center gap-2.5 text-heritage-cream hover:underline decoration-heritage-muted underline-offset-4"
                >
                  <Mail className="w-4 h-4" />
                  <span>{ADMIN_CONFIG.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-heritage-subtle">
          <p>© {new Date().getFullYear()} Heritage Storefront. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Free insured shipping on ₹2,500+</span>
            <span>&bull;</span>
            <span>Swamimalai, South India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
