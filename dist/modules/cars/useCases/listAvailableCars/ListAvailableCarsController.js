"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ListAvailableCarsUseCase = _interopRequireDefault(require("./ListAvailableCarsUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ListAvailableCarsController {
  async handle(request, response) {
    const {
      category_id,
      brand,
      name
    } = request.query;

    const listAvailableCarsUseCase = _tsyringe.container.resolve(_ListAvailableCarsUseCase.default);

    const cars = await listAvailableCarsUseCase.execute({
      brand: brand,
      name: name,
      category_id: category_id
    });
    return response.status(200).json(cars);
  }

}

var _default = ListAvailableCarsController;
exports.default = _default;