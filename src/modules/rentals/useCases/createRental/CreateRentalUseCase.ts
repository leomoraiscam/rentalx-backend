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

    const car = await this.carRepository.findById(carId);

    if (!car) {
      throw new AppError('Car not found', 404);
    }

    const dateNow = await this.dateProvider.dateNow();
    const isBefore = await this.dateProvider.compareIfBefore(
      startDate,
      dateNow
    );

    if (isBefore) {
      throw new AppError('You cant create an rental on a past date', 422);
    }

    const startDateIsLess8AmHour = this.dateProvider.getHours(startDate);
    const startDateIsMore18PmHour = this.dateProvider.getHours(startDate);

    if (
      Number(startDateIsLess8AmHour.substring(0, 2)) < 8 ||
      Number(startDateIsMore18PmHour.substring(0, 2)) > 18
    ) {
      throw new AppError('You can only create rental 8am and 18pm', 422);
    }

    const returnDateIsLess8AmHour = this.dateProvider.getHours(
      expectedReturnDate
    );
    const returnDateIsMore18PmHour = this.dateProvider.getHours(
      expectedReturnDate
    );

    if (
      Number(returnDateIsLess8AmHour.substring(0, 2)) < 8 ||
      Number(returnDateIsMore18PmHour.substring(0, 2)) > 18
    ) {
      throw new AppError(
        'You can only devolution car between 8am and 18pm',
        422
      );
    }

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
      throw new AppError(
        "There's a rental scheduled or in progress for user",
        409
      );
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

    total = expectedDaysOfRentals * car.dailyRate;

    return this.rentalRepository.create({
      userId,
      carId,
      expectedReturnDate,
      startDate,
      total,
      status: RentalStatus.PENDING,
    });
  }
}
