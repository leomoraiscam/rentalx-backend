"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcryptjs = require("bcryptjs");

var _tsyringe = require("tsyringe");

var _IUsersRepository = _interopRequireDefault(require("../../repositories/IUsersRepository"));

var _IUsersTokensRepository = _interopRequireDefault(require("../../repositories/IUsersTokensRepository"));

var _IDateProvider = _interopRequireDefault(require("../../../../shared/container/providers/DateProvider/IDateProvider"));

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ResetPasswordUserUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UsersTokensRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('DayjsDateProvider')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('UserRepository')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _IUsersTokensRepository.default === "undefined" ? Object : _IUsersTokensRepository.default, typeof _IDateProvider.default === "undefined" ? Object : _IDateProvider.default, typeof _IUsersRepository.default === "undefined" ? Object : _IUsersRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class ResetPasswordUserUseCase {
  constructor(usersTokensRepository, dayjsDateProvider, usersRepository) {
    this.usersTokensRepository = usersTokensRepository;
    this.dayjsDateProvider = dayjsDateProvider;
    this.usersRepository = usersRepository;
  }

  async execute({
    token,
    password
  }) {
    const userToken = await this.usersTokensRepository.findByRefreshToken(token);

    if (!userToken) {
      throw new _AppError.default('Token invalid!');
    }

    if (this.dayjsDateProvider.compareIfBefore(userToken.expires_date, this.dayjsDateProvider.dateNow())) {
      throw new _AppError.default('Token expired!');
    }

    const user = await this.usersRepository.findById(userToken.user_id);
    user.password = await (0, _bcryptjs.hash)(password, 8);
    await this.usersRepository.create(user);
    await this.usersTokensRepository.deleteById(userToken.id);
  }

}) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = ResetPasswordUserUseCase;
exports.default = _default;