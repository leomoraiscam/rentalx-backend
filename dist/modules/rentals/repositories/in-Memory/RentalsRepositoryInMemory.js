"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Rentals = _interopRequireDefault(require("../../infra/typeorm/entities/Rentals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RentalsRepositoryInMemory {
  constructor() {
    this.rentals = [];
  }

  async findOpebRentalByCar(car_id) {
    const rental = this.rentals.find(rental => rental.car_id === car_id && !rental.end_date);
    return rental;
  }

  async findOpenRentalByUser(user_id) {
    const rental = this.rentals.find(rental => rental.car_id === user_id && !rental.end_date);
    return rental;
  }

  async findById(id) {
    return this.rentals.find(rental => rental.id === id);
  }

  async findByUser(user_id) {
    return this.rentals.filter(rental => rental.user_id === user_id);
  }

  async create({
    car_id,
    user_id,
    expected_return_date
  }) {
    const rental = new _Rentals.default();
    Object.assign(rental, {
      car_id,
      user_id,
      expected_return_date,
      start_date: new Date()
    });
    this.rentals.push(rental);
    return rental;
  }

}

var _default = RentalsRepositoryInMemory;
exports.default = _default;