"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classTransformer = require("class-transformer");

class UserMap {
  static toDTO({
    id,
    name,
    email,
    avatar,
    driver_license,
    avatar_url
  }) {
    const user = (0, _classTransformer.classToClass)({
      id,
      name,
      email,
      avatar,
      driver_license,
      avatar_url
    });
    return user;
  }

}

var _default = UserMap;
exports.default = _default;