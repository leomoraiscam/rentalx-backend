import { InMemoryStorageProvider } from '@shared/container/providers/StorageProvider/in-memory/InMemoryStorageProvider';
import { AppError } from '@shared/errors/AppError';

import { InMemoryUserRepository } from '../../repositories/in-memory/InMemoryUserRepository';
import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

describe('UpdateUserAvatarUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryStorageProvider: InMemoryStorageProvider;
  let updateUserAvatarUseCase: UpdateUserAvatarUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryStorageProvider = new InMemoryStorageProvider();
    updateUserAvatarUseCase = new UpdateUserAvatarUseCase(
      inMemoryUserRepository,
      inMemoryStorageProvider
    );
  });

  it('should be able to update avatar a user', async () => {
    const user = await inMemoryUserRepository.create({
      name: 'Richard Thomas',
      email: 'ana@ru.sv',
      password: 'any-password@123',
      driverLicense: '8364802278',
    });
    const { id: userId } = user;

    await updateUserAvatarUseCase.execute({
      userId,
      avatarFile: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar when a non existing user', async () => {
    await expect(
      updateUserAvatarUseCase.execute({
        userId: 'non-existing-user',
        avatarFile: 'avatar.jpg',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old avatar file when updating user avatar', async () => {
    const deleteFileSpied = jest.spyOn(inMemoryStorageProvider, 'delete');
    const avatarFile = 'avatar-file.jpg';
    const { id: userId } = await inMemoryUserRepository.create({
      name: 'Cody Reid',
      email: 'weppute@lubpep.cu',
      password: 'password@123',
      driverLicense: '6878209902',
      avatar: 'old-avatar-file.jpg',
    });

    await updateUserAvatarUseCase.execute({ userId, avatarFile });

    expect(deleteFileSpied).toHaveBeenCalledTimes(1);
    expect(deleteFileSpied).toHaveBeenCalledWith(
      'old-avatar-file.jpg',
      'avatar'
    );
  });
});
