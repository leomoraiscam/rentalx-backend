"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _AuthenticatedUserUseCase = _interopRequireDefault(require("./AuthenticatedUserUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AuthenticatedUserController {
  async handle(request, response) {
    const {
      email,
      password
    } = request.body;

    const authenticatedUserUseCase = _tsyringe.container.resolve(_AuthenticatedUserUseCase.default);

    const token = await authenticatedUserUseCase.execute({
      email,
      password
    });
    return response.status(201).json(token);
  }

}

var _default = AuthenticatedUserController;
exports.default = _default;