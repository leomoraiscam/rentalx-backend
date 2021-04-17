"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Car = _interopRequireDefault(require("@modules/cars/infra/typeorm/entities/Car"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CarsRepositoryInMemory {
  constructor() {
    this.car = [];
  }

  async findAvailable(category_id, brand, name) {
    const cars = this.car.filter(car => {
      if (car.available === true || brand && car.brand === brand || category_id && car.category_id === category_id || name && car.name === name) {
        return car;
      }

      return null;
    });
    return cars;
  }

  async findById(id) {
    return this.car.find(car => car.id === id);
  }

  async findByLicensePlate(license_plate) {
    const car = this.car.find(car => car.license_plate === license_plate);
    return car;
  }

  async create({
    name,
    description,
    brand,
    fine_amount,
    license_plate,
    daily_rate,
    category_id,
    id
  }) {
    const car = new _Car.default();
    Object.assign(car, {
      name,
      description,
      brand,
      fine_amount,
      license_plate,
      daily_rate,
      category_id,
      id
    });
    this.car.push(car);
    return car;
  }

  async updateAvailable(id, available) {
    const findIndex = this.car.findIndex(car => car.id === id);
    this.car[findIndex].available = available;
  }

}

var _default = CarsRepositoryInMemory;
exports.default = _default;