"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _UserTokens = _interopRequireDefault(require("../entities/UserTokens"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UsersTokensRepository {
  constructor() {
    this.repository = void 0;
    this.repository = (0, _typeorm.getRepository)(_UserTokens.default);
  }

  async findByUserIdAndRefreshToken(user_id, refresh_token) {
    const userTokens = await this.repository.findOne({
      user_id,
      refresh_token
    });
    return userTokens;
  }

  async findByRefreshToken(refresh_token) {
    const userToken = await this.repository.findOne({
      refresh_token
    });
    return userToken;
  }

  async create({
    user_id,
    refresh_token,
    expires_date
  }) {
    const userToken = this.repository.create({
      user_id,
      refresh_token,
      expires_date
    });
    await this.repository.save(userToken);
    return userToken;
  }

  async deleteById(id) {
    await this.repository.delete(id);
  }

}

var _default = UsersTokensRepository;
exports.default = _default;