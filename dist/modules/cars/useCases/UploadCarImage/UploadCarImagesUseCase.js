"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ICarsImagesRepository = _interopRequireDefault(require("../../repositories/ICarsImagesRepository"));

var _IStorageProvider = _interopRequireDefault(require("../../../../shared/container/providers/StorageProvider/IStorageProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let UploadCarImageUseCase = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('CarsImagesRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('StorageProvider')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _ICarsImagesRepository.default === "undefined" ? Object : _ICarsImagesRepository.default, typeof _IStorageProvider.default === "undefined" ? Object : _IStorageProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class UploadCarImageUseCase {
  constructor(carsImagesRepository, storageProvider) {
    this.carsImagesRepository = carsImagesRepository;
    this.storageProvider = storageProvider;
  }

  async execute({
    car_id,
    images_name
  }) {
    images_name.map(async image => {
      await this.carsImagesRepository.create(car_id, image);
      await this.storageProvider.save(image, 'cars');
    });
  }

}) || _class) || _class) || _class) || _class) || _class);
var _default = UploadCarImageUseCase;
exports.default = _default;