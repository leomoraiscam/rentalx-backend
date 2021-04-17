"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _AuthenticatedUserController = _interopRequireDefault(require("@modules/accounts/useCases/authenticateUser/AuthenticatedUserController"));

var _RefreshTokenController = _interopRequireDefault(require("@modules/accounts/useCases/refreshToken/RefreshTokenController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const authenticateRoutes = (0, _express.Router)();
const authenticatedUserController = new _AuthenticatedUserController.default();
const refreshTokenController = new _RefreshTokenController.default();
authenticateRoutes.post('/sessions', authenticatedUserController.handle);
authenticateRoutes.post('/refresh-token', refreshTokenController.handle);
var _default = authenticateRoutes;
exports.default = _default;