import { InMemoryStoreRepository } from './in-memory-repository';
import type { StoreRepository } from '@/domain/services';

// Global singleton pattern across all environments (including production lambdas)
const globalForRepo = globalThis as unknown as {
  storeRepository?: StoreRepository;
};

export const storeRepository: StoreRepository =
  globalForRepo.storeRepository ?? new InMemoryStoreRepository(true);

// Always preserve on globalThis so all modules & requests in the same process share state
globalForRepo.storeRepository = storeRepository;

export function getStoreRepository(): StoreRepository {
  return storeRepository;
}
