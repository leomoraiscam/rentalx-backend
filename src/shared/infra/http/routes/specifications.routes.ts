import { Router } from 'express';
import multer from 'multer';

import { multerConfig } from '@config/upload';
import { CreateSpecificationController } from '@modules/cars/useCases/createSpecification/CreateSpecificationController';
import { ImportSpecificationsController } from '@modules/cars/useCases/importSpecifications/importSpecificationsController';
import { ListSpecificationsController } from '@modules/cars/useCases/listSpecifications/ListSpecificationsController';

import ensureAdmin from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const uploadSpecifications = multer(multerConfig);

const specificationRouter = Router();
const createSpecificationController = new CreateSpecificationController();
const listSpecificationsController = new ListSpecificationsController();
const importSpecificationsController = new ImportSpecificationsController();

specificationRouter.get(
  '/',
  ensureAuthenticated,
  listSpecificationsController.handle
);
specificationRouter.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createSpecificationController.handle
);
specificationRouter.post(
  '/import',
  ensureAuthenticated,
  ensureAdmin,
  uploadSpecifications.single('file'),
  importSpecificationsController.handle
);

export { specificationRouter };
