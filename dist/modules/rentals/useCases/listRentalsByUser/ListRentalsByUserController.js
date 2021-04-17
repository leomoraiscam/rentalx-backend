"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ListRentalsByUserUseCase = _interopRequireDefault(require("./ListRentalsByUserUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ListRentalsByUserController {
  async handle(request, response) {
    const {
      id
    } = request.user;

    const listRentalsByUserUseCase = _tsyringe.container.resolve(_ListRentalsByUserUseCase.default);

    const rentals = await listRentalsByUserUseCase.execute(id);
    return response.status(200).json(rentals);
  }

}

var _default = ListRentalsByUserController;
exports.default = _default;