"use strict";

var _CarsRepositoryInMemory = _interopRequireDefault(require("@modules/cars/repositories/in-memory/CarsRepositoryInMemory"));

var _AppError = _interopRequireDefault(require("@shared/errors/AppError"));

var _CreateCarUseCase = _interopRequireDefault(require("./CreateCarUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let carsRepositoryInMemory;
let createCarUseCase;
describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new _CarsRepositoryInMemory.default();
    createCarUseCase = new _CreateCarUseCase.default(carsRepositoryInMemory);
  });
  it('should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name Car',
      description: 'Description Car',
      daily_rate: 80,
      license_plate: 'ABC-123',
      fine_amount: 50,
      brand: 'Brand',
      category_id: 'Category'
    });
    expect(car).toHaveProperty('id');
  });
  it('should not be able to create a car with exist license plate', async () => {
    await createCarUseCase.execute({
      name: 'Car doe',
      description: 'Description Car doe',
      daily_rate: 80,
      license_plate: 'ABC-123',
      fine_amount: 50,
      brand: 'Brand doe',
      category_id: 'Category for doe'
    });
    await expect(createCarUseCase.execute({
      name: 'Car tree',
      description: 'Description Car tree',
      daily_rate: 50,
      license_plate: 'ABC-123',
      fine_amount: 30,
      brand: 'Brand tree',
      category_id: 'Category for tree'
    })).rejects.toEqual(new _AppError.default('Car alredy exist'));
  });
  it('should be able to create a car with available true by default', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name available',
      description: 'Description Car available',
      daily_rate: 80,
      license_plate: 'ABCD-123',
      fine_amount: 50,
      brand: 'Brand',
      category_id: 'Category'
    });
    expect(car.available).toBe(true);
  });
});