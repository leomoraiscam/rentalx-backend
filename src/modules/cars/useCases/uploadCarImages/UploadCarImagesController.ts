import { Response, Request } from 'express';
import { container } from 'tsyringe';

import { UploadCarImagesUseCase } from './UploadCarImagesUseCase';

export class UploadCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: carId } = request.params;
    const images = request.files as Express.Multer.File[];
    const uploadCarImageUseCase = container.resolve(UploadCarImagesUseCase);

    await uploadCarImageUseCase.execute({
      carId,
      images,
    });

    return response.status(201).send();
  }
}
