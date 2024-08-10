import { Joi, Segments, celebrate } from 'celebrate';
import { Router } from 'express';
import multer from 'multer';

import { CategoryType } from '@modules/cars/dtos/ICreateCategoryDTO';
import { CreateCategoryController } from '@modules/cars/useCases/createCategory/CreateCategoryController';
import { ImportCategoryController } from '@modules/cars/useCases/importCategories/importCategoryController';
import { ListCategoriesController } from '@modules/cars/useCases/listCategories/ListCategoriesController';

import ensureAdmin from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const upload = multer({
  dest: './tmp',
});

const categoriesRouter = Router();
const createCategoryController = new CreateCategoryController();
const importCategoryController = new ImportCategoryController();
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
  listCategoriesController.handle
);
categoriesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().min(3).max(20).required(),
      description: Joi.string().min(5).max(55).required(),
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
  upload.single('file'),
  importCategoryController.handle
);

export { categoriesRouter };
