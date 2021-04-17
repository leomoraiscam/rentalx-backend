"use strict";

var _CategoriesRepositoryInMemory = _interopRequireDefault(require("../../repositories/in-memory/CategoriesRepositoryInMemory"));

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _CreateCategoryUseCase = _interopRequireDefault(require("./CreateCategoryUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let createCategoryUseCase;
let categoryRepositoryInMemory;
describe('Create Category', () => {
  beforeEach(() => {
    categoryRepositoryInMemory = new _CategoriesRepositoryInMemory.default();
    createCategoryUseCase = new _CreateCategoryUseCase.default(categoryRepositoryInMemory);
  });
  it('should be able to create a new category', async () => {
    const category = {
      name: 'Category Test',
      description: 'Category description Test'
    };
    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description
    });
    const categoryCreated = await categoryRepositoryInMemory.findByName(category.name);
    expect(categoryCreated).toHaveProperty('id');
  });
  it('should not be able to create a new category with name exists', async () => {
    const category = {
      name: 'Category Test',
      description: 'Category description Test'
    };
    await createCategoryUseCase.execute({
      name: category.name,
      description: category.description
    });
    await expect(createCategoryUseCase.execute({
      name: category.name,
      description: category.description
    })).rejects.toEqual(new _AppError.default('Category alredy exist'));
  });
});