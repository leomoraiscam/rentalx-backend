import { Router } from 'express';
import multer from 'multer';

import { multerConfig } from '@config/upload';
import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { CreateCarSpecificationsController } from '@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController';
import { CreateInventoryToCarsController } from '@modules/cars/useCases/createInventoryToCars/CreateInventoryToCarsController';
import { ListAvailableCarsController } from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';
import { UploadCarImagesController } from '@modules/cars/useCases/uploadCarImages/UploadCarImagesController';

import ensureAdmin from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const uploadImages = multer(multerConfig);

const carsRouter = Router();
const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationsController = new CreateCarSpecificationsController();
const uploadCarImagesController = new UploadCarImagesController();
const createInventoryToCarsController = new CreateInventoryToCarsController();

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
carsRouter.get('/available', listAvailableCarsController.handle);
carsRouter.post(
  '/:id/images',
  ensureAuthenticated,
  ensureAdmin,
  uploadImages.array('images'),
  uploadCarImagesController.handle
);
carsRouter.post('/inventories', createInventoryToCarsController.handle);

export { carsRouter };
