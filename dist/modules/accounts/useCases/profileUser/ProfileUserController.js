"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ProfileUserUseCase = _interopRequireDefault(require("./ProfileUserUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProfileUserController {
  async handle(request, response) {
    const {
      id
    } = request.user;

    const profileUserUseCase = _tsyringe.container.resolve(_ProfileUserUseCase.default);

    const user = await profileUserUseCase.execute(id);
    return response.status(200).json(user);
  }

}

var _default = ProfileUserController;
exports.default = _default;