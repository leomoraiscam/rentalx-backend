import UserRepositoryInMemory from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import UsersTokensRepositoryInMemory from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import DayjsDateProvider from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import AppError from '@shared/errors/AppError';

import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import CreateUserUseCase from '../createUser/CreateUserUseCase';
import AuthenticatedUserUseCase from './AuthenticatedUserUseCase';

let createUserUseCase: CreateUserUseCase;
let authenticatedUserUseCase: AuthenticatedUserUseCase;
let userRepositoryInMemory: UserRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe('Authenticate User', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    dayjsDateProvider = new DayjsDateProvider();
    authenticatedUserUseCase = new AuthenticatedUserUseCase(
      userRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dayjsDateProvider
    );
  });

  it('should be able to authenticated an user', async () => {
    const user: ICreateUserDTO = {
      driver_license: '000123',
      email: 'user@test.com.br',
      password: '123456',
      name: 'User Test',
    };

    await createUserUseCase.execute(user);

    const result = await authenticatedUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
  });

  it('should not be able to authenticated an non-existent user', async () => {
    await expect(
      authenticatedUserUseCase.execute({
        email: 'email@test.com',
        password: '123456',
      })
    ).rejects.toEqual(new AppError('Email or password incorrect', 401));
  });

  it('should not be able to authenticated with incorrect user password', async () => {
    const user: ICreateUserDTO = {
      driver_license: '000123',
      email: 'user@test.com.br',
      password: '123456',
      name: 'User Test',
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticatedUserUseCase.execute({
        email: user.email,
        password: 'wrong-password',
      })
    ).rejects.toEqual(new AppError('Email or password incorrect', 401));
  });
});
