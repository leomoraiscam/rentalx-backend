"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _RefreshTokenUseCase = _interopRequireDefault(require("./RefreshTokenUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RefreshTokenController {
  async handle(request, response) {
    const token = request.body.token || request.headers['x-access-token'] || request.query.token;

    const refreshTokenUseCase = _tsyringe.container.resolve(_RefreshTokenUseCase.default);

    const refresh_token = await refreshTokenUseCase.execute(token);
    return response.status(201).json(refresh_token);
  }

}

var _default = RefreshTokenController;
exports.default = _default;