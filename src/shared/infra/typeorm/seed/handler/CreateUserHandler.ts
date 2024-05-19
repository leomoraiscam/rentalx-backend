import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { CreateUserUseCase } from '@modules/accounts/useCases/createUser/CreateUserUseCase';

import { ISeederHandler } from '../adapters/ports/ISeederHandler';

export class CreateUserHandler implements ISeederHandler {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(data: ICreateUserDTO): Promise<void> {
    await this.createUserUseCase.execute(data);
  }
}
