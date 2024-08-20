import { injectable, inject } from 'tsyringe';

import { IImportCategoriesDTO } from '@modules/cars/dtos/IImportCategoriesDTO';
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationRepository';
import { ICSVStreamParserProvider } from '@shared/container/providers/CSVStreamParserProvider/models/ICSVStreamParserProvider';

type IImportSpecificationsDTO = Omit<IImportCategoriesDTO, 'type'>;

@injectable()
export class ImportSpecificationsUseCase {
  constructor(
    @inject('SpecificationRepository')
    private specificationRepository: ISpecificationRepository,
    @inject('CSVStreamParserProvider')
    private CSVStreamParserProvider: ICSVStreamParserProvider
  ) {}

  async execute(file: Express.Multer.File): Promise<void> {
    const keys = ['name', 'description'];
    const specifications = await this.CSVStreamParserProvider.parse<IImportSpecificationsDTO>(
      file.path,
      keys
    );
    const specificationsPromises = specifications.map(async (data) => {
      const { name, description } = data;
      const specification = await this.specificationRepository.findByName(name);

      if (!specification) {
        await this.specificationRepository.create({
          name,
          description,
        });
      }
    });

    await Promise.all(specificationsPromises);
  }
}
