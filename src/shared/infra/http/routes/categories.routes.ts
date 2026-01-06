import { Joi, Segments, celebrate } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import { uploadCSVFile } from '@config/upload';
import { CategoryType } from '@modules/cars/enums/categoryType';
import { CreateCategoryController } from '@modules/cars/useCases/createCategory/CreateCategoryController';
import { ImportCategoriesController } from '@modules/cars/useCases/importCategories/ImportCategoriesController';
import { ListCategoriesController } from '@modules/cars/useCases/listCategories/ListCategoriesController';

import ensureAdmin from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { handleUploadErrors } from '../middlewares/handleUploadErrors';
import { requireFile } from '../middlewares/requireFile';

const uploadCategories = multer(uploadCSVFile);
const categoriesRouter = Router();
const createCategoryController = new CreateCategoryController();
const importCategoriesController = new ImportCategoriesController();
const listCategoriesController = new ListCategoriesController();

categoriesRouter.get(
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
  ensureAdmin,
  listCategoriesController.handle
);
categoriesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().min(3).max(20).required(),
      description: Joi.string().min(5).max(90).required(),
      type: Joi.string()
        .valid(...Object.values(CategoryType))
        .required(),
    },
  }),
  ensureAuthenticated,
  ensureAdmin,
  createCategoryController.handle
);
categoriesRouter.post(
  '/import',
  ensureAuthenticated,
  ensureAdmin,
  uploadCategories.single('file'),
  requireFile,
  handleUploadErrors,
  importCategoriesController.handle
);

export { categoriesRouter };
