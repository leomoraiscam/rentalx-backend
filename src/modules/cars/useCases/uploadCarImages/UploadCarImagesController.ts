import { Response, Request } from 'express';
import { container } from 'tsyringe';

import { UploadCarImagesUseCase } from './UploadCarImagesUseCase';

export class UploadCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: carId } = request.params;
    const { fileNames } = request;
    const uploadCarImageUseCase = container.resolve(UploadCarImagesUseCase);

    await uploadCarImageUseCase.execute({
      carId,
      fileNames,
    });

    return response.status(200).send();
  }
}
