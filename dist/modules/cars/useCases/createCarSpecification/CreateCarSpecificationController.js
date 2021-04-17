"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _CreateCarSpecificationUseCase = _interopRequireDefault(require("./CreateCarSpecificationUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CreateCarSpecificationsController {
  async handle(request, response) {
    const {
      id
    } = request.params;
    const {
      specifications_id
    } = request.body;

    const createCarSpecificationsUseCase = _tsyringe.container.resolve(_CreateCarSpecificationUseCase.default);

    const cars = await createCarSpecificationsUseCase.execute({
      car_id: id,
      specifications_id
    });
    return response.status(201).json(cars);
  }

}

var _default = CreateCarSpecificationsController;
exports.default = _default;