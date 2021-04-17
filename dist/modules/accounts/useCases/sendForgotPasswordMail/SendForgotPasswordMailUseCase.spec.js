"use strict";

var _UsersRepositoryInMemory = _interopRequireDefault(require("../../repositories/in-memory/UsersRepositoryInMemory"));

var _UsersTokensRepositoryInMemory = _interopRequireDefault(require("../../repositories/in-memory/UsersTokensRepositoryInMemory"));

var _DayjsDateProvider = _interopRequireDefault(require("../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider"));

var _MailProviderInMemory = _interopRequireDefault(require("../../../../shared/container/providers/MailProvider/in-memory/MailProviderInMemory"));

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _SendForgotPasswordMailUseCase = _interopRequireDefault(require("./SendForgotPasswordMailUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let sendForgotPasswordMailUseCase;
let userRepositoryInMemory;
let usersTokensRepositoryInMemory;
let dayjsDateProvider;
let mailProviderInMemory;
describe('Send forgot mail', () => {
  beforeEach(() => {
    userRepositoryInMemory = new _UsersRepositoryInMemory.default();
    usersTokensRepositoryInMemory = new _UsersTokensRepositoryInMemory.default();
    dayjsDateProvider = new _DayjsDateProvider.default();
    mailProviderInMemory = new _MailProviderInMemory.default();
    sendForgotPasswordMailUseCase = new _SendForgotPasswordMailUseCase.default(userRepositoryInMemory, usersTokensRepositoryInMemory, dayjsDateProvider, mailProviderInMemory);
  });
  it('should be able to send a forgot password mail to user', async () => {
    const sendMail = spyOn(mailProviderInMemory, 'sendMail');
    await userRepositoryInMemory.create({
      driver_license: '424-6812',
      email: 'sinaasi@bo.hu',
      name: 'Georgia Manning',
      password: '1234'
    });
    await sendForgotPasswordMailUseCase.execute('sinaasi@bo.hu');
    expect(sendMail).toHaveBeenCalled();
  });
  it('should not be able to send a mail if user does not exist', async () => {
    await expect(sendForgotPasswordMailUseCase.execute('ha@mal.gp')).rejects.toEqual(new _AppError.default('User does not exist!'));
  });
  it('should be able to create an users tokens', async () => {
    const generateTokenMail = spyOn(usersTokensRepositoryInMemory, 'create');
    await userRepositoryInMemory.create({
      driver_license: '481-6813',
      email: 'le@adoom.sl',
      name: 'Wesley Walters',
      password: '1234'
    });
    await sendForgotPasswordMailUseCase.execute('le@adoom.sl');
    expect(generateTokenMail).toHaveBeenCalled();
  });
});