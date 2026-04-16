import { inject, injectable } from 'tsyringe';

import { CarStatus } from '@modules/cars/enums/carStatus';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { RentalStatus } from '@modules/rentals/enums/rentalStatus';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { IRentalDateService } from '@modules/rentals/services/IRentalDateService';
import { ITransactionProvider } from '@shared/container/providers/TransactionProvider/models/ITransactionProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class UpdateRentalUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('RentalDateService')
    private rentalDateService: IRentalDateService,
    @inject('TransactionProvider')
    private transactionProvider: ITransactionProvider
  ) {}

  async execute(data: Partial<Rental>): Promise<Rental> {
    const { id, startDate, expectedReturnDate, carId } = data;
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    if (!rental.status.includes(RentalStatus.Confirmed)) {
      throw new AppError(
        'The rent cannot be updated as it has passed the period',
        422
      );
    }

    return this.transactionProvider.transaction(
      async (transactionalEntityManager) => {
        if (startDate || expectedReturnDate) {
          const targetStartDate = startDate || rental.startDate;
          const targetReturnDate =
            expectedReturnDate || rental.expectedReturnDate;

          this.rentalDateService.validateStartDate(targetStartDate);
          this.rentalDateService.validateRentalHours(targetStartDate);
          this.rentalDateService.validateRentalHours(targetReturnDate);
          this.rentalDateService.validateRentalDuration(
            targetStartDate,
            targetReturnDate
          );

          rental.total = this.rentalDateService.calculateTotal(
            rental.car,
            targetStartDate,
            targetReturnDate
          );

          rental.startDate = targetStartDate;
          rental.expectedReturnDate = targetReturnDate;
        }

        if (carId && rental.carId !== carId) {
          const car = await this.carRepository.findById(carId);

          if (!car) {
            throw new AppError('Car not found', 404);
          }

          if (!car.status.includes(CarStatus.Available)) {
            throw new AppError('This car is not available', 422);
          }

          const currentCar = await this.carRepository.findById(rental.carId);

          if (currentCar) {
            currentCar.status = CarStatus.Available;
            await transactionalEntityManager.save(currentCar);
          }

          car.status = CarStatus.Reserved;
          await transactionalEntityManager.save(car);

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

        return transactionalEntityManager.save(rental);
      }
    );
  }
}
