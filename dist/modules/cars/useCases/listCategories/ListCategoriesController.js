"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ListCategoriesUseCase = _interopRequireDefault(require("./ListCategoriesUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ListCategoriesController {
  async handle(request, response) {
    const listCategoriesUseCase = _tsyringe.container.resolve(_ListCategoriesUseCase.default);

    const categories = await listCategoriesUseCase.execute();
    return response.status(200).json(categories);
  }

}

var _default = ListCategoriesController;
exports.default = _default;