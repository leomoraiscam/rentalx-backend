"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Specification = _interopRequireDefault(require("../../infra/typeorm/entities/Specification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SpecificationInMemory {
  constructor() {
    this.specification = [];
  }

  async findByName(name) {
    const specification = this.specification.find(specification => specification.name === name);
    return specification;
  }

  async create({
    name,
    description
  }) {
    const specification = new _Specification.default();
    Object.assign(specification, {
      name,
      description
    });
    this.specification.push(specification);
    return specification;
  }

  async findByIds(ids) {
    const allSpecifications = this.specification.filter(specication => ids.includes(specication.id));
    return allSpecifications;
  }

}

var _default = SpecificationInMemory;
exports.default = _default;