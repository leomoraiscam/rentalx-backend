"use strict";

var _tsyringe = require("tsyringe");

var _DayjsDateProvider = _interopRequireDefault(require("./DateProvider/implementations/DayjsDateProvider"));

var _EtherealMailProvider = _interopRequireDefault(require("./MailProvider/implementations/EtherealMailProvider"));

var _LocalStorageProvider = _interopRequireDefault(require("./StorageProvider/implementations/LocalStorageProvider"));

var _S3StorageProvider = _interopRequireDefault(require("./StorageProvider/implementations/S3StorageProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('DayjsDateProvider', _DayjsDateProvider.default);

_tsyringe.container.registerInstance('EtherealMailProvider', new _EtherealMailProvider.default());

const diskStorage = {
  local: _LocalStorageProvider.default,
  s3: _S3StorageProvider.default
};

_tsyringe.container.registerSingleton('StorageProvider', diskStorage[process.env.DISK]);