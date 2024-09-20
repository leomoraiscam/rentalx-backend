import { inject, injectable } from 'tsyringe';

import { CarStatus } from '@modules/cars/enums/CarStatus';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { ICreateDevolutionCarDTO } from '@modules/rentals/dtos/ICreateDevolutionCarDTO';
import { RentalStatus } from '@modules/rentals/enums/RentatStatus';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class DevolutionRentalUseCase {
  private MINIMUM_DAILY_DAYS = 1;

  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(data: ICreateDevolutionCarDTO): Promise<Rental> {
    const { id } = data;
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    if (rental.status.includes(RentalStatus.CLOSED)) {
      throw new AppError('This rental already finished', 422);
    }

    if (
      !rental.status.includes(RentalStatus.PICKED_UP) &&
      !rental.status.includes(RentalStatus.OVERDUE)
    ) {
      throw new AppError('This rental isn`t eligible for devolution', 422);
    }

    const car = await this.carRepository.findById(rental.carId);

    if (!car) {
      throw new AppError('Car not found', 404);
    }

    const currentDate = this.dateProvider.dateNow();
    let daysRented = this.dateProvider.compareInDays(
      rental.startDate,
      currentDate
    );

    daysRented = daysRented > 0 ? daysRented : this.MINIMUM_DAILY_DAYS;

    const daysOverdue = this.dateProvider.compareInDays(
      currentDate,
      rental.expectedReturnDate
    );
    const fine = daysOverdue > 0 ? daysOverdue * car.fineAmount : 0;
    const total = daysRented * car.dailyRate + fine;

    Object.assign(rental, {
      endDate: currentDate,
      total,
      status: RentalStatus.CLOSED,
    });
    car.status = CarStatus.AVAILABLE;

    const [devolutionRental] = await Promise.all([
      this.rentalRepository.save(rental),
      this.carRepository.save(car),
    ]);

    return devolutionRental;
  }
}
