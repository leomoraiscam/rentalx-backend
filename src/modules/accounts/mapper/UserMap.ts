import { classToClass } from 'class-transformer';

import { IProfileUserDTO } from '../dtos/IProfileUserDTO';
import { User } from '../infra/typeorm/entities/User';

export class UserMap {
  static toDTO(data: User): IProfileUserDTO {
    const {
      id,
      name,
      email,
      driverLicense,
      avatarUrl,
      avatar,
      createdAt,
      isAdmin,
    } = data;

    return classToClass({
      id,
      name,
      email,
      driverLicense,
      avatarUrl,
      avatar,
      createdAt,
      isAdmin,
    });
  }
}
