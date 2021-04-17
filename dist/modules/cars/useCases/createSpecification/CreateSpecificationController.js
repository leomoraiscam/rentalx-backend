"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _CreateSpecificationUseCase = _interopRequireDefault(require("./CreateSpecificationUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CreateSpecificationController {
  handle(request, response) {
    const {
      name,
      description
    } = request.body;

    const createSpecificationUseCase = _tsyringe.container.resolve(_CreateSpecificationUseCase.default);

    createSpecificationUseCase.execute({
      name,
      description
    });
    return response.status(201).send();
  }

}

var _default = CreateSpecificationController;
exports.default = _default;