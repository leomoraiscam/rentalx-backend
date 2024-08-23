import { inject, injectable } from 'tsyringe';

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { UserMap } from '@modules/accounts/mapper/UserMap';
import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';
import { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  async execute(data: ICreateUserDTO): Promise<User> {
    const { name, email, password, driverLicense, isAdmin } = data;
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      throw new AppError('User with this email already exists', 409);
    }

    const existingUserWithDriveLicense = await this.userRepository.findByDriverLicense(
      driverLicense
    );

    if (existingUserWithDriveLicense) {
      throw new AppError('This document already exists for some user', 409);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);
    const userInstanceCreated = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
      driverLicense,
      isAdmin,
    });

    return UserMap.toDTO(userInstanceCreated) as User;
  }
}
