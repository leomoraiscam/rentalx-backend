import { Joi, Segments, celebrate } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import { multerConfig } from '@config/upload';
import { CarStatus } from '@modules/cars/enums/CarStatus';
import { CreateCarController } from '@modules/cars/useCases/createCar/CreateCarController';
import { ListCarsGroupedByCategoryController } from '@modules/cars/useCases/listCarsGroupedByCategory/ListCarsGroupedByCategoryController';
import { ListCategoriesWithModelsController } from '@modules/cars/useCases/ListCategoriesWithModels/ListCategoriesWithModelsController';
import { UploadCarImagesController } from '@modules/cars/useCases/uploadCarImages/UploadCarImagesController';

import ensureAdmin from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const uploadImages = multer(multerConfig);

const carsRouter = Router();
const createCarController = new CreateCarController();
const listCategoriesWithModelsController = new ListCategoriesWithModelsController();
const listCarsGroupedByCategoryController = new ListCarsGroupedByCategoryController();
const uploadCarImagesController = new UploadCarImagesController();

carsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().min(2).max(15).required(),
      brand: Joi.string().min(2).max(15).required(),
      description: Joi.string().min(5).max(40).required(),
      dailyRate: Joi.number().integer().min(0).max(1000).required(),
      fineAmount: Joi.number().integer().min(0).max(1000).required(),
      licensePlate: Joi.string().min(7).max(8).required(),
      categoryId: Joi.string().uuid().required(),
      specifications: Joi.array().min(1).max(10).required(),
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
      categoryId: Joi.string().uuid(),
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
  ensureAuthenticated,
  ensureAdmin,
  uploadImages.array('images'),
  uploadCarImagesController.handle
);

export { carsRouter };
