import { inject, injectable } from 'tsyringe';

import { IProfileUserDTO } from '@modules/accounts/dtos/IProfileUserDTO';
import { UserMap } from '@modules/accounts/mapper/UserMap';
import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';

@injectable()
export class ProfileUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository
  ) {}

  async execute(id: string): Promise<IProfileUserDTO> {
    const user = await this.userRepository.findById(id);

    return UserMap.toDTO(user);
  }
}
