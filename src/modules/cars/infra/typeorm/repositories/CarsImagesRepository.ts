import { getRepository, Repository } from 'typeorm';

import CarImage from '@modules/cars/infra/typeorm/entities/CarImage';
import ICarImagesRepository from '@modules/cars/repositories/ICarsImagesRepository';

class CarImagesRepository implements ICarImagesRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  }

  async create(car_id: string, image_name: string): Promise<CarImage> {
    const CarImage = this.repository.create({
      car_id,
      image_name,
    });

    await this.repository.save(CarImage);

    return CarImage;
  }
}

export default CarImagesRepository;
