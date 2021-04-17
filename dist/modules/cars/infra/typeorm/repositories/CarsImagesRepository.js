"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _CarImage = _interopRequireDefault(require("../entities/CarImage"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CarImagesRepository {
  constructor() {
    this.repository = void 0;
    this.repository = (0, _typeorm.getRepository)(_CarImage.default);
  }

  async create(car_id, image_name) {
    const CarImage = this.repository.create({
      car_id,
      image_name
    });
    await this.repository.save(CarImage);
    return CarImage;
  }

}

var _default = CarImagesRepository;
exports.default = _default;