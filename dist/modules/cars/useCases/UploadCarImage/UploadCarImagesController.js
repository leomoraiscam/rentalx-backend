"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _UploadCarImagesUseCase = _interopRequireDefault(require("./UploadCarImagesUseCase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UploadCarImagesController {
  async handle(request, response) {
    const {
      id
    } = request.params;
    const images = request.files;

    const uploadCarImageUseCase = _tsyringe.container.resolve(_UploadCarImagesUseCase.default);

    const images_name = images.map(file => file.filename);
    await uploadCarImageUseCase.execute({
      car_id: id,
      images_name
    });
    return response.status(201).send();
  }

}

var _default = UploadCarImagesController;
exports.default = _default;