"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _CreateUserUseCase = _interopRequireDefault(require("./CreateUserUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CreateUserController {
  async handle(request, response) {
    const {
      name,
      email,
      password,
      driver_license
    } = request.body;

    const createUserUseCase = _tsyringe.container.resolve(_CreateUserUseCase.default);

    await createUserUseCase.execute({
      name,
      email,
      password,
      driver_license
    });
    return response.status(201).send();
  }

}

var _default = CreateUserController;
exports.default = _default;