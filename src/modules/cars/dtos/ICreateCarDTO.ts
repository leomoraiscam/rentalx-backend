import { CarImage } from '../infra/typeorm/entities/CarImage';
import { Category } from '../infra/typeorm/entities/Category';

export interface ICreateCarDTO {
  id?: string;
  name: string;
  description: string;
  dailyRate: number;
  licensePlate: string;
  fineAmount: number;
  brand: string;
  categoryId: string;
  specifications?: unknown; // Specification[] | string[];
  images?: CarImage[];
  category?: Category;
}
