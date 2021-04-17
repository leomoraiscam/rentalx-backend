"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _Rentals = _interopRequireDefault(require("@modules/rentals/infra/typeorm/entities/Rentals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RentalsRepository {
  constructor() {
    this.repository = void 0;
    this.repository = (0, _typeorm.getRepository)(_Rentals.default);
  }

  async findById(id) {
    const rental = await this.repository.findOne(id);
    return rental;
  }

  async findByUser(user_id) {
    const rentals = await this.repository.find({
      where: {
        user_id
      },
      relations: ['car']
    });
    return rentals;
  }

  async findOpebRentalByCar(car_id) {
    const openBycar = await this.repository.findOne({
      car_id,
      end_date: null
    });
    return openBycar;
  }

  async findOpenRentalByUser(user_id) {
    const openByUser = this.repository.findOne({
      where: {
        user_id,
        end_date: null
      }
    });
    return openByUser;
  }

  async create({
    car_id,
    user_id,
    expected_return_date,
    id,
    end_date,
    total
  }) {
    const rental = this.repository.create({
      car_id,
      user_id,
      expected_return_date,
      id,
      end_date,
      total
    });
    await this.repository.save(rental);
    return rental;
  }

}

var _default = RentalsRepository;
exports.default = _default;