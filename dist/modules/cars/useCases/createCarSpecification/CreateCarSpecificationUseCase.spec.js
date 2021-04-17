"use strict";

var _CarsRepositoryInMemory = _interopRequireDefault(require("@modules/cars/repositories/in-memory/CarsRepositoryInMemory"));

var _SpecificationInMemory = _interopRequireDefault(require("@modules/cars/repositories/in-memory/SpecificationInMemory"));

var _AppError = _interopRequireDefault(require("@shared/errors/AppError"));

var _CreateCarSpecificationUseCase = _interopRequireDefault(require("./CreateCarSpecificationUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let carsRepositoryInMemory;
let specificationsRepositoryInMemory;
let createCarSpecificationUseCase;
describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new _CarsRepositoryInMemory.default();
    specificationsRepositoryInMemory = new _SpecificationInMemory.default();
    createCarSpecificationUseCase = new _CreateCarSpecificationUseCase.default(carsRepositoryInMemory, specificationsRepositoryInMemory);
  });
  it('should be able to add new specification to the car', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 03',
      description: 'Description Car doe',
      daily_rate: 80,
      license_plate: 'ABCD-124',
      fine_amount: 50,
      brand: 'Brand_test',
      category_id: '12345'
    });
    const specification = await specificationsRepositoryInMemory.create({
      description: 'test',
      name: 'test'
    });
    const specifications_id = [specification.id];
    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id
    });
    expect(specificationsCars).toHaveProperty('specifications');
    expect(specificationsCars.specifications.length).toBe(1);
  });
  it('should not be able to add new specification to a non-existent car', async () => {
    const car_id = '123';
    const specifications_id = ['54321'];
    await expect(createCarSpecificationUseCase.execute({
      car_id,
      specifications_id
    })).rejects.toEqual(new _AppError.default('Car does not exist!'));
  });
});