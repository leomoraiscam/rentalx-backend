"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ICategoriesRepository = _interopRequireDefault(require("../../repositories/ICategoriesRepository"));

var _AppError = _interopRequireDefault(require("../../../../shared/errors/AppError"));

var _dec, _dec2, _dec3, _dec4, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let CreateCategoryUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('CategoryRepository')(target, undefined, 0);
}, _dec3 = Reflect.metadata("design:type", Function), _dec4 = Reflect.metadata("design:paramtypes", [typeof _ICategoriesRepository.default === "undefined" ? Object : _ICategoriesRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = class CreateCategoryUseCase {
  constructor(categoriesRepository) {
    this.categoriesRepository = categoriesRepository;
  }

  async execute({
    name,
    description
  }) {
    const categoryAlredyExist = await this.categoriesRepository.findByName(name);

    if (categoryAlredyExist) {
      throw new _AppError.default('Category alredy exist');
    }

    await this.categoriesRepository.create({
      name,
      description
    });
  }

}) || _class) || _class) || _class) || _class);
var _default = CreateCategoryUseCase;
exports.default = _default;