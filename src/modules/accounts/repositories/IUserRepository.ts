import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { User } from '../infra/typeorm/entities/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByDriverLicense(driverLicense: string): Promise<User | null>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
