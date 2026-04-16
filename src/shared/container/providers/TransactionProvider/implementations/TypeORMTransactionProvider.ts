import { getConnection, EntityManager } from 'typeorm';

import { ITransactionProvider } from '../models/ITransactionProvider';

export class TypeORMTransactionProvider implements ITransactionProvider {
  async transaction<T>(
    runInTransaction: (entityManager: EntityManager) => Promise<T>
  ): Promise<T> {
    return getConnection().transaction(runInTransaction);
  }
}
