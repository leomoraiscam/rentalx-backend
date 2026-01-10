/* eslint-disable no-restricted-globals */
import { IPaginationResponseDTO } from '@shared/common/dtos/IPaginationResponseDTO';
import { AppError } from '@shared/errors/AppError';

export function paginationResultQuery<T>(
  resultQueryTotal: number,
  perPage: number,
  resultQuery: T[]
): IPaginationResponseDTO<T> {
  const totalPages = Math.ceil(resultQueryTotal / perPage);

  if (isNaN(totalPages)) {
    throw new AppError(
      'Invalid Parameters received. Total pages result is not a number',
      422
    );
  }

  return {
    data: resultQuery,
    total: resultQueryTotal,
    totalPages,
  };
}
