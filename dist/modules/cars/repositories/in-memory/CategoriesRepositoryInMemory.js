"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Category = _interopRequireDefault(require("../../infra/typeorm/entities/Category"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CategoriesRepositoryInMemory {
  constructor() {
    this.categories = [];
  }

  async findByName(name) {
    const category = this.categories.find(category => category.name === name);
    return category;
  }

  async list() {
    return this.categories;
  }

  async create({
    name,
    description
  }) {
    const category = new _Category.default();
    Object.assign(category, {
      name,
      description
    });
    this.categories.push(category);
  }

}

var _default = CategoriesRepositoryInMemory;
exports.default = _default;