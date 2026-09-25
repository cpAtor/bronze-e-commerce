import { describe, it, expect, beforeEach } from 'vitest';
import { PortfolioCatalogService } from '@/services/portfolio-catalog.service';
import CustomWorkPage from './page';
import PortfolioPieceDetailPage from './[slug]/page';
import CommissionInquirePage from './inquire/page';
import { getStoreRepository } from '@/repositories';
import { InMemoryStoreRepository } from '@/repositories/in-memory-repository';

describe('/custom-work integration & pages', () => {
  let portfolioService: PortfolioCatalogService;

  beforeEach(() => {
    const repo = getStoreRepository();
    if (repo instanceof InMemoryStoreRepository) {
      repo.resetToSeed();
    }
    portfolioService = new PortfolioCatalogService();
  });

  describe('Portfolio Data Integrity', () => {
    it('contains all 5 canonical seed portfolio pieces', async () => {
      const pieces = await portfolioService.getPortfolioPieces();
      expect(pieces).toHaveLength(5);

      const slugs = pieces.map((p) => p.slug);
      expect(slugs).toContain('nataraja-ananda-tandava-murti');
      expect(slugs).toContain('temple-prabhavali-arch');
      expect(slugs).toContain('deepastambha-ritual-branching-lamp');
      expect(slugs).toContain('ceremonial-ghanta-temple-kalasham');
      expect(slugs).toContain('embossed-deity-kavacham');

      // Verify every piece has required Agamic casting details
      for (const piece of pieces) {
        expect(piece.id).toBeDefined();
        expect(piece.name).toBeTruthy();
        expect(piece.description).toBeTruthy();
        expect(piece.referenceDimensions).toBeTruthy();
        expect(piece.castingTechnique).toBeTruthy();
        expect(piece.finishOptions.length).toBeGreaterThan(0);
        expect(piece.typicalLeadTime).toBeTruthy();
        expect(piece.images.length).toBeGreaterThan(0);
      }
    });
  });

  describe('CustomWorkPage (/custom-work)', () => {
    it('renders server component without errors', async () => {
      const jsx = await CustomWorkPage();
      expect(jsx).toBeDefined();
      expect(jsx.type).toBe('div');
    });
  });

  describe('PortfolioPieceDetailPage (/custom-work/[slug])', () => {
    it('renders details for a valid portfolio piece slug', async () => {
      const jsx = await PortfolioPieceDetailPage({
        params: Promise.resolve({ slug: 'nataraja-ananda-tandava-murti' }),
      });
      expect(jsx).toBeDefined();
      expect(jsx.type).toBe('div');
    });

    it('triggers notFound() when slug is invalid', async () => {
      await expect(
        PortfolioPieceDetailPage({
          params: Promise.resolve({ slug: 'invalid-non-existent-slug' }),
        })
      ).rejects.toThrow();
    });
  });

  describe('CommissionInquirePage (/custom-work/inquire)', () => {
    it('renders clean inquiry form when no query param provided', async () => {
      const jsx = await CommissionInquirePage({
        searchParams: Promise.resolve({}),
      });
      expect(jsx).toBeDefined();
    });

    it('renders inquiry form with pre-filled inspiration piece when ?piece=[slug] is provided', async () => {
      const jsx = await CommissionInquirePage({
        searchParams: Promise.resolve({
          piece: 'temple-prabhavali-arch',
        }),
      });
      expect(jsx).toBeDefined();
    });

    it('renders inquiry form with pre-filled piece when ?inspiredBy=[id] is provided', async () => {
      const jsx = await CommissionInquirePage({
        searchParams: Promise.resolve({
          inspiredBy: 'port-003',
        }),
      });
      expect(jsx).toBeDefined();
    });
  });
});
