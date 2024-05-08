import path from 'path';
import { inject, injectable } from 'tsyringe';

import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';
import { RentalStatus } from '@modules/rentals/dtos/enums/RentatStatus';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class ConfirmRentalUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(id: string): Promise<Rental> {
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    if (rental.status === RentalStatus.CONFIRMED) {
      throw new AppError('Rental already confirmed', 409);
    }

    Object.assign(rental, {
      status: RentalStatus.CONFIRMED,
    });

    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'create-rental.hbs'
    );

    const { name, email } = await this.userRepository.findById(rental.userId);

    const startDate = this.dateProvider.getDate(rental.startDate);
    const startHour = this.dateProvider.getHours(rental.startDate);
    const expectReturnDate = this.dateProvider.getDate(
      rental.expectedReturnDate
    );
    const expectReturnHour = this.dateProvider.getHours(
      rental.expectedReturnDate
    );

    const dailies = this.dateProvider.compareInDays(
      rental.startDate,
      rental.expectedReturnDate
    );

    await this.mailProvider.sendMail<{
      name: string;
      code: string;
      startDate: string;
      startHour: string;
      expectReturnDate: string;
      expectReturnHour: string;
      dailies: number;
      price: number;
      total: number;
    }>({
      path: templatePath,
      subject: 'Confirmação de reserva',
      to: email || '',
      variables: {
        code: rental.id,
        name: name || '',
        startDate,
        startHour,
        expectReturnDate,
        expectReturnHour,
        dailies,
        price: rental.car.dailyRate,
        total: rental.total,
      },
    });

    return this.rentalRepository.save(rental);
  }
}
