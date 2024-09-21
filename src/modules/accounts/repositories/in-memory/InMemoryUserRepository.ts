import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';

import { IUserRepository } from '../IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email);
  }

  async findByDriverLicense(driverLicense: string): Promise<User | null> {
    return this.users.find((user) => user.driverLicense === driverLicense);
  }

  async create(data: ICreateUserDTO): Promise<User> {
    const { name, email, password, driverLicense, isAdmin, avatar } = data;
    const user = new User();

    Object.assign(user, {
      name,
      email,
      password,
      driverLicense,
      isAdmin,
      avatar,
    });

    this.users.push(user);

    return user;
  }

  async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex((data) => data.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}
