"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _upload = _interopRequireDefault(require("../../../../../config/upload"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LocalStorageProvider {
  async save(file, folder) {
    await _fs.default.promises.rename(_path.default.resolve(_upload.default.tmpFolder, file), _path.default.resolve(`${_upload.default.tmpFolder}/${folder}`, file));
    return file;
  }

  async delete(file, folder) {
    const filename = _path.default.resolve(`${_upload.default.tmpFolder}/${folder}`, file);

    try {
      await _fs.default.promises.stat(filename);
    } catch (error) {
      return;
    }

    await _fs.default.promises.unlink(filename);
  }

}

var _default = LocalStorageProvider;
exports.default = _default;