import { UserRepository } from '@modules/accounts/infra/typeorm/repositories/UserRepository';
import { CreateUserUseCase } from '@modules/accounts/useCases/createUser/CreateUserUseCase';
import { BCryptHashProvider } from '@shared/container/providers/HashProvider/implementations/BCryptHashProvider';

import { CreateUserHandler } from '../handler/CreateUserHandler';

export function makeCreateUserHandler(): CreateUserHandler {
  const userRepository = new UserRepository();
  const cryptHashProvider = new BCryptHashProvider();

  const createUserUseCase = new CreateUserUseCase(
    userRepository,
    cryptHashProvider
  );

  const createUserHandler = new CreateUserHandler(createUserUseCase);

  return createUserHandler;
}
