
'use strict';

test('Check validateUserId', () => {
  const validateUserId = require('../validateUserId');
expect(validateUserId("AC32145")).toBe(true);
});
