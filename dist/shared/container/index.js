"use strict";

var _tsyringe = require("tsyringe");

require("./providers");

var _UsersRepository = _interopRequireDefault(require("../../modules/accounts/infra/typeorm/repositories/UsersRepository"));

var _UsersTokensRepository = _interopRequireDefault(require("../../modules/accounts/infra/typeorm/repositories/UsersTokensRepository"));

var _CarsRepository = _interopRequireDefault(require("../../modules/cars/infra/typeorm/repositories/CarsRepository"));

var _SpecificationRepository = _interopRequireDefault(require("../../modules/cars/infra/typeorm/repositories/SpecificationRepository"));

var _CarsImagesRepository = _interopRequireDefault(require("../../modules/cars/infra/typeorm/repositories/CarsImagesRepository"));

var _CategoriesRepository = _interopRequireDefault(require("../../modules/cars/infra/typeorm/repositories/CategoriesRepository"));

var _RentalsRepository = _interopRequireDefault(require("../../modules/rentals/infra/typeorm/repositories/RentalsRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('CategoryRepository', _CategoriesRepository.default);

_tsyringe.container.registerSingleton('SpecificationsRepository', _SpecificationRepository.default);

_tsyringe.container.registerSingleton('UserRepository', _UsersRepository.default);

_tsyringe.container.registerSingleton('CarsRepository', _CarsRepository.default);

_tsyringe.container.registerSingleton('CarsImagesRepository', _CarsImagesRepository.default);

_tsyringe.container.registerSingleton('RentalsRepository', _RentalsRepository.default);

_tsyringe.container.registerSingleton('UsersTokensRepository', _UsersTokensRepository.default);