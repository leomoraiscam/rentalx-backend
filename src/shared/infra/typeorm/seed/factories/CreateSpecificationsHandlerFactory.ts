import { SpecificationRepository } from '@modules/cars/infra/typeorm/repositories/SpecificationRepository';
import { CreateSpecificationUseCase } from '@modules/cars/useCases/createSpecification/CreateSpecificationUseCase';

import { CreateSpecificationsHandler } from '../handler/CreateSpecificationsHandler';

export function makeCreateSpecificationsHandler(): CreateSpecificationsHandler {
  const specificationRepository = new SpecificationRepository();

  // TODO: check if can use container.resolve
  const createSpecificationUseCase = new CreateSpecificationUseCase(
    specificationRepository
  );

  const createSpecificationsHandler = new CreateSpecificationsHandler(
    createSpecificationUseCase
  );

  return createSpecificationsHandler;
}
