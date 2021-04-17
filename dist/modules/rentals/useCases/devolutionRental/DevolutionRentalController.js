"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _DevolutionRentalUseCase = _interopRequireDefault(require("./DevolutionRentalUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DevolutionRentalController {
  async handle(request, response) {
    const {
      id: user_id
    } = request.user;
    const {
      id
    } = request.params;

    const devolutionRentalUseCase = _tsyringe.container.resolve(_DevolutionRentalUseCase.default);

    const rental = await devolutionRentalUseCase.execute({
      id,
      user_id
    });
    return response.status(200).json(rental);
  }

}

var _default = DevolutionRentalController;
exports.default = _default;