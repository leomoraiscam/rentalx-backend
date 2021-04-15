import { inject, injectable } from 'tsyringe';

import IUserResponseDTO from '@modules/accounts/dtos/IUserResponseDTO';
import User from '@modules/accounts/infra/typeorm/entities/User';
import UserMap from '@modules/accounts/mapper/UserMap';
import IUserRepository from '@modules/accounts/repositories/IUsersRepository';

@injectable()
class ProfileUserUseCase {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<IUserResponseDTO> {
    const user = await this.usersRepository.findById(id);

    return UserMap.toDTO(user);
  }
}

export default ProfileUserUseCase;
