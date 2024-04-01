import { getRepository, Repository } from 'typeorm';

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';

export class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ email });
  }

  async findByDriverLicense(driverLicense: string): Promise<User> {
    return this.repository.findOne({
      driverLicense,
    });
  }

  async create(data: ICreateUserDTO): Promise<User> {
    const { id, name, email, password, driverLicense, avatar } = data;

    const user = this.repository.create({
      id,
      name,
      email,
      password,
      driverLicense,
      avatar,
    });

    await this.repository.save(user);

    return user;
  }
}
