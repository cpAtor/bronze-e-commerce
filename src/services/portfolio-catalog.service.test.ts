import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PortfolioCatalogService } from './portfolio-catalog.service';
import { InMemoryStoreRepository } from '@/repositories/in-memory-repository';
import * as eventsModule from '@/domain/events';

describe('PortfolioCatalogService', () => {
  let repo: InMemoryStoreRepository;
  let service: PortfolioCatalogService;

  beforeEach(() => {
    repo = new InMemoryStoreRepository(true);
    service = new PortfolioCatalogService(repo);
  });

  describe('browsePortfolio / getPortfolioPieces', () => {
    it('returns all seeded portfolio pieces with complete craft details', async () => {
      const pieces = await service.browsePortfolio();
      expect(pieces).toHaveLength(5);

      const nataraja = pieces.find(
        (p) => p.slug === 'nataraja-ananda-tandava-murti'
      );
      expect(nataraja).toBeDefined();
      expect(nataraja?.name).toBe('Nataraja Ananda Tandava Murti');
      expect(nataraja?.referenceDimensions).toContain('24" H');
      expect(nataraja?.castingTechnique).toContain('Madhuchishtavidhana');
      expect(nataraja?.finishOptions).toEqual([
        'Antique Temple Patina',
        'Polished Bronze Highlights',
        'Deep Verdant Patina',
      ]);
      expect(nataraja?.typicalLeadTime).toBe('8–10 weeks');
    });

    it('aliases getPortfolioPieces to browsePortfolio', async () => {
      const pieces1 = await service.browsePortfolio();
      const pieces2 = await service.getPortfolioPieces();
      expect(pieces1).toEqual(pieces2);
    });
  });

  describe('getPortfolioPiece / getPortfolioPieceBySlug / getPortfolioPieceById', () => {
    it('retrieves portfolio piece by slug', async () => {
      const piece = await service.getPortfolioPiece('temple-prabhavali-arch');
      expect(piece).not.toBeNull();
      expect(piece?.name).toBe('Temple Prabhavali Arch (Aureole)');
    });

    it('returns null when slug does not exist', async () => {
      const piece = await service.getPortfolioPiece('non-existent-piece');
      expect(piece).toBeNull();
    });

    it('aliases getPortfolioPieceBySlug to getPortfolioPiece', async () => {
      const piece1 = await service.getPortfolioPiece('deepastambha-ritual-branching-lamp');
      const piece2 = await service.getPortfolioPieceBySlug('deepastambha-ritual-branching-lamp');
      expect(piece1).toEqual(piece2);
    });

    it('retrieves portfolio piece by id', async () => {
      const piece = await service.getPortfolioPieceById('port-001');
      expect(piece).not.toBeNull();
      expect(piece?.id).toBe('port-001');
      expect(piece?.slug).toBe('nataraja-ananda-tandava-murti');
    });

    it('returns null when id does not exist', async () => {
      const piece = await service.getPortfolioPieceById('port-999');
      expect(piece).toBeNull();
    });
  });

  describe('submitCommissionInquiry', () => {
    const validInquiryInput = {
      phoneNumber: '+91 98765 43210',
      itemType: 'Deity Idol / Murti',
      deityIconography: 'Chola-style Shiva Nataraja with four arms and apasmara purusha underfoot',
      dimensions: '24" H x 18" W x 8" D',
      finishPreference: 'Antique Temple Patina',
      targetDate: '2026-12-31',
      customerName: 'Suresh Kumar',
      customerEmail: 'suresh@templetrust.org',
      inspiredByPortfolioId: 'port-001',
    };

    it('validates mandatory phoneNumber and rejects missing or empty string', async () => {
      await expect(
        service.submitCommissionInquiry({
          ...validInquiryInput,
          phoneNumber: '',
        })
      ).rejects.toThrow(/phone number/i);

      await expect(
        service.submitCommissionInquiry({
          ...validInquiryInput,
          phoneNumber: '   ',
        })
      ).rejects.toThrow(/phone number/i);
    });

    it('validates mandatory itemType and rejects missing or empty string', async () => {
      await expect(
        service.submitCommissionInquiry({
          ...validInquiryInput,
          itemType: '',
        })
      ).rejects.toThrow(/item type/i);
    });

    it('validates mandatory deityIconography and rejects missing or empty string', async () => {
      await expect(
        service.submitCommissionInquiry({
          ...validInquiryInput,
          deityIconography: '',
        })
      ).rejects.toThrow(/iconography/i);
    });

    it('validates mandatory dimensions and rejects missing or empty string', async () => {
      await expect(
        service.submitCommissionInquiry({
          ...validInquiryInput,
          dimensions: '',
        })
      ).rejects.toThrow(/dimensions/i);
    });

    it('validates mandatory finishPreference and rejects missing or empty string', async () => {
      await expect(
        service.submitCommissionInquiry({
          ...validInquiryInput,
          finishPreference: '',
        })
      ).rejects.toThrow(/finish/i);
    });

    it('validates mandatory targetDate and rejects missing or empty string', async () => {
      await expect(
        service.submitCommissionInquiry({
          ...validInquiryInput,
          targetDate: '',
        })
      ).rejects.toThrow(/target date/i);
    });

    it('successfully creates inquiry with COM-XXXX reference code and persists in repository', async () => {
      const inquiry = await service.submitCommissionInquiry(validInquiryInput);

      expect(inquiry).toBeDefined();
      expect(inquiry.id).toBeDefined();
      expect(inquiry.commissionCode).toMatch(/^COM-[A-Z0-9]{4}$/);
      expect(inquiry.commissionCode).toBe('COM-1001');
      expect(inquiry.phoneNumber).toBe('+91 98765 43210');
      expect(inquiry.itemType).toBe('Deity Idol / Murti');
      expect(inquiry.deityIconography).toContain('Chola-style Shiva Nataraja');
      expect(inquiry.dimensions).toBe('24" H x 18" W x 8" D');
      expect(inquiry.finishPreference).toBe('Antique Temple Patina');
      expect(inquiry.targetDate).toBe('2026-12-31');
      expect(inquiry.inspiredByPortfolioId).toBe('port-001');

      // Verify persisted in repo
      const persisted = await repo.findCommissionInquiryById(inquiry.id);
      expect(persisted).not.toBeNull();
      expect(persisted?.commissionCode).toBe(inquiry.commissionCode);

      const byCode = await service.getCommissionInquiryByCode(inquiry.commissionCode);
      expect(byCode).not.toBeNull();
      expect(byCode?.id).toBe(inquiry.id);
    });

    it('generates sequential COM-XXXX reference codes for consecutive inquiries', async () => {
      const inquiry1 = await service.submitCommissionInquiry(validInquiryInput);
      const inquiry2 = await service.submitCommissionInquiry({
        ...validInquiryInput,
        itemType: 'Prabhavali Arch',
      });

      expect(inquiry1.commissionCode).toBe('COM-1001');
      expect(inquiry2.commissionCode).toBe('COM-1002');
    });

    it('emits structured domain event "commission.submitted" with correlationId', async () => {
      const logSpy = vi.spyOn(eventsModule, 'logDomainEvent');
      const correlationId = 'test-corr-comm-123';

      const inquiry = await service.submitCommissionInquiry(
        validInquiryInput,
        correlationId
      );

      expect(logSpy).toHaveBeenCalledWith(
        'commission.submitted',
        expect.objectContaining({
          inquiryId: inquiry.id,
          commissionCode: inquiry.commissionCode,
          itemType: inquiry.itemType,
          phoneNumber: inquiry.phoneNumber,
          inspiredByPortfolioId: inquiry.inspiredByPortfolioId,
        }),
        correlationId
      );

      logSpy.mockRestore();
    });
  });
});
