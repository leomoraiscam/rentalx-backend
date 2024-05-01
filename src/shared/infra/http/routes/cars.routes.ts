import { Router } from 'express';
import multer from 'multer';

import { multerConfig } from '@config/upload';
import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { CreateCarSpecificationsController } from '@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController';
import { ListCategoriesCarsGroupController } from '@modules/cars/useCases/listCategoriesCarGroup/ListCategoriesCarsGroupController';
import { UploadCarImagesController } from '@modules/cars/useCases/uploadCarImages/UploadCarImagesController';

import ensureAdmin from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const uploadImages = multer(multerConfig);

const carsRouter = Router();
const createCarController = new CreateCarController();
const listCategoriesCarsGroupController = new ListCategoriesCarsGroupController();
const createCarSpecificationsController = new CreateCarSpecificationsController();
const uploadCarImagesController = new UploadCarImagesController();

carsRouter.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle
);
carsRouter.post(
  '/:carId/specifications',
  ensureAuthenticated,
  ensureAdmin,
  createCarSpecificationsController.handle
);
carsRouter.get('/', listCategoriesCarsGroupController.handle);
carsRouter.post(
  '/:id/images',
  ensureAuthenticated,
  ensureAdmin,
  uploadImages.array('images'),
  uploadCarImagesController.handle
);

export { carsRouter };
