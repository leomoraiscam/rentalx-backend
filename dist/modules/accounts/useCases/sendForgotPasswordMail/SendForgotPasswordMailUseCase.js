"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _tsyringe = require("tsyringe");

var _uuid = require("uuid");

var _IUsersRepository = _interopRequireDefault(require("../../repositories/IUsersRepository"));

var _IUsersTokensRepository = _interopRequireDefault(require("../../repositories/IUsersTokensRepository"));

var _IDateProvider = _interopRequireDefault(require("../../../../shared/container/providers/DateProvider/IDateProvider"));

var _IMailProvider = _interopRequireDefault(require("../../../../shared/container/providers/MailProvider/IMailProvider"));

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let SendForgotPasswordMailUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UserRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('UsersTokensRepository')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('DayjsDateProvider')(target, undefined, 2);
}, _dec5 = function (target, key) {
  return (0, _tsyringe.inject)('EtherealMailProvider')(target, undefined, 3);
}, _dec6 = Reflect.metadata("design:type", Function), _dec7 = Reflect.metadata("design:paramtypes", [typeof _IUsersRepository.default === "undefined" ? Object : _IUsersRepository.default, typeof _IUsersTokensRepository.default === "undefined" ? Object : _IUsersTokensRepository.default, typeof _IDateProvider.default === "undefined" ? Object : _IDateProvider.default, typeof _IMailProvider.default === "undefined" ? Object : _IMailProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = _dec7(_class = class SendForgotPasswordMailUseCase {
  constructor(usersRepository, usersTokensRepository, dayjsDateProvider, mailProvider) {
    this.usersRepository = usersRepository;
    this.usersTokensRepository = usersTokensRepository;
    this.dayjsDateProvider = dayjsDateProvider;
    this.mailProvider = mailProvider;
  }

  async execute(email) {
    const user = await this.usersRepository.findByEmail(email);

    const templatePath = _path.default.resolve(__dirname, '..', '..', 'views', 'emails', 'forgotPassword.hbs');

    if (!user) {
      throw new _AppError.default('User does not exist!');
    }

    const token = (0, _uuid.v4)();
    const expires_date = this.dayjsDateProvider.addHours(3);
    await this.usersTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date
    });
    const variables = {
      name: user.name,
      link: `${process.env.FORGOT_MAIL_URL}${token}`
    };
    await this.mailProvider.sendMail(email, 'Recuperação de senha', variables, templatePath);
  }

}) || _class) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = SendForgotPasswordMailUseCase;
exports.default = _default;