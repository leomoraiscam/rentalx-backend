import { injectable, inject } from 'tsyringe';

import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';

import Category from '../../infra/typeorm/entities/Category';

@injectable()
class ListCategoryUseCase {
  constructor(
    @inject('CategoryRepository')
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute(): Promise<Category[]> {
    const categories = await this.categoriesRepository.list();

    return categories;
  }
}

export default ListCategoryUseCase;
