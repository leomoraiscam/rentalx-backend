"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _multer = _interopRequireDefault(require("multer"));

var _upload = _interopRequireDefault(require("@config/upload"));

var _CreateUserController = _interopRequireDefault(require("@modules/accounts/useCases/createUser/CreateUserController"));

var _ProfileUserController = _interopRequireDefault(require("@modules/accounts/useCases/profileUser/ProfileUserController"));

var _UpdateUserAvatarController = _interopRequireDefault(require("@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController"));

var _ensureAuthenticated = _interopRequireDefault(require("../middlewares/ensureAuthenticated"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const usersRoutes = (0, _express.Router)();
const uploadAvatar = (0, _multer.default)(_upload.default);
const createUserController = new _CreateUserController.default();
const updateUserAvatarController = new _UpdateUserAvatarController.default();
const profileUserController = new _ProfileUserController.default();
usersRoutes.get('/profile', _ensureAuthenticated.default, profileUserController.handle);
usersRoutes.post('/', createUserController.handle);
usersRoutes.patch('/avatar', _ensureAuthenticated.default, uploadAvatar.single('avatar'), updateUserAvatarController.handle);
var _default = usersRoutes;
exports.default = _default;