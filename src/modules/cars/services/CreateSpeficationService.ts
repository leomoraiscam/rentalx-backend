import { inject, injectable } from 'tsyringe';

import ISpecificationRepository from '../repositories/ISpecificationRepository';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateSpecificationService {
  constructor(
    @inject('SpecificationRepository')
    private specificationRepository: ISpecificationRepository
  ) {}

  execute({ name, description }: IRequest): void {
    const categoryAlredyExist = this.specificationRepository.findByName(name);

    if (categoryAlredyExist) {
      throw new Error('Specification alredy exist');
    }

    this.specificationRepository.create({
      name,
      description,
    });
  }
}

export default CreateSpecificationService;
