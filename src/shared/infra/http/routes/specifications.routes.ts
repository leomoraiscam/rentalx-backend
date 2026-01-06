import { Joi, Segments, celebrate } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import { uploadCSVFile } from '@config/upload';
import { CreateSpecificationController } from '@modules/cars/useCases/createSpecification/CreateSpecificationController';
import { ImportSpecificationsController } from '@modules/cars/useCases/importSpecifications/importSpecificationsController';
import { ListSpecificationsController } from '@modules/cars/useCases/listSpecifications/ListSpecificationsController';

import ensureAdmin from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { handleUploadErrors } from '../middlewares/handleUploadErrors';
import { requireFile } from '../middlewares/requireFile';

const uploadSpecifications = multer(uploadCSVFile);
const specificationRouter = Router();
const createSpecificationController = new CreateSpecificationController();
const listSpecificationsController = new ListSpecificationsController();
const importSpecificationsController = new ImportSpecificationsController();

specificationRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      page: Joi.string().min(1).optional(),
      perPage: Joi.string().min(1).optional(),
      order: Joi.string()
        .valid(...Object.values(['ASC', 'DESC']))
        .optional(),
    },
  }),
  ensureAuthenticated,
  ensureAdmin,
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
  requireFile,
  handleUploadErrors,
  importSpecificationsController.handle
);

export { specificationRouter };
