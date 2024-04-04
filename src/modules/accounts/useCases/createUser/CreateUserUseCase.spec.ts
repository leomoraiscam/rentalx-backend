import { InMemoryUserRepository } from '@modules/accounts/repositories/in-memory/InMemoryUserRepository';
import { InMemoryHashProvider } from '@shared/container/providers/HashProvider/in-memory/InMemoryHashProvider';
import AppError from '@shared/errors/AppError';

import { CreateUserUseCase } from './CreateUserUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryHashProvider: InMemoryHashProvider;
let createUserUseCase: CreateUserUseCase;

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryHashProvider = new InMemoryHashProvider();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUserRepository,
      inMemoryHashProvider
    );
  });

  it('should be able to create a new user when received correct data', async () => {
    const user = await createUserUseCase.execute({
      name: 'Claudia Sharp',
      email: 'nettu@cochu.bg',
      password: 'pass@123',
      driverLicense: '7545472319',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user when email already exist', async () => {
    await inMemoryUserRepository.create({
      name: 'Teresa Hammond',
      email: 'fal@kecahpos.jm',
      password: 'pass123',
      driverLicense: '9118477562',
    });

    await expect(
      createUserUseCase.execute({
        name: 'Stella Bradley',
        email: 'fal@kecahpos.jm',
        password: 'pass123',
        driverLicense: '7203294633',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new user when driver license already exist', async () => {
    await inMemoryUserRepository.create({
      name: 'Jennie McCoy',
      email: 'hiv@metja.lk',
      password: 'any-pass123',
      driverLicense: '5304286925',
    });

    await expect(
      createUserUseCase.execute({
        name: 'Sue Rogers',
        email: 'guwda@ih.za',
        password: 'any-pass123',
        driverLicense: '5304286925',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
