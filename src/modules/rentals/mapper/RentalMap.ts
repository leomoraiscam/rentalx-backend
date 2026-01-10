import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';

import { IDetailRentalResponseDTO } from '../dtos/IDetailRentalResponseDTO';
import { IDevolutionRentalDTO } from '../dtos/IDevolutionRentalDTO';
import { IDevolutionResponseDTO } from '../dtos/IDevolutionResponseDTO';
import { IListRentalsResponseDTO } from '../dtos/IListRentalsResponseDTO';

export class RentalMap {
  static toList(rental: Rental): IListRentalsResponseDTO {
    const { car } = rental;
    const mainImage =
      car.images.length > 0
        ? `http://localhost:3333/cars/images/${car.images[0].imageName}`
        : null;

    return {
      id: rental.id,
      status: rental.status,
      vehicle: {
        brand: car?.brand,
        model: car?.name,
        image: mainImage,
        licensePlate: car?.licensePlate,
      },
      period: {
        startDate: rental.startDate,
        endDate: rental.endDate,
      },
      finance: {
        total: Number(rental.total || 0),
      },
    };
  }

  static toDetail(rental: Rental): IDetailRentalResponseDTO {
    const { car } = rental;
    const mainImage =
      car.images.length > 0
        ? `http://localhost:3333/cars/images/${car.images[0].imageName}`
        : null;

    return {
      id: rental.id,
      status: rental.status,
      vehicle: {
        brand: car?.brand,
        model: car?.name,
        image: mainImage,
        licensePlate: car?.licensePlate,
      },
      period: {
        startDate: rental.startDate,
        endDate: rental.endDate,
      },
      finance: {
        total: Number(rental.total || 0),
      },
    };
  }

  static toReceipt(data: IDevolutionRentalDTO): IDevolutionResponseDTO {
    const { rental, daysRented, daysOverdue, fine, total } = data;

    return {
      rentalId: rental.id,
      vehicle: {
        brand: rental.car.brand,
        model: rental.car.name,
        licensePlate: rental.car.licensePlate,
        category: rental.car.category.name,
      },
      period: {
        startDate: rental.startDate,
        endDate: rental.endDate,
        durationInDays: daysRented,
        delayInDays: daysOverdue > 0 ? daysOverdue : 0,
      },
      finance: {
        dailyRate: rental.car.dailyRate,
        daysCharged: daysRented,
        subtotalDaily: total,
        fineAmount: fine,
        total: rental.total,
      },
      status: rental.status,
    };
  }
}
