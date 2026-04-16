import { EntityManager } from 'typeorm';

import { ITransactionProvider } from '../models/ITransactionProvider';

export class InMemoryTransactionProvider implements ITransactionProvider {
  async transaction<T>(
    runInTransaction: (entityManager: EntityManager) => Promise<T>
  ): Promise<T> {
    const mockEntityManager = ({
      save: async (entity: any): Promise<any> => entity,
      remove: async (entity: any): Promise<any> => entity,
    } as unknown) as EntityManager;

    return runInTransaction(mockEntityManager);
  }
}
