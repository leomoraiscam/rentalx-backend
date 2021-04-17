"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _CreateRentalUseCase = _interopRequireDefault(require("./CreateRentalUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CreateRentalcontroller {
  async handle(request, response) {
    const {
      expected_return_date,
      car_id
    } = request.body;
    const {
      id
    } = request.user;

    const createRentalUseCase = _tsyringe.container.resolve(_CreateRentalUseCase.default);

    const rental = await createRentalUseCase.execute({
      car_id,
      user_id: id,
      expected_return_date
    });
    return response.status(201).json(rental);
  }

}

var _default = CreateRentalcontroller;
exports.default = _default;