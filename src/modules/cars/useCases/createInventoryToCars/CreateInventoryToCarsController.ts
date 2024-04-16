import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateInventoryToCarsUseCase } from './CreateInventoryToCarsUseCase';

export class CreateInventoryToCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { inventory } = request.body;

    const createInventoryToCarsUseCase = container.resolve(
      CreateInventoryToCarsUseCase
    );
    const availableInventory = await createInventoryToCarsUseCase.execute({
      inventory,
    });

    return response.status(201).json(availableInventory);
  }
}
