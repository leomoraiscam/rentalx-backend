import { Router } from 'express';
import multer from 'multer';

import { CreateCategoryController } from '@modules/cars/useCases/createCategory/CreateCategoryController';
import { ImportCategoryController } from '@modules/cars/useCases/importCategories/importCategoryController';
import { ListCategoriesController } from '@modules/cars/useCases/listCategories/ListCategoriesController';

const upload = multer({
  dest: './tmp',
});

const categoriesRouter = Router();
const createCategoryController = new CreateCategoryController();
const importCategoryController = new ImportCategoryController();
const listCategoriesController = new ListCategoriesController();

categoriesRouter.get('/', listCategoriesController.handle);
categoriesRouter.post('/', createCategoryController.handle);
categoriesRouter.post(
  '/import',
  upload.single('file'),
  importCategoryController.handle
);

export { categoriesRouter };
