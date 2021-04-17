"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _Category = _interopRequireDefault(require("@modules/cars/infra/typeorm/entities/Category"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CategoriesRepository {
  constructor() {
    this.repository = void 0;
    this.repository = (0, _typeorm.getRepository)(_Category.default);
  }

  async list() {
    const categories = await this.repository.find();
    return categories;
  }

  async create({
    name,
    description
  }) {
    const categorie = this.repository.create({
      name,
      description
    });
    await this.repository.save(categorie);
  }

  async findByName(name) {
    const category = this.repository.findOne({
      name
    });
    return category;
  }

}

var _default = CategoriesRepository;
exports.default = _default;