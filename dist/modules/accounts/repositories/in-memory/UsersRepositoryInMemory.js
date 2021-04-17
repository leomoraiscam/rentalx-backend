"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _User = _interopRequireDefault(require("../../infra/typeorm/entities/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UsersRepositoryInMemory {
  constructor() {
    this.users = [];
  }

  async findById(id) {
    const user = await this.users.find(user => user.id === id);
    return user;
  }

  async findByEmail(email) {
    const user = await this.users.find(user => user.email === email);
    return user;
  }

  async create({
    name,
    email,
    password,
    driver_license
  }) {
    const user = new _User.default();
    Object.assign(user, {
      name,
      email,
      password,
      driver_license
    });
    this.users.push(user);
  }

}

var _default = UsersRepositoryInMemory;
exports.default = _default;