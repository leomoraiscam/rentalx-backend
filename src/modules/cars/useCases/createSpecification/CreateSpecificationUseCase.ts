import { inject, injectable } from 'tsyringe';

import ISpecificationRepository from '@modules/cars/repositories/ISpecificationRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateSpecificationUseCase {
  constructor(
    @inject('SpecificationsRepository')
    private specificationRepository: ISpecificationRepository
  ) {}

  async execute({ name, description }: IRequest): Promise<void> {
    const categoryAlredyExist = await this.specificationRepository.findByName(
      name
    );

    if (categoryAlredyExist) {
      throw new AppError('Specification alredy exist');
    }

    await this.specificationRepository.create({
      name,
      description,
    });
  }
}

export default CreateSpecificationUseCase;
