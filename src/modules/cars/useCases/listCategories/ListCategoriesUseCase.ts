import { injectable, inject } from 'tsyringe';

import Category from '../../entities/Category';
import ICategoriesRepository from '../../repositories/ICategoriesRepository';

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
