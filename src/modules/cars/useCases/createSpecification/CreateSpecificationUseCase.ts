import { inject, injectable } from 'tsyringe';

import ISpecificationRepository from '../../repositories/ISpecificationRepository';

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
      throw new Error('Specification alredy exist');
    }

    await this.specificationRepository.create({
      name,
      description,
    });
  }
}

export default CreateSpecificationUseCase;
