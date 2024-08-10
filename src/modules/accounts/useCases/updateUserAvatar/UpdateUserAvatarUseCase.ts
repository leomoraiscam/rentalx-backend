import { inject, injectable } from 'tsyringe';

import { IUpdateUserAvatarDTO } from '@modules/accounts/dtos/IUpdateUserAvatarDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class UpdateUserAvatarUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute(data: IUpdateUserAvatarDTO): Promise<User> {
    const { userId, avatarFile } = data;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      await this.storageProvider.delete(user.avatar, 'avatar');
    }

    await this.storageProvider.save(avatarFile, 'avatar');

    const updatedUserAvatar = Object.assign(user, { avatar: avatarFile });

    return this.userRepository.create(updatedUserAvatar);
  }
}
