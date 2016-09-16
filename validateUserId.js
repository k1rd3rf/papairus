
'use strict';
var Regexp = require("regexp");

function validateUserId(userId) {
  var idRegex = /^[a|A|c|C][c|C]\d{5}$/;
  return idRegex.test(userId)
}

module.exports = validateUserId;
