import { inject, injectable } from 'tsyringe';

import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import IDateProvider from '@shared/container/providers/DateProvider/IDateProvider';
import AppError from '@shared/errors/AppError';

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
  }: ICreateRentalDTO): Promise<Rental> {
    const minimumHours = 24;

    const carUnavailable = await this.rentalRepository.findOpenRentalByCar(
      carId
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

    const dateNow = this.dateProvider.dateNow();
    const compare = this.dateProvider.compareInHours(
      dateNow,
      expectedReturnDate
    );

    if (compare < minimumHours) {
      throw new AppError('Invalid return time!', 422);
    }

    const [rental] = await Promise.all([
      this.rentalRepository.create({
        userId,
        carId,
        expectedReturnDate,
      }),
      this.carRepository.updateAvailable({
        id: carId,
        available: false,
      }),
    ]);

    return rental;
  }
}
