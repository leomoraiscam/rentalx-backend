"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _CreateSpecificationController = _interopRequireDefault(require("@modules/cars/useCases/createSpecification/CreateSpecificationController"));

var _ensureAuthenticated = _interopRequireDefault(require("../middlewares/ensureAuthenticated"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const specificationRoutes = (0, _express.Router)();
const createSpecificationController = new _CreateSpecificationController.default();
specificationRoutes.post('/', _ensureAuthenticated.default, createSpecificationController.handle);
var _default = specificationRoutes;
exports.default = _default;