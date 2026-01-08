/* eslint-disable no-empty */
import { inject, injectable } from 'tsyringe';

import { IUpdateUserAvatarDTO } from '@modules/accounts/dtos/IUpdateUserAvatarDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { UserMap } from '@modules/accounts/mapper/UserMap';
import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';
import { UploadFolder } from '@shared/common/enums/uploadFolder';
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
    const { userId, avatar } = data;
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    try {
      const oldAvatarFile = user.avatar;

      try {
        await this.storageProvider.save(avatar, UploadFolder.AVATAR);
      } catch (error) {
        throw new AppError('Failed to save new avatar file.', 500);
      }

      user.avatar = avatar;
      let updatedUser: User;

      try {
        updatedUser = await this.userRepository.save(user);
      } catch (dbError) {
        await this.storageProvider.delete(avatar, UploadFolder.AVATAR);

        throw new AppError('Failed to update user avatar in database.', 500);
      }

      if (oldAvatarFile) {
        try {
          await this.storageProvider.delete(oldAvatarFile, UploadFolder.AVATAR);
        } catch (error) {}
      }

      return UserMap.toDTO(updatedUser) as User;
    } catch (err) {
      throw new AppError(`Failed to upload image`, 500);
    }
  }
}
