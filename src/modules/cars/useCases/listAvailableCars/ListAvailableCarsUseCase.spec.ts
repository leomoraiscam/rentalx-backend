import CarsRepositoryInMemory from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import ListAvailableCarsUseCase from './ListAvailableCarsUseCase';

let carsRepositoryInMemory: CarsRepositoryInMemory;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe('Create Car', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory
    );
  });

  it('should be able to all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car doe',
      description: 'Description Car doe',
      daily_rate: 80,
      license_plate: 'ABC-123',
      fine_amount: 50,
      brand: 'Brand doe',
      category_id: 'Category for doe',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it('should be able to all available cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car doe',
      description: 'Description Car doe',
      daily_rate: 80,
      license_plate: 'ABC-123',
      fine_amount: 50,
      brand: 'Brand_test',
      category_id: 'Category for doe',
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'Brand_test',
    });

    expect(cars).toEqual([car]);
  });

  it('should be able to all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 03',
      description: 'Description Car doe',
      daily_rate: 80,
      license_plate: 'ABCD-124',
      fine_amount: 50,
      brand: 'Brand_test',
      category_id: 'Category for doe',
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'Car 03',
    });

    expect(cars).toEqual([car]);
  });

  it('should be able to all available cars by category', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car 03',
      description: 'Description Car doe',
      daily_rate: 80,
      license_plate: 'ABCD-124',
      fine_amount: 50,
      brand: 'Brand_test',
      category_id: '12345',
    });

    const cars = await listAvailableCarsUseCase.execute({
      category_id: '12345',
    });

    expect(cars).toEqual([car]);
  });
});
