import { inject, injectable } from 'tsyringe';

import { ICreateSpecificationDTO } from '@modules/cars/dtos/ICreateSpecificationDTO';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class CreateSpecificationUseCase {
  constructor(
    @inject('SpecificationRepository')
    private specificationRepository: ISpecificationRepository
  ) {}

  async execute(data: ICreateSpecificationDTO): Promise<Specification> {
    const { name, description } = data;
    const specification = await this.specificationRepository.findByName(name);

    if (specification) {
      throw new AppError('Specification with name already exists', 409);
    }

    return this.specificationRepository.create({ name, description });
  }
}
