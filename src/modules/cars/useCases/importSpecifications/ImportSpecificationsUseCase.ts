/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
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
    const specifications = await this.CSVStreamParserProvider.parse<ICreateSpecificationDTO>(
      file.path,
      keys
    );

    for (const data of specifications) {
      const { name, description } = data;
      const specification = await this.specificationRepository.findByName(name);

      if (!specification) {
        await this.specificationRepository.create({
          name,
          description,
        });
      }
    }
  }
}
