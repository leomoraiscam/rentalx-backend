import { inject, injectable } from 'tsyringe';

import { IShowRentalDTO } from '@modules/rentals/dtos/IShowRentalDTO';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class ShowRentalUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(id: string): Promise<IShowRentalDTO> {
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    const dailies = await this.dateProvider.compareInDays(
      rental.startDate,
      rental.expectedReturnDate
    );

    return {
      id: rental.id,
      car: {
        ...rental.car,
        dailyRate: Number(rental.car.dailyRate),
        fineAmount: Number(rental.car.fineAmount),
      },
      offer: {
        dailies,
        total: rental.car.dailyRate * dailies,
      },
      withdrawal: rental.startDate,
      devolution: rental.expectedReturnDate,
      status: rental.status,
    };
  }
}
