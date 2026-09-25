import React from 'react';
import { Flame, Compass, ShieldCheck, Sparkles } from 'lucide-react';

export function CraftBadges() {
  const badges = [
    {
      icon: Flame,
      title: 'Madhuchista Vidhana',
      subtitle: 'Ancient Lost-Wax Casting',
      description:
        'Single-pour lost-wax casting using beeswax models and alluvial clay molds from the sacred Kaveri riverbed.',
    },
    {
      icon: Compass,
      title: 'Agamic Shilpa Shastra',
      subtitle: 'Canonical Proportions',
      description:
        'Every idol strictly conforms to canonical Talamana measurement systems and Agamic sanctum standards.',
    },
    {
      icon: ShieldCheck,
      title: 'Panchaloha Sacred Alloy',
      subtitle: 'Five-Metal Formulation',
      description:
        'Cast in authentic consecrated alloy of Copper, Zinc, Tin, Silver, and Gold for ritual sanctity.',
    },
    {
      icon: Sparkles,
      title: 'Master Sthapati Hand-Finishing',
      subtitle: 'Temple Patinas & Burnishing',
      description:
        'Chiseled and burnished by hereditary master craftsmen with traditional herbal patinas.',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {badges.map((b) => {
        const Icon = b.icon;
        return (
          <div
            key={b.title}
            className="bg-heritage-surface/60 border border-heritage-border/70 rounded-xl p-5 flex flex-col justify-between hover:border-heritage-cream/40 transition-colors"
          >
            <div>
              <div className="w-10 h-10 rounded-full bg-heritage-cream/10 border border-heritage-border flex items-center justify-center text-heritage-cream mb-4">
                <Icon className="w-5 h-5 text-heritage-cream" />
              </div>
              <h3 className="text-base font-medium text-heritage-cream tracking-wide">
                {b.title}
              </h3>
              <p className="text-xs uppercase tracking-widest text-heritage-muted mt-0.5">
                {b.subtitle}
              </p>
              <p className="text-xs text-heritage-cream/80 mt-2.5 leading-relaxed font-light">
                {b.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
