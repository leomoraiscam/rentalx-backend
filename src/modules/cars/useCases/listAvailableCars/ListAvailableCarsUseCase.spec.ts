import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let inMemoryCarRepository: InMemoryCarRepository;
let listAvailableCarsUseCase: ListAvailableCarsUseCase;

describe('ListAvailableCarsUseCase', () => {
  beforeEach(() => {
    inMemoryCarRepository = new InMemoryCarRepository();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      inMemoryCarRepository
    );
  });

  it('should be able to return available cars', async () => {
    await inMemoryCarRepository.create({
      name: 'Mustang',
      brand: 'ford',
      description: 'sportive car',
      dailyRate: 180,
      licensePlate: 'DJA-002',
      fineAmount: 150,
      categoryId: 'sportive',
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars.length).toEqual(1);
  });

  it.skip('should be able to all available cars by brand', async () => {
    await inMemoryCarRepository.create({
      name: 'Ford GT',
      brand: 'ford',
      description: 'super sportive car',
      dailyRate: 250,
      licensePlate: 'LIL-789',
      fineAmount: 245,
      categoryId: 'super sportive',
    });

    await inMemoryCarRepository.create({
      name: '320i',
      brand: 'bmw',
      description: 'sportive car',
      dailyRate: 180,
      licensePlate: 'LIT-789',
      fineAmount: 150,
      categoryId: 'sportive',
    });

    const cars = await listAvailableCarsUseCase.execute({
      brand: 'ford',
    });

    expect(cars.length).toEqual(1);
  });

  it('should be able to return all available cars by name when receive filter by name', async () => {
    await inMemoryCarRepository.create({
      name: 'M5',
      brand: 'bmw',
      description: 'sportive car',
      dailyRate: 210,
      licensePlate: 'ABCD-124',
      fineAmount: 175,
      categoryId: 'sportive',
    });

    const cars = await listAvailableCarsUseCase.execute({
      name: 'M5',
    });

    expect(cars.length).toEqual(1);
  });

  it.skip('should be able to all available cars by categoryId', async () => {
    await inMemoryCarRepository.create({
      name: 'M8',
      brand: 'bmw',
      description: 'super sportive car',
      dailyRate: 250,
      licensePlate: 'LIL-789',
      fineAmount: 245,
      categoryId: 'super sportive',
    });

    await inMemoryCarRepository.create({
      name: 'M3',
      brand: 'bmw',
      description: 'sportive car',
      dailyRate: 180,
      licensePlate: 'LIT-789',
      fineAmount: 150,
      categoryId: 'sportive',
    });

    const cars = await listAvailableCarsUseCase.execute({
      categoryId: 'executive',
    });

    expect(cars.length).toEqual(0);
  });
});
