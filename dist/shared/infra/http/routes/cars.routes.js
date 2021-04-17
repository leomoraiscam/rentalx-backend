"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _multer = _interopRequireDefault(require("multer"));

var _upload = _interopRequireDefault(require("../../../../config/upload"));

var _CreateCarController = _interopRequireDefault(require("../../../../modules/cars/useCases/createCar/CreateCarController"));

var _CreateCarSpecificationController = _interopRequireDefault(require("../../../../modules/cars/useCases/createCarSpecification/CreateCarSpecificationController"));

var _ListAvailableCarsController = _interopRequireDefault(require("../../../../modules/cars/useCases/listAvailableCars/ListAvailableCarsController"));

var _UploadCarImagesController = _interopRequireDefault(require("../../../../modules/cars/useCases/UploadCarImage/UploadCarImagesController"));

var _ensureAdmin = _interopRequireDefault(require("../middlewares/ensureAdmin"));

var _ensureAuthenticated = _interopRequireDefault(require("../middlewares/ensureAuthenticated"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const carsRoutes = (0, _express.Router)();
const uploadImages = (0, _multer.default)(_upload.default);
const createCarController = new _CreateCarController.default();
const listAvailableCarsController = new _ListAvailableCarsController.default();
const createCarSpecificationsController = new _CreateCarSpecificationController.default();
const uploadCarImagesController = new _UploadCarImagesController.default();
carsRoutes.post('/', _ensureAuthenticated.default, _ensureAdmin.default, createCarController.handle);
carsRoutes.post('/specifications/:id', _ensureAuthenticated.default, _ensureAdmin.default, createCarSpecificationsController.handle);
carsRoutes.get('/available', listAvailableCarsController.handle);
carsRoutes.post('/images/:id', _ensureAuthenticated.default, _ensureAdmin.default, uploadImages.array('images'), uploadCarImagesController.handle);
var _default = carsRoutes;
exports.default = _default;