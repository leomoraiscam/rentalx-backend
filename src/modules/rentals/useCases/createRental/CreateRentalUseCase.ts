import { inject, injectable } from 'tsyringe';

import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { RentalStatus } from '@modules/rentals/dtos/enums/RentatStatus';
import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalDateService } from '@modules/rentals/services/IRentalDateService';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

import { IRentalRepository } from '../../repositories/IRentalRepository';

@injectable()
export class CreateRentalUseCase {
  private MINIMUM_HOURS = 24;

  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('RentalDateService')
    private rentalDateService: IRentalDateService
  ) {}

  async execute(data: ICreateRentalDTO): Promise<Rental> {
    const { userId, carId, expectedReturnDate, startDate } = data;
    const car = await this.carRepository.findById(carId);

    if (!car) {
      throw new AppError('Car not found', 404);
    }

    this.rentalDateService.validateStartDate(startDate);
    this.rentalDateService.validateRentalHours(startDate);
    this.rentalDateService.validateRentalHours(expectedReturnDate);

    const existingRental = await this.rentalRepository.findByCarAndDateRange({
      carId,
      startDate,
      expectedReturnDate,
    });

    if (existingRental) {
      throw new AppError(
        'This car is unavailable already exist an rental in progress to the same',
        409
      );
    }

    const userHasActiveRental = await this.rentalRepository.findActiveRentalByUser(
      userId
    );

    if (userHasActiveRental) {
      throw new AppError(
        "There's a rental scheduled or in progress for user",
        409
      );
    }

    const rentalDurationInHours = this.dateProvider.compareInHours(
      startDate,
      expectedReturnDate
    );

    if (rentalDurationInHours < this.MINIMUM_HOURS) {
      throw new AppError('Invalid return time!', 422);
    }

    const total = this.rentalDateService.calculateTotal(
      car,
      startDate,
      expectedReturnDate
    );

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
