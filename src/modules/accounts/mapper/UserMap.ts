import { classToClass } from 'class-transformer';

import { IProfileUserDTO } from '../dtos/IProfileUserDTO';
import { User } from '../infra/typeorm/entities/User';

export class UserMap {
  private static obfuscatedDriverLicense(driverLicense: string): string {
    return driverLicense
      ? `*****${driverLicense.substring(driverLicense.length - 3)}`
      : null;
  }

  static toDTO(data: User): IProfileUserDTO {
    const { id, name, email, driverLicense, createdAt } = data;

    return classToClass({
      id,
      name,
      email,
      driverLicense: this.obfuscatedDriverLicense(driverLicense),
      avatarUrl: data.avatarUrl(),
      createdAt,
    });
  }
}
