"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _CreateRentalController = _interopRequireDefault(require("@modules/rentals/useCases/createRental/CreateRentalController"));

var _DevolutionRentalController = _interopRequireDefault(require("@modules/rentals/useCases/devolutionRental/DevolutionRentalController"));

var _ListRentalsByUserController = _interopRequireDefault(require("@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController"));

var _ensureAuthenticated = _interopRequireDefault(require("../middlewares/ensureAuthenticated"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rentalRoutes = (0, _express.Router)();
const createRentalcontroller = new _CreateRentalController.default();
const devolutionController = new _DevolutionRentalController.default();
const listRentalsByUserController = new _ListRentalsByUserController.default();
rentalRoutes.get('/', _ensureAuthenticated.default, listRentalsByUserController.handle);
rentalRoutes.post('/', _ensureAuthenticated.default, createRentalcontroller.handle);
rentalRoutes.post('/devolution/:id', _ensureAuthenticated.default, devolutionController.handle);
var _default = rentalRoutes;
exports.default = _default;