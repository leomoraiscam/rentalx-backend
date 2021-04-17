"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _CreateCarUseCase = _interopRequireDefault(require("./CreateCarUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CreateCarController {
  async handle(request, response) {
    const {
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id
    } = request.body;

    const createCarUseCase = _tsyringe.container.resolve(_CreateCarUseCase.default);

    const car = await createCarUseCase.execute({
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id
    });
    return response.status(201).json(car);
  }

}

var _default = CreateCarController;
exports.default = _default;