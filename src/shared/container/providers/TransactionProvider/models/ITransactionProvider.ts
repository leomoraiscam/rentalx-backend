import { EntityManager } from 'typeorm';

export interface ITransactionProvider {
  transaction<T>(
    runInTransaction: (entityManager: EntityManager) => Promise<T>
  ): Promise<T>;
}
