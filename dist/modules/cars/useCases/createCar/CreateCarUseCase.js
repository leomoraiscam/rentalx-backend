"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _AppError = _interopRequireDefault(require("@shared/errors/AppError"));

var _ICarsRepository = _interopRequireDefault(require("../../repositories/ICarsRepository"));

var _dec, _dec2, _dec3, _dec4, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CreateCarUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('CarsRepository')(target, undefined, 0);
}, _dec3 = Reflect.metadata("design:type", Function), _dec4 = Reflect.metadata("design:paramtypes", [typeof _ICarsRepository.default === "undefined" ? Object : _ICarsRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = class CreateCarUseCase {
  constructor(carsRepository) {
    this.carsRepository = carsRepository;
  }

  async execute({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id
  }) {
    const carAlredyExist = await this.carsRepository.findByLicensePlate(license_plate);

    if (carAlredyExist) {
      throw new _AppError.default('Car alredy exist', 400);
    }

    const car = await this.carsRepository.create({
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id
    });
    return car;
  }

}) || _class) || _class) || _class) || _class);
var _default = CreateCarUseCase;
exports.default = _default;