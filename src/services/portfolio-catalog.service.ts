import type { StoreRepository } from '@/domain/services';
import type {
  PortfolioPiece,
  CommissionInquiry,
  SubmitCommissionInquiryInput,
} from '@/domain/types';
import { getStoreRepository } from '@/repositories';

import { logDomainEvent, generateCorrelationId } from '@/domain/events';

export class PortfolioCatalogService {
  constructor(private repo: StoreRepository = getStoreRepository()) {}

  async browsePortfolio(): Promise<PortfolioPiece[]> {
    return this.repo.listPortfolioPieces();
  }

  async getPortfolioPieces(): Promise<PortfolioPiece[]> {
    return this.browsePortfolio();
  }

  async getPortfolioPiece(slug: string): Promise<PortfolioPiece | null> {
    return this.repo.findPortfolioPieceBySlug(slug);
  }

  async getPortfolioPieceBySlug(slug: string): Promise<PortfolioPiece | null> {
    return this.getPortfolioPiece(slug);
  }

  async getPortfolioPieceById(id: string): Promise<PortfolioPiece | null> {
    return this.repo.findPortfolioPieceById(id);
  }

  async submitCommissionInquiry(
    input: SubmitCommissionInquiryInput,
    correlationId?: string
  ): Promise<CommissionInquiry> {
    if (!input.phoneNumber || !input.phoneNumber.trim()) {
      throw new Error('Phone number is mandatory for callback communication.');
    }
    if (!input.itemType || !input.itemType.trim()) {
      throw new Error('Item type is mandatory for commission inquiries.');
    }
    if (!input.deityIconography || !input.deityIconography.trim()) {
      throw new Error('Iconography notes are mandatory for commission inquiries.');
    }
    if (!input.dimensions || !input.dimensions.trim()) {
      throw new Error('Dimensions are mandatory for commission inquiries.');
    }
    if (!input.finishPreference || !input.finishPreference.trim()) {
      throw new Error('Finish preference is mandatory for commission inquiries.');
    }
    if (!input.targetDate || !input.targetDate.trim()) {
      throw new Error('Target date is mandatory for commission inquiries.');
    }

    const cid = correlationId || generateCorrelationId();

    const existingInquiries = await this.repo.listCommissionInquiries();
    const nextSeq = 1001 + existingInquiries.length;
    const commissionCode = `COM-${nextSeq}`;

    const inquiryId = `comm-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    const inquiry: CommissionInquiry = {
      id: inquiryId,
      commissionCode,
      customerId: input.customerId || 'guest',
      itemType: input.itemType.trim(),
      deityIconography: input.deityIconography.trim(),
      dimensions: input.dimensions.trim(),
      finishPreference: input.finishPreference.trim(),
      targetDate: input.targetDate.trim(),
      phoneNumber: input.phoneNumber.trim(),
      inspiredByPortfolioId: input.inspiredByPortfolioId || null,
      createdAt: Date.now(),
    };

    await this.repo.saveCommissionInquiry(inquiry);

    logDomainEvent(
      'commission.submitted',
      {
        inquiryId: inquiry.id,
        commissionCode: inquiry.commissionCode,
        customerId: inquiry.customerId,
        itemType: inquiry.itemType,
        phoneNumber: inquiry.phoneNumber,
        inspiredByPortfolioId: inquiry.inspiredByPortfolioId,
      },
      cid
    );

    return inquiry;
  }

  async getCommissionInquiryByCode(
    code: string
  ): Promise<CommissionInquiry | null> {
    return this.repo.findCommissionInquiryByCode(code);
  }
}
