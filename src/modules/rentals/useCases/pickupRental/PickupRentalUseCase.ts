import { inject, injectable } from 'tsyringe';

import { CarStatus } from '@modules/cars/enums/CarStatus';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { RentalStatus } from '@modules/rentals/enums/RentatStatus';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class PickupRentalUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository
  ) {}

  async execute(id: string): Promise<void> {
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    if (!rental.status.includes(RentalStatus.CONFIRMED)) {
      throw new AppError('This rental isn`t eligible for picked up', 422);
    }

    const car = await this.carRepository.findById(rental.carId);

    rental.status = RentalStatus.PICKED_UP;
    car.status = CarStatus.RENTED;

    await Promise.all([
      this.rentalRepository.save(rental),
      this.carRepository.save(car),
    ]);
  }
}
