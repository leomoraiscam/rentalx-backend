import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateCarImageUseCase } from './UpdateCarImageUseCase';

export class UpdateCarImageController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: carId, imageId } = request.params;
    const { filename } = request.file;

    const updateCarImageUseCase = container.resolve(UpdateCarImageUseCase);
    await updateCarImageUseCase.execute({ carId, imageId, fileName: filename });

    return response.status(200).send();
  }
}
