import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateCarImagesUseCase } from './UpdateCarImagesUseCase';

export class UpdateCarImagesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: carId } = request.params;
    const { fileNames } = request;

    const updateCarImagesUseCase = container.resolve(UpdateCarImagesUseCase);
    await updateCarImagesUseCase.execute({ carId, fileNames });

    return response.status(200).send();
  }
}
