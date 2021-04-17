"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _authenticate = _interopRequireDefault(require("./authenticate.routes"));

var _cars = _interopRequireDefault(require("./cars.routes"));

var _categories = _interopRequireDefault(require("./categories.routes"));

var _password = _interopRequireDefault(require("./password.routes"));

var _rental = _interopRequireDefault(require("./rental.routes"));

var _specification = _interopRequireDefault(require("./specification.routes"));

var _users = _interopRequireDefault(require("./users.routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = (0, _express.Router)();
routes.use('/categories', _categories.default);
routes.use('/specifications', _specification.default);
routes.use('/users', _users.default);
routes.use(_authenticate.default);
routes.use('/cars', _cars.default);
routes.use('/rentals', _rental.default);
routes.use('/password', _password.default);
var _default = routes;
exports.default = _default;