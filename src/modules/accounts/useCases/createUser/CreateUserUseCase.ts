import { inject, injectable } from 'tsyringe';

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';
import { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  async execute({
    name,
    email,
    password,
    driverLicense,
  }: ICreateUserDTO): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new AppError('User with this email already exists', 409);
    }

    const existedUserWithDriveLicense = await this.userRepository.findByDriverLicense(
      driverLicense
    );

    if (existedUserWithDriveLicense) {
      throw new AppError('This document already exists for some user', 409);
    }

    const hashPassword = await this.hashProvider.generateHash(password);

    return this.userRepository.create({
      name,
      email,
      password: hashPassword,
      driverLicense,
    });
  }
}
