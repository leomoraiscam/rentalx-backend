"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureAdmin;

var _UsersRepository = _interopRequireDefault(require("../../../../modules/accounts/infra/typeorm/repositories/UsersRepository"));

var _AppError = _interopRequireDefault(require("../../../errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function ensureAdmin(request, response, next) {
  const {
    id
  } = request.user;
  const usersRepository = new _UsersRepository.default();
  const user = await usersRepository.findById(id);

  if (!user.isAdmin) {
    throw new _AppError.default('Users isnt not admin!');
  }

  return next();
}