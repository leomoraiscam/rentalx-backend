import { getRepository, Repository } from 'typeorm';

import Category from '@modules/cars/infra/typeorm/entities/Category';
import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';

interface ICreateCategoryDTO {
  name: string;
  description: string;
}

class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async list(): Promise<Category[]> {
    const categories = await this.repository.find();

    return categories;
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<void> {
    const categorie = this.repository.create({
      name,
      description,
    });

    await this.repository.save(categorie);
  }

  async findByName(name: string): Promise<Category> {
    const category = this.repository.findOne({
      name,
    });

    return category;
  }
}

export default CategoriesRepository;
