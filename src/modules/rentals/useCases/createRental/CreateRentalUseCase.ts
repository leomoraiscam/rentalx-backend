import { inject, injectable } from 'tsyringe';

import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { RentalStatus } from '@modules/rentals/dtos/enums/RentatStatus';
import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

import { IRentalRepository } from '../../repositories/IRentalRepository';

@injectable()
export class CreateRentalUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('CarRepository')
    private carRepository: ICarRepository
  ) {}

  async execute({
    userId,
    carId,
    expectedReturnDate,
    startDate,
  }: ICreateRentalDTO): Promise<Rental> {
    const minimumHours = 24;
    let total = 0;

    const carUnavailable = await this.rentalRepository.findOpenRentalByDateAndCar(
      {
        carId,
        startDate,
        expectedReturnDate,
      }
    );

    if (carUnavailable) {
      throw new AppError(
        'This car is unavailable already exist an rental in progress to the same',
        409
      );
    }

    const rentalOpenToUser = await this.rentalRepository.findOpenRentalByUser(
      userId
    );

    if (rentalOpenToUser) {
      throw new AppError("There's a rental in progress for user", 409);
    }

    const compare = this.dateProvider.compareInHours(
      startDate,
      expectedReturnDate
    );

    if (compare < minimumHours) {
      throw new AppError('Invalid return time!', 422);
    }

    const expectedDaysOfRentals = this.dateProvider.compareInDays(
      startDate,
      expectedReturnDate
    );

    const car = await this.carRepository.findById(carId);

    total = expectedDaysOfRentals * car.dailyRate;

    const rental = await this.rentalRepository.create({
      userId,
      carId,
      expectedReturnDate,
      startDate,
      total,
      status: RentalStatus.PENDING,
    });

    return {
      ...rental,
      total,
    };
  }
}
