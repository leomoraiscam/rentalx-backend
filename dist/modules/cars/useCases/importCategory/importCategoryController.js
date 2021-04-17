"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ImportCategoryUseCase = _interopRequireDefault(require("./ImportCategoryUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ImportCategoryController {
  async handle(request, response) {
    const {
      file
    } = request;

    const importCategoryController = _tsyringe.container.resolve(_ImportCategoryUseCase.default);

    await importCategoryController.execute(file);
    return response.status(201).send();
  }

}

var _default = ImportCategoryController;
exports.default = _default;