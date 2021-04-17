"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ResetPasswordUserUseCase = _interopRequireDefault(require("./ResetPasswordUserUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ResetPasswordUserController {
  async handle(request, response) {
    const {
      token
    } = request.query;
    const {
      password
    } = request.body;

    const resetPasswordUserUseCase = _tsyringe.container.resolve(_ResetPasswordUserUseCase.default);

    await resetPasswordUserUseCase.execute({
      token: String(token),
      password
    });
    return response.send();
  }

}

var _default = ResetPasswordUserController;
exports.default = _default;