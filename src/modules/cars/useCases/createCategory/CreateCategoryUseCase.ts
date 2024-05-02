import { injectable, inject } from 'tsyringe';

import { ICreateCategoryDTO } from '@modules/cars/dtos/ICreateCategoryDTO';
import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class CreateCategoryUseCase {
  constructor(
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository
  ) {}

  async execute({
    name,
    description,
    type,
  }: ICreateCategoryDTO): Promise<Category> {
    const category = await this.categoryRepository.findByName(name);

    if (category) {
      throw new AppError('Category with this name already exists', 409);
    }

    return this.categoryRepository.create({
      name,
      description,
      type,
    });
  }
}
