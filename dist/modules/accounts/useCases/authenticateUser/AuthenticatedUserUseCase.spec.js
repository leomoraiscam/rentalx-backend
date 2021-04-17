"use strict";

var _UsersRepositoryInMemory = _interopRequireDefault(require("../../repositories/in-memory/UsersRepositoryInMemory"));

var _UsersTokensRepositoryInMemory = _interopRequireDefault(require("../../repositories/in-memory/UsersTokensRepositoryInMemory"));

var _DayjsDateProvider = _interopRequireDefault(require("../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider"));

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _CreateUserUseCase = _interopRequireDefault(require("../createUser/CreateUserUseCase"));

var _AuthenticatedUserUseCase = _interopRequireDefault(require("./AuthenticatedUserUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let createUserUseCase;
let authenticatedUserUseCase;
let userRepositoryInMemory;
let usersTokensRepositoryInMemory;
let dayjsDateProvider;
describe('Authenticate User', () => {
  beforeEach(() => {
    userRepositoryInMemory = new _UsersRepositoryInMemory.default();
    usersTokensRepositoryInMemory = new _UsersTokensRepositoryInMemory.default();
    createUserUseCase = new _CreateUserUseCase.default(userRepositoryInMemory);
    dayjsDateProvider = new _DayjsDateProvider.default();
    authenticatedUserUseCase = new _AuthenticatedUserUseCase.default(userRepositoryInMemory, usersTokensRepositoryInMemory, dayjsDateProvider);
  });
  it('should be able to authenticated an user', async () => {
    const user = {
      driver_license: '000123',
      email: 'user@test.com.br',
      password: '123456',
      name: 'User Test'
    };
    await createUserUseCase.execute(user);
    const result = await authenticatedUserUseCase.execute({
      email: user.email,
      password: user.password
    });
    expect(result).toHaveProperty('token');
  });
  it('should not be able to authenticated an non-existent user', async () => {
    await expect(authenticatedUserUseCase.execute({
      email: 'email@test.com',
      password: '123456'
    })).rejects.toEqual(new _AppError.default('Email or password incorrect', 401));
  });
  it('should not be able to authenticated with incorrect user password', async () => {
    const user = {
      driver_license: '000123',
      email: 'user@test.com.br',
      password: '123456',
      name: 'User Test'
    };
    await createUserUseCase.execute(user);
    await expect(authenticatedUserUseCase.execute({
      email: user.email,
      password: 'wrong-password'
    })).rejects.toEqual(new _AppError.default('Email or password incorrect', 401));
  });
});