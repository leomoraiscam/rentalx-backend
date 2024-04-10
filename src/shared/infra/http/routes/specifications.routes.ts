import { Router } from 'express';

import { CreateSpecificationController } from '@modules/cars/useCases/createSpecification/CreateSpecificationController';
import { ListSpecificationsController } from '@modules/cars/useCases/listSpecifications/ListSpecificationsController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const specificationRouter = Router();
const createSpecificationController = new CreateSpecificationController();
const listSpecificationsController = new ListSpecificationsController();

specificationRouter.get(
  '/',
  ensureAuthenticated,
  listSpecificationsController.handle
);
specificationRouter.post(
  '/',
  ensureAuthenticated,
  createSpecificationController.handle
);

export { specificationRouter };
