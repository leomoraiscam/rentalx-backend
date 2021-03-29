import { injectable, inject } from 'tsyringe';

import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateCategoryUseCase {
  constructor(
    @inject('CategoryRepository')
    private categoriesRepository: ICategoriesRepository
  ) {}

  async execute({ name, description }: IRequest): Promise<void> {
    const categoryAlredyExist = await this.categoriesRepository.findByName(
      name
    );

    if (categoryAlredyExist) {
      throw new AppError('Category alredy exist');
    }

    await this.categoriesRepository.create({
      name,
      description,
    });
  }
}

export default CreateCategoryUseCase;
