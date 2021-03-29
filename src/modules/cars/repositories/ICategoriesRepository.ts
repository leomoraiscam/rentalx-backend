import Category from '../infra/typeorm/entities/Category';

interface ICreateRepository {
  name: string;
  description: string;
}

interface ICategoriesRepository {
  findByName(name: string): Promise<Category>;
  list(): Promise<Category[]>;
  create(data: ICreateRepository): Promise<void>;
}

export default ICategoriesRepository;
