import { injectable, inject } from 'tsyringe';

import { IImportCategoriesDTO } from '@modules/cars/dtos/IImportCategoriesDTO';
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
    const categories = await this.CSVStreamParserProvider.parse<IImportCategoriesDTO>(
      file.path,
      keys
    );

    const categoriesPromises = categories.map(async (data) => {
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

    await Promise.all(categoriesPromises);
  }
}
