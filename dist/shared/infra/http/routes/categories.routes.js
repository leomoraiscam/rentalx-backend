"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _multer = _interopRequireDefault(require("multer"));

var _CreateCategoryController = _interopRequireDefault(require("@modules/cars/useCases/createCategory/CreateCategoryController"));

var _importCategoryController = _interopRequireDefault(require("@modules/cars/useCases/importCategory/importCategoryController"));

var _ListCategoriesController = _interopRequireDefault(require("@modules/cars/useCases/listCategories/ListCategoriesController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const categoriesRoutes = (0, _express.Router)();
const upload = (0, _multer.default)({
  dest: './tmp'
});
const createCategoryController = new _CreateCategoryController.default();
const importCategoryController = new _importCategoryController.default();
const listCategoriesController = new _ListCategoriesController.default();
categoriesRoutes.get('/', listCategoriesController.handle);
categoriesRoutes.post('/', createCategoryController.handle);
categoriesRoutes.post('/import', upload.single('file'), importCategoryController.handle);
var _default = categoriesRoutes;
exports.default = _default;