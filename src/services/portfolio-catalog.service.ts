import type { StoreRepository } from '@/domain/services';
import type {
  PortfolioPiece,
  CommissionInquiry,
  SubmitCommissionInquiryInput,
} from '@/domain/types';
import { getStoreRepository } from '@/repositories';

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
    throw new Error(
      'Not implemented: submitCommissionInquiry will be implemented in Task 03'
    );
  }

  async getCommissionInquiryByCode(
    code: string
  ): Promise<CommissionInquiry | null> {
    return this.repo.findCommissionInquiryByCode(code);
  }
}
