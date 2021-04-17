"use strict";

var _dayjs = _interopRequireDefault(require("dayjs"));

var _CarsRepositoryInMemory = _interopRequireDefault(require("../../../cars/repositories/in-memory/CarsRepositoryInMemory"));

var _DayjsDateProvider = _interopRequireDefault(require("../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider"));

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _RentalsRepositoryInMemory = _interopRequireDefault(require("../../repositories/in-Memory/RentalsRepositoryInMemory"));

var _CreateRentalUseCase = _interopRequireDefault(require("./CreateRentalUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let createRentalUseCase;
let rentalsRepositoryInMemory;
let dayJsDateProvider;
let carRepositoryInMemory;
describe('Create Rental', () => {
  const dayAdd24Hours = (0, _dayjs.default)().add(1, 'day').toDate();
  beforeEach(() => {
    rentalsRepositoryInMemory = new _RentalsRepositoryInMemory.default();
    dayJsDateProvider = new _DayjsDateProvider.default();
    carRepositoryInMemory = new _CarsRepositoryInMemory.default();
    createRentalUseCase = new _CreateRentalUseCase.default(rentalsRepositoryInMemory, dayJsDateProvider, carRepositoryInMemory);
  });
  it('should be able to create a new rental', async () => {
    const car = await carRepositoryInMemory.create({
      name: 'Test',
      description: 'Car test',
      daily_rate: 100,
      license_plate: 'test',
      fine_amount: 40,
      category_id: '1234',
      brand: 'test'
    });
    const rental = await createRentalUseCase.execute({
      user_id: '12345',
      car_id: car.id,
      expected_return_date: dayAdd24Hours
    });
    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('start_date');
  });
  it('should not be able to create a new rental if there is another open to the same user', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: '121212',
      expected_return_date: dayAdd24Hours,
      user_id: '12345'
    });
    await expect(createRentalUseCase.execute({
      user_id: '12345',
      car_id: '121212',
      expected_return_date: dayAdd24Hours
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to create a new rental if there is another open to the same car', async () => {
    await rentalsRepositoryInMemory.create({
      car_id: 'test',
      expected_return_date: dayAdd24Hours,
      user_id: '123'
    });
    await expect(createRentalUseCase.execute({
      user_id: '321',
      car_id: 'test',
      expected_return_date: dayAdd24Hours
    })).rejects.toEqual(new _AppError.default('Car is unavailable'));
  });
  it('should not be able to create a new rental with invalid return time', async () => {
    expect(createRentalUseCase.execute({
      user_id: '123',
      car_id: 'test',
      expected_return_date: (0, _dayjs.default)().toDate()
    })).rejects.toBe(new _AppError.default('Invalid return time!'));
  });
});