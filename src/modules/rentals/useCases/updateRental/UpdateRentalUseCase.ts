import { inject, injectable } from 'tsyringe';

import { CarStatus } from '@modules/cars/enums/CarStatus';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { RentalStatus } from '@modules/rentals/enums/RentatStatus';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { IRentalDateService } from '@modules/rentals/services/IRentalDateService';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class UpdateRentalUseCase {
  private MINIMUM_HOURS = 24;

  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('RentalDateService')
    private rentalDateService: IRentalDateService
  ) {}

  async execute(data: Partial<Rental>): Promise<Rental> {
    const rental = await this.rentalRepository.findById(data.id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    if (!rental.status.includes(RentalStatus.CONFIRMED)) {
      throw new AppError(
        'The rent cannot be updated as it has passed the period',
        422
      );
    }

    if (data.startDate || data.expectedReturnDate) {
      this.rentalDateService.validateStartDate(data.startDate);
      this.rentalDateService.validateRentalHours(data.startDate);
      this.rentalDateService.validateRentalHours(data.expectedReturnDate);

      const rentalDurationInHours = this.dateProvider.compareInHours(
        data.startDate,
        data.expectedReturnDate
      );

      if (rentalDurationInHours < this.MINIMUM_HOURS) {
        throw new AppError('Invalid return time!', 422);
      }

      rental.total = this.rentalDateService.calculateTotal(
        rental.car,
        data.startDate,
        data.expectedReturnDate
      );
    }

    if (data.carId && rental.carId !== data.carId) {
      const car = await this.carRepository.findById(data.carId);

      if (!car) {
        throw new AppError('Car not found', 404);
      }

      if (!car.status.includes(CarStatus.AVAILABLE)) {
        throw new AppError('This car is not available', 422);
      }

      const currentCar = await this.carRepository.findById(rental.carId);

      if (currentCar) {
        currentCar.status = CarStatus.AVAILABLE;

        await this.carRepository.save(currentCar);
      }

      car.status = CarStatus.RESERVED;

      await this.carRepository.save(car);

      const total = this.rentalDateService.calculateTotal(
        car,
        rental.startDate,
        rental.expectedReturnDate
      );

      Object.assign(rental, {
        carId: car.id,
        car,
        total,
      });
    }

    Object.assign(rental, {
      ...data,
    });

    return this.rentalRepository.save(rental);
  }
}
