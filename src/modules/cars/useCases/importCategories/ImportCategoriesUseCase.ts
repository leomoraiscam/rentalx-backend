/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { injectable, inject } from 'tsyringe';

import { ICreateCategoryDTO } from '@modules/cars/dtos/ICreateCategoryDTO';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';
import { ICSVStreamParserProvider } from '@shared/container/providers/CSVStreamParserProvider/models/ICSVStreamParserProvider';

@injectable()
export class ImportCategoriesUseCase {
  constructor(
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository,
    @inject('CSVStreamParserProvider')
    private CSVStreamParserProvider: ICSVStreamParserProvider
  ) {}

  async execute(file: Express.Multer.File): Promise<void> {
    const keys = ['name', 'description', 'type'];
    const categories = await this.CSVStreamParserProvider.parse<ICreateCategoryDTO>(
      file.path,
      keys
    );

    for (const data of categories) {
      const { name, description, type } = data;
      const category = await this.categoryRepository.findByName(name);

      if (!category) {
        await this.categoryRepository.create({
          name,
          description,
          type,
        });
      }
    }
  }
}
