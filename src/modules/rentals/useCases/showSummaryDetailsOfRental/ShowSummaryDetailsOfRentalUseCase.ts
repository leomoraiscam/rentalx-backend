import { inject, injectable } from 'tsyringe';

import { IShowSummaryDetailsRentalDTO } from '@modules/rentals/dtos/IShowSummaryDetailsRentalDTO';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class ShowSummaryDetailsOfRentalUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(id: string): Promise<IShowSummaryDetailsRentalDTO> {
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
      car: rental.car,
      offer: {
        dailies,
        quoteCarDailyRate: rental?.car.dailyRate,
        total: rental?.car.dailyRate * dailies,
      },
      withdrawal: rental.startDate,
      devolution: rental.expectedReturnDate,
    };
  }
}
