"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ensureAuthenticated;

var _jsonwebtoken = require("jsonwebtoken");

var _auth = _interopRequireDefault(require("@config/auth"));

var _UsersTokensRepository = _interopRequireDefault(require("@modules/accounts/infra/typeorm/repositories/UsersTokensRepository"));

var _AppError = _interopRequireDefault(require("@shared/errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;
  const userTokensRepository = new _UsersTokensRepository.default();

  if (!authHeader) {
    throw new _AppError.default('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const {
      sub: user_id
    } = (0, _jsonwebtoken.verify)(token, _auth.default.secret_refresh_token);
    const user = await userTokensRepository.findByUserIdAndRefreshToken(user_id, token);

    if (!user) {
      throw new _AppError.default('User does not exist!', 401);
    }

    request.user = {
      id: user_id
    };
    next();
  } catch (error) {
    throw new _AppError.default('Invalid token!', 401);
  }
}