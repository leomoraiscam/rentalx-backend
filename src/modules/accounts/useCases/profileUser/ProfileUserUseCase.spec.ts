import { InMemoryUserRepository } from '../../repositories/in-memory/InMemoryUserRepository';
import { ProfileUserUseCase } from './ProfileUserUseCase';

describe('ProfileUserUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let profileUserUseCase: ProfileUserUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    profileUserUseCase = new ProfileUserUseCase(inMemoryUserRepository);
  });

  it('should be able to show user profile when user exist', async () => {
    const { id: userId } = await inMemoryUserRepository.create({
      name: 'Jennie McCoy',
      email: 'hiv@metja.lk',
      password: 'any-pass123',
      driverLicense: '5304286925',
      avatar: 'fake-avatar',
      isAdmin: false,
    });

    const profile = await profileUserUseCase.execute(userId);

    expect(profile).toEqual({
      id: userId,
      name: 'Jennie McCoy',
      email: 'hiv@metja.lk',
      driverLicense: '5304286925',
      avatar: 'fake-avatar',
      avatarUrl: 'http://localhost:3333/avatar/fake-avatar',
      createdAt: undefined,
      isAdmin: false,
    });
  });
});
