import path from 'path';
import { inject, injectable } from 'tsyringe';

import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';
import { RentalStatus } from '@modules/rentals/dtos/enums/RentatStatus';
import { IUpdateStatusRentalDTO } from '@modules/rentals/dtos/IUpdateStatusRentalUseCaseDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class UpdateStatusRentalUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  async execute({ id, status }: IUpdateStatusRentalDTO): Promise<Rental> {
    let statusToSave: string;
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    if (Object.values(RentalStatus).includes(status)) {
      statusToSave = status as RentalStatus;
    }

    Object.assign(rental, {
      status: statusToSave,
    });

    if (status === RentalStatus.CONFIRMED) {
      const templatePath = path.resolve(
        __dirname,
        '..',
        '..',
        'views',
        'emails',
        'create-rental.hbs'
      );

      const { name, email } = await this.userRepository.findById(rental.userId);

      await this.mailProvider.sendMail<{
        name: string;
        code: string;
        startDate: string;
        startHour: string;
        expectReturnDate: string;
        expectReturnHour: string;
        dailies: number;
        total: number;
      }>({
        path: templatePath,
        subject: 'Confirmação de reserva',
        to: email,
        variables: {
          name,
          code: rental.id,
          startDate: '',
          startHour: '',
          expectReturnDate: '',
          expectReturnHour: '',
          dailies: 0,
          total: 0,
        },
      });
    }

    return this.rentalRepository.save(rental);
  }
}
