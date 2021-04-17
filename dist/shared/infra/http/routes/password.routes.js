"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _ResetPasswordUserController = _interopRequireDefault(require("../../../../modules/accounts/useCases/resetPasswordUser/ResetPasswordUserController"));

var _SendForgotPasswordMailController = _interopRequireDefault(require("../../../../modules/accounts/useCases/sendForgotPasswordMail/SendForgotPasswordMailController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const passwordRoutes = (0, _express.Router)();
const sendForgotPasswordMailController = new _SendForgotPasswordMailController.default();
const resetPasswordUserController = new _ResetPasswordUserController.default();
passwordRoutes.post('/forgot', sendForgotPasswordMailController.handle);
passwordRoutes.post('/reset', resetPasswordUserController.handle);
var _default = passwordRoutes;
exports.default = _default;