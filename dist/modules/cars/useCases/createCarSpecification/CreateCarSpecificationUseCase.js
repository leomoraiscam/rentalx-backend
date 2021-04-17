"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ICarsRepository = _interopRequireDefault(require("../../repositories/ICarsRepository"));

var _ISpecificationRepository = _interopRequireDefault(require("../../repositories/ISpecificationRepository"));

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CreateCarsSpecificationsUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('CarsRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('SpecificationsRepository')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _ICarsRepository.default === "undefined" ? Object : _ICarsRepository.default, typeof _ISpecificationRepository.default === "undefined" ? Object : _ISpecificationRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class CreateCarsSpecificationsUseCase {
  constructor(carsRepository, specificationsRepository) {
    this.carsRepository = carsRepository;
    this.specificationsRepository = specificationsRepository;
  }

  async execute({
    car_id,
    specifications_id
  }) {
    const carsExist = await await this.carsRepository.findById(car_id);

    if (!carsExist) {
      throw new _AppError.default('Car does not exist!');
    }

    const specifications = await this.specificationsRepository.findByIds(specifications_id);
    carsExist.specifications = specifications;
    await this.carsRepository.create(carsExist);
    return carsExist;
  }

}) || _class) || _class) || _class) || _class) || _class);
var _default = CreateCarsSpecificationsUseCase;
exports.default = _default;