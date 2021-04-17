"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _Car = _interopRequireDefault(require("@modules/cars/infra/typeorm/entities/Car"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CarsRepository {
  constructor() {
    this.repository = void 0;
    this.repository = (0, _typeorm.getRepository)(_Car.default);
  }

  async findAvailable(name, brand, category_id) {
    const carsQuery = this.repository.createQueryBuilder('c').where('available = :available', {
      available: true
    });

    if (name) {
      carsQuery.andWhere('c.name = :name', {
        name
      });
    }

    if (brand) {
      carsQuery.andWhere('c.brand = :brand', {
        brand
      });
    }

    if (category_id) {
      carsQuery.andWhere('c.category_id = :category_id', {
        category_id
      });
    }

    const cars = await carsQuery.getMany();
    return cars;
  }

  async findById(id) {
    const car = await this.repository.findOne(id);
    return car;
  }

  async findByLicensePlate(license_plate) {
    const car = this.repository.findOne({
      license_plate
    });
    return car;
  }

  async create({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
    specifications,
    id
  }) {
    const car = this.repository.create({
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
      specifications
    });
    await this.repository.save(car);
    return car;
  }

  async updateAvailable(id, available) {
    await this.repository.createQueryBuilder().update().set({
      available
    }).where('id = :id').setParameters({
      id
    }).execute();
  }

}

var _default = CarsRepository;
exports.default = _default;