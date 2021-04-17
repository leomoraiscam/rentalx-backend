"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _CreateCategoryUseCase = _interopRequireDefault(require("./CreateCategoryUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CreateCategoryController {
  async handle(request, response) {
    const {
      name,
      description
    } = request.body;

    const createCategoryUseCase = _tsyringe.container.resolve(_CreateCategoryUseCase.default);

    await createCategoryUseCase.execute({
      name,
      description
    });
    return response.status(201).send();
  }

}

var _default = CreateCategoryController;
exports.default = _default;