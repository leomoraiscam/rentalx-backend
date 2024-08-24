import { injectable, inject } from 'tsyringe';

import { ICreateSpecificationDTO } from '@modules/cars/dtos/ICreateSpecificationDTO';
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationRepository';
import { ICSVStreamParserProvider } from '@shared/container/providers/CSVStreamParserProvider/models/ICSVStreamParserProvider';

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
    const specificationsToUpload = await this.CSVStreamParserProvider.parse<ICreateSpecificationDTO>(
      file.path,
      keys
    );
    const specificationsPromises = specificationsToUpload.map(async (data) => {
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
