
'use strict';
var Regexp = require("regexp");

var exports = module.exports = {}
exports.validateUserId = function validateUserId(userId) {
  var idRegex = /^[a|A|c|C][c|C]\d{5}$/;
  return idRegex.test(userId)
}
