import ICreateRentalDTO from '../dtos/ICreateRentalDTO';
import Rental from '../infra/typeorm/entities/Rentals';

interface IRentalsRepository {
  findOpebRentalByCar(car_id: string): Promise<Rental>;
  findOpenRentalByUser(user_id: string): Promise<Rental>;
  create(data: ICreateRentalDTO): Promise<Rental>;
  findById(id: string): Promise<Rental>;
}

export default IRentalsRepository;
