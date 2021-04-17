"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class MailProviderInMemory {
  constructor() {
    this.message = [];
  }

  async sendMail(to, subject, variables, path) {
    this.message.push({
      to,
      subject,
      variables,
      path
    });
  }

}

var _default = MailProviderInMemory;
exports.default = _default;