import { Response, Request } from 'express';
import { container } from 'tsyringe';

import { File as Files } from '@modules/cars/dtos/types/file';

import { UploadCarImageUseCase } from './UploadCarImagesUseCase';

export class UploadCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: carId } = request.params;
    const images = request.files as Files[];
    const uploadCarImageUseCase = container.resolve(UploadCarImageUseCase);
    const imagesName = images.map((file) => file.filename);

    await uploadCarImageUseCase.execute({
      carId,
      imagesName,
    });

    return response.status(201).send();
  }
}
