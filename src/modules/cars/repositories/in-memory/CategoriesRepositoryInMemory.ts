import Category from '../../infra/typeorm/entities/Category';
import ICategoriesRepository from '../ICategoriesRepository';

interface ICreateRepository {
  name: string;
  description: string;
}

class CategoriesRepositoryInMemory implements ICategoriesRepository {
  categories: Category[] = [];

  async findByName(name: string): Promise<Category> {
    const category = this.categories.find((category) => category.name === name);

    return category;
  }

  async list(): Promise<Category[]> {
    return this.categories;
  }

  async create({ name, description }: ICreateRepository): Promise<void> {
    const category = new Category();

    Object.assign(category, {
      name,
      description,
    });

    this.categories.push(category);
  }
}

export default CategoriesRepositoryInMemory;
