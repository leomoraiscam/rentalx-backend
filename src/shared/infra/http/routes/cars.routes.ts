import { Joi, Segments, celebrate } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import { uploadImage } from '@config/upload';
import { CarStatus } from '@modules/cars/enums/carStatus';
import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { ListCarsGroupedByCategoryController } from '@modules/cars/useCases/listCarsGroupedByCategory/ListCarsGroupedByCategoryController';
import { ListCategoriesWithModelsController } from '@modules/cars/useCases/listCategoriesWithModels/ListCategoriesWithModelsController';
import { UpdateCarImageController } from '@modules/cars/useCases/updateCarImage/UpdateCarImageController';
import { UpdateCarImagesController } from '@modules/cars/useCases/updateCarImages/UpdateCarImagesController';
import { UploadCarImagesController } from '@modules/cars/useCases/uploadCarImages/UploadCarImagesController';

import ensureAdmin from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { extractFileNames } from '../middlewares/extractFileNames';
import { handleUploadErrors } from '../middlewares/handleUploadErrors';
import { requireFile } from '../middlewares/requireFile';

const uploadImages = multer(uploadImage);
const carsRouter = Router();
const createCarController = new CreateCarController();
const listCategoriesWithModelsController = new ListCategoriesWithModelsController();
const listCarsGroupedByCategoryController = new ListCarsGroupedByCategoryController();
const uploadCarImagesController = new UploadCarImagesController();
const updateCarImagesController = new UpdateCarImagesController();
const updateCarImageController = new UpdateCarImageController();

carsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().min(2).max(25).required(),
      brand: Joi.string().min(2).max(15).required(),
      description: Joi.string().min(5).max(90).required(),
      dailyRate: Joi.number().integer().min(80).max(1000).required(),
      fineAmount: Joi.number().integer().min(60).max(1000).required(),
      licensePlate: Joi.string().min(7).max(7).required(),
      categoryId: Joi.string().uuid().required(),
      specifications: Joi.array().min(1).required(),
      status: Joi.string()
        .valid(...Object.values(CarStatus))
        .required(),
    },
  }),
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle
);
carsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      startDate: Joi.date().iso().required(),
      expectedReturnDate: Joi.date().iso().required(),
      brand: Joi.string(),
      type: Joi.string(),
      categoryId: Joi.string(),
    },
  }),
  listCategoriesWithModelsController.handle
);
carsRouter.get(
  '/options',
  celebrate({
    [Segments.QUERY]: {
      categoryId: Joi.string().uuid().required(),
      startDate: Joi.date().iso().required(),
      expectedReturnDate: Joi.date().iso().required(),
    },
  }),
  listCarsGroupedByCategoryController.handle
);
carsRouter.post(
  '/:id/images',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  ensureAdmin,
  uploadImages.array('car'),
  requireFile,
  extractFileNames,
  handleUploadErrors,
  uploadCarImagesController.handle
);
carsRouter.put(
  '/:id/images',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  ensureAdmin,
  uploadImages.array('car'),
  requireFile,
  extractFileNames,
  handleUploadErrors,
  updateCarImagesController.handle
);
carsRouter.patch(
  '/:id/images/:imageId',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
      imageId: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  ensureAdmin,
  uploadImages.single('car'),
  requireFile,
  extractFileNames,
  handleUploadErrors,
  updateCarImageController.handle
);

export { carsRouter };
