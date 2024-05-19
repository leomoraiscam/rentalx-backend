import { ICreateSpecificationDTO } from '@modules/cars/dtos/ICreateSpecificationDTO';
import { CreateSpecificationUseCase } from '@modules/cars/useCases/createSpecification/CreateSpecificationUseCase';

import { ISeederHandler } from '../adapters/ports/ISeederHandler';

export class CreateSpecificationsHandler implements ISeederHandler {
  constructor(private createSpecificationUseCase: CreateSpecificationUseCase) {}

  async handle(data: ICreateSpecificationDTO[]): Promise<void> {
    const specifications = data.map(async (specification) => {
      await this.createSpecificationUseCase.execute(specification);
    });

    await Promise.all(specifications);
  }
}
