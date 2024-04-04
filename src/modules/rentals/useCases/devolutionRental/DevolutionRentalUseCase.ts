import { inject, injectable } from 'tsyringe';

import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { ICreateDevolutionCarDTO } from '@modules/rentals/dtos/ICreateDevolutionCarDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class DevolutionRentalUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute({ id }: ICreateDevolutionCarDTO): Promise<Rental> {
    const minimumDaily = 1;

    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    const car = await this.carRepository.findById(rental.carId);

    if (!car) {
      throw new AppError('Car not found', 404);
    }

    const dateNow = this.dateProvider.dateNow();

    let daily = this.dateProvider.compareInDays(rental.startDate, dateNow);

    if (daily <= 0) {
      daily = minimumDaily;
    }

    const delay = this.dateProvider.compareInDays(
      dateNow,
      rental.expectedReturnDate
    );

    let total = 0;

    if (delay > 0) {
      const calculateFine = delay * car.fineAmount;
      total = calculateFine;
    }

    total += daily * car.dailyRate;

    rental.endDate = this.dateProvider.dateNow();
    rental.total = total;

    await Promise.all([
      this.rentalRepository.create(rental),
      this.carRepository.updateAvailable({
        id: car.id,
        available: true,
      }),
    ]);

    return rental;
  }
}
