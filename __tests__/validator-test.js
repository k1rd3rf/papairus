
'use strict';

test('Check validateUserId', () => {
  const validator = require("../validator.js");
expect(validator.validateUserId("AC32145")).toBe(true);
});
