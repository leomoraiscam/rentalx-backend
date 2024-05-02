import csvParse from 'csv-parse';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import { IImportCategoriesDTO } from '@modules/cars/dtos/IImportCategoriesDTO';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';

@injectable()
export class ImportCategoryUseCase {
  constructor(
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository
  ) {}

  loadCategories(file: Express.Multer.File): Promise<IImportCategoriesDTO[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);
      const categories: IImportCategoriesDTO[] = [];

      const parseFile = csvParse();

      stream.pipe(parseFile);

      parseFile
        .on('data', async (line) => {
          const [name, description, type] = line;

          categories.push({
            name,
            description,
            type,
          });
        })
        .on('end', () => {
          fs.promises.unlink(file.path);

          resolve(categories);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file);

    categories.map(async (data) => {
      const { name, description, type } = data;

      const category = await this.categoryRepository.findByName(name);

      if (!category) {
        await this.categoryRepository.create({
          name,
          description,
          type,
        });
      }
    });
  }
}
