import { injectable, inject } from 'tsyringe';

import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';

import { Category } from '../../infra/typeorm/entities/Category';

@injectable()
export class ListCategoriesUseCase {
  constructor(
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.list();
  }
}
