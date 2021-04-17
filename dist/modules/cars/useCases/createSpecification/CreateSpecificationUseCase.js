"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ISpecificationRepository = _interopRequireDefault(require("@modules/cars/repositories/ISpecificationRepository"));

var _AppError = _interopRequireDefault(require("@shared/errors/AppError"));

var _dec, _dec2, _dec3, _dec4, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CreateSpecificationUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('SpecificationsRepository')(target, undefined, 0);
}, _dec3 = Reflect.metadata("design:type", Function), _dec4 = Reflect.metadata("design:paramtypes", [typeof _ISpecificationRepository.default === "undefined" ? Object : _ISpecificationRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = class CreateSpecificationUseCase {
  constructor(specificationRepository) {
    this.specificationRepository = specificationRepository;
  }

  async execute({
    name,
    description
  }) {
    const categoryAlredyExist = await this.specificationRepository.findByName(name);

    if (categoryAlredyExist) {
      throw new _AppError.default('Specification alredy exist');
    }

    await this.specificationRepository.create({
      name,
      description
    });
  }

}) || _class) || _class) || _class) || _class);
var _default = CreateSpecificationUseCase;
exports.default = _default;