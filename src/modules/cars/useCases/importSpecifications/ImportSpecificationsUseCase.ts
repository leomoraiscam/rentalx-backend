import csvParse from 'csv-parse';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import { IImportCategoriesDTO } from '@modules/cars/dtos/IImportCategoriesDTO';
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationRepository';

type IImportSpecificationsDTO = Omit<IImportCategoriesDTO, 'type'>;

@injectable()
export class ImportSpecificationsUseCase {
  constructor(
    @inject('SpecificationRepository')
    private specificationRepository: ISpecificationRepository
  ) {}

  loadSpecifications(
    file: Express.Multer.File
  ): Promise<IImportSpecificationsDTO[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);
      const specifications: IImportSpecificationsDTO[] = [];

      const parseFile = csvParse();

      stream.pipe(parseFile);

      parseFile
        .on('data', async (line) => {
          const [name, description] = line;

          specifications.push({
            name,
            description,
          });
        })
        .on('end', () => {
          fs.promises.unlink(file.path);

          resolve(specifications);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const specifications = await this.loadSpecifications(file);

    specifications.map(async (data) => {
      const { name, description } = data;

      const specification = await this.specificationRepository.findByName(name);

      if (!specification) {
        await this.specificationRepository.create({
          name,
          description,
        });
      }
    });
  }
}
