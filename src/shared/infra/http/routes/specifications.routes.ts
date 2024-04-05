import { Router } from 'express';

import { CreateSpecificationController } from '@modules/cars/useCases/createSpecification/CreateSpecificationController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const specificationRouter = Router();
const createSpecificationController = new CreateSpecificationController();

specificationRouter.post(
  '/',
  ensureAuthenticated,
  createSpecificationController.handle
);

export { specificationRouter };
