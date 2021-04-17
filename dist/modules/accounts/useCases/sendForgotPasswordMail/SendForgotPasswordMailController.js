"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _SendForgotPasswordMailUseCase = _interopRequireDefault(require("./SendForgotPasswordMailUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SendForgotPasswordMailController {
  async handle(request, response) {
    const {
      email
    } = request.body;

    const sendForgotPasswordMailUseCase = _tsyringe.container.resolve(_SendForgotPasswordMailUseCase.default);

    await sendForgotPasswordMailUseCase.execute(email);
    return response.send();
  }

}

var _default = SendForgotPasswordMailController;
exports.default = _default;