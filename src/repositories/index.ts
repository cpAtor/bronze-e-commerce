import { InMemoryStoreRepository } from './in-memory-repository';
import type { StoreRepository } from '@/domain/services';

// Global singleton pattern for development & Next.js fast-refresh persistence
const globalForRepo = globalThis as unknown as {
  storeRepository?: StoreRepository;
};

export const storeRepository: StoreRepository =
  globalForRepo.storeRepository ?? new InMemoryStoreRepository(true);

if (process.env.NODE_ENV !== 'production') {
  globalForRepo.storeRepository = storeRepository;
}

export function getStoreRepository(): StoreRepository {
  return storeRepository;
}
