import CategoriesRepository from '../../repositories/implementations/CategoriesRepository';
import ListCategoriesController from './ListCategoriesController';
import ListCategoriesUseCase from './ListCategoriesUseCase';

export default (): ListCategoriesController => {
  const categoriesRepository = new CategoriesRepository();
  const listCategoryUseCase = new ListCategoriesUseCase(categoriesRepository);
  const listCategoryController = new ListCategoriesController(
    listCategoryUseCase
  );

  return listCategoryController;
};
