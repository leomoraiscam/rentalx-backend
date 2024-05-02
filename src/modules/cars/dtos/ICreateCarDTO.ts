import { CarImage } from '../infra/typeorm/entities/CarImage';
import { Category } from '../infra/typeorm/entities/Category';
import { Specification } from '../infra/typeorm/entities/Specification';

export interface ICreateCarDTO {
  id?: string;
  name: string;
  description: string;
  dailyRate: number;
  licensePlate: string;
  fineAmount: number;
  brand: string;
  categoryId: string;
  specifications?: Specification[];
  images?: CarImage[];
  category?: Category;
}
