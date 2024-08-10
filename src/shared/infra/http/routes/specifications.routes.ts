import { Joi, Segments, celebrate } from 'celebrate';
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
  celebrate({
    [Segments.QUERY]: {
      page: Joi.string().min(1).max(4).optional(),
      perPage: Joi.string().min(1).max(4).optional(),
      order: Joi.string()
        .valid(...Object.values(['ASC', 'DESC']))
        .optional(),
    },
  }),
  ensureAuthenticated,
  listSpecificationsController.handle
);
specificationRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().min(3).max(20).required(),
      description: Joi.string().min(5).max(55).required(),
    },
  }),
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
