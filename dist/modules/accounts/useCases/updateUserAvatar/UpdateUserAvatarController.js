"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _UpdateUserAvatarUseCase = _interopRequireDefault(require("./UpdateUserAvatarUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UpdateUserAvatarController {
  async handle(request, response) {
    const {
      id
    } = request.user;
    const avatar_file = request.file.filename;

    const updateUserAvatarUseCase = _tsyringe.container.resolve(_UpdateUserAvatarUseCase.default);

    await updateUserAvatarUseCase.execute({
      user_id: id,
      avatar_file
    });
    return response.status(200).send();
  }

}

var _default = UpdateUserAvatarController;
exports.default = _default;